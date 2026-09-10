package com.route3d.busmanagement.service;

import com.route3d.busmanagement.dto.BookingRequest;
import com.route3d.busmanagement.dto.BookingResponse;
import com.route3d.busmanagement.dto.PassengerRequest;
import com.route3d.busmanagement.entity.*;
import com.route3d.busmanagement.exception.InvalidBookingException;
import com.route3d.busmanagement.exception.ResourceNotFoundException;
import com.route3d.busmanagement.exception.SeatUnavailableException;
import com.route3d.busmanagement.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ScheduleRepository scheduleRepository;
    private final SeatRepository seatRepository;
    private final PassengerRepository passengerRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public BookingService(BookingRepository bookingRepository,
                          BookingSeatRepository bookingSeatRepository,
                          ScheduleRepository scheduleRepository,
                          SeatRepository seatRepository,
                          PassengerRepository passengerRepository,
                          UserRepository userRepository,
                          AuditLogRepository auditLogRepository) {
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.scheduleRepository = scheduleRepository;
        this.seatRepository = seatRepository;
        this.passengerRepository = passengerRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    /**
     * Concurrency-Safe Atomic Booking Transaction
     * Prevents Double-Booking race conditions using @Transactional isolation and schedule-seat locks.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        // 1. Fetch User and Schedule
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + request.getScheduleId()));

        if (!"SCHEDULED".equalsIgnoreCase(schedule.getStatus())) {
            throw new InvalidBookingException("This schedule is no longer open for booking (Status: " + schedule.getStatus() + ").");
        }

        // 2. Extract and validate requested seat IDs
        List<Long> requestedSeatIds = request.getPassengers().stream()
                .map(PassengerRequest::getSeatId)
                .collect(Collectors.toList());

        Set<Long> uniqueSeatIds = new HashSet<>(requestedSeatIds);
        if (uniqueSeatIds.size() != requestedSeatIds.size()) {
            throw new InvalidBookingException("Duplicate seats detected in booking request.");
        }

        // 3. Concurrency check: Verify none of the seats are already reserved for this schedule
        List<BookingSeat> existingReservations = bookingSeatRepository.findReservedSeats(schedule.getId(), requestedSeatIds);
        if (!existingReservations.isEmpty()) {
            String occupiedSeats = existingReservations.stream()
                    .map(bs -> bs.getSeat().getSeatNumber())
                    .collect(Collectors.joining(", "));
            throw new SeatUnavailableException("Seat(s) " + occupiedSeats + " are already booked. Please choose other seats.");
        }

        // 4. Fetch physical seat entities and verify they belong to the bus and are not blocked
        List<Seat> physicalSeats = seatRepository.findAllById(requestedSeatIds);
        if (physicalSeats.size() != requestedSeatIds.size()) {
            throw new ResourceNotFoundException("One or more selected seats could not be found.");
        }

        for (Seat seat : physicalSeats) {
            if (!seat.getBus().getId().equals(schedule.getBus().getId())) {
                throw new InvalidBookingException("Seat " + seat.getSeatNumber() + " does not belong to this bus.");
            }
            if (Boolean.TRUE.equals(seat.getIsBlocked())) {
                throw new SeatUnavailableException("Seat " + seat.getSeatNumber() + " is currently blocked by administration.");
            }
        }

        Map<Long, Seat> seatMap = physicalSeats.stream()
                .collect(Collectors.toMap(Seat::getId, s -> s));

        // 5. Calculate total fare
        BigDecimal baseFare = schedule.getBaseFare();
        BigDecimal totalAmount = baseFare.multiply(BigDecimal.valueOf(requestedSeatIds.size()));

        // 6. Generate Unique Professional Booking Reference (e.g. BMS20260910123456)
        String timestampPart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        int randomSuffix = 1000 + new Random().nextInt(9000);
        String bookingNumber = "Route3D-" + timestampPart + "-" + randomSuffix;

        // 7. Create and persist Booking
        Booking booking = new Booking(
                bookingNumber,
                user,
                schedule,
                totalAmount,
                request.getPaymentReference() != null ? request.getPaymentReference() : "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()
        );
        Booking savedBooking = bookingRepository.save(booking);

        // 8. Create and persist BookingSeats & Passengers
        List<BookingSeat> bookingSeatsList = new ArrayList<>();
        List<Passenger> passengersList = new ArrayList<>();

        for (PassengerRequest pReq : request.getPassengers()) {
            Seat seat = seatMap.get(pReq.getSeatId());

            BookingSeat bookingSeat = new BookingSeat(savedBooking, schedule, seat, baseFare);
            bookingSeatsList.add(bookingSeat);

            Passenger passenger = new Passenger(
                    savedBooking,
                    seat,
                    pReq.getPassengerName().trim(),
                    pReq.getAge(),
                    pReq.getGender(),
                    pReq.getContactNumber()
            );
            passengersList.add(passenger);
        }

        bookingSeatRepository.saveAll(bookingSeatsList);
        passengerRepository.saveAll(passengersList);

        savedBooking.setBookingSeats(bookingSeatsList);
        savedBooking.setPassengers(passengersList);

        // 9. Audit Logging
        auditLogRepository.save(new AuditLog(
                "BOOKING_CONFIRMED",
                user.getEmail(),
                "Booking " + bookingNumber + " created for Schedule " + schedule.getId() + ", Seats: " + physicalSeats.stream().map(Seat::getSeatNumber).collect(Collectors.joining(","))
        ));

        return mapToBookingResponse(savedBooking);
    }

    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        return bookingRepository.findByUserIdOrderByBookingTimeDesc(user.getId()).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long id, String userEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        if (!isAdmin && !booking.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new InvalidBookingException("You are not authorized to view this booking.");
        }

        return mapToBookingResponse(booking);
    }

    public BookingResponse getBookingByNumber(String bookingNumber) {
        Booking booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + bookingNumber));
        return mapToBookingResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id, String userEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        if (!isAdmin && !booking.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new InvalidBookingException("You are not authorized to cancel this booking.");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new InvalidBookingException("This booking is already cancelled.");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setPaymentStatus(PaymentStatus.REFUNDED);

        // Release the seats for this schedule
        List<BookingSeat> seats = booking.getBookingSeats();
        for (BookingSeat bs : seats) {
            bs.setStatus("CANCELLED");
        }
        bookingSeatRepository.saveAll(seats);

        Booking updated = bookingRepository.save(booking);

        auditLogRepository.save(new AuditLog(
                "BOOKING_CANCELLED",
                userEmail,
                "Booking " + booking.getBookingNumber() + " was cancelled."
        ));

        return mapToBookingResponse(updated);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findRecentBookings().stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse mapToBookingResponse(Booking b) {
        BookingResponse resp = new BookingResponse();
        resp.setId(b.getId());
        resp.setBookingNumber(b.getBookingNumber());
        resp.setUserId(b.getUser().getId());
        resp.setUserEmail(b.getUser().getEmail());
        resp.setScheduleId(b.getSchedule().getId());
        resp.setBusName(b.getSchedule().getBus().getBusName());
        resp.setBusNumber(b.getSchedule().getBus().getBusNumber());
        resp.setBusType(b.getSchedule().getBus().getBusType().name());
        resp.setOperatorName(b.getSchedule().getBus().getOperator().getName());
        resp.setOperatorLogo(b.getSchedule().getBus().getOperator().getLogoUrl());
        resp.setSourceCity(b.getSchedule().getRoute().getSourceCity());
        resp.setSourceState(b.getSchedule().getRoute().getSourceState());
        resp.setDestinationCity(b.getSchedule().getRoute().getDestinationCity());
        resp.setDestinationState(b.getSchedule().getRoute().getDestinationState());
        resp.setTravelDate(b.getSchedule().getTravelDate());
        resp.setDepartureTime(b.getSchedule().getDepartureTime());
        resp.setArrivalTime(b.getSchedule().getArrivalTime());
        resp.setTotalAmount(b.getTotalAmount());
        resp.setBookingStatus(b.getBookingStatus());
        resp.setPaymentStatus(b.getPaymentStatus());
        resp.setBookingTime(b.getBookingTime());

        List<String> seatNumbers = b.getBookingSeats().stream()
                .map(bs -> bs.getSeat().getSeatNumber())
                .collect(Collectors.toList());
        resp.setSeatNumbers(seatNumbers);

        List<BookingResponse.PassengerDetailDTO> passengers = b.getPassengers().stream()
                .map(p -> new BookingResponse.PassengerDetailDTO(
                        p.getPassengerName(),
                        p.getAge(),
                        p.getGender(),
                        p.getSeat().getSeatNumber()
                )).collect(Collectors.toList());
        resp.setPassengers(passengers);

        if (!passengers.isEmpty()) {
            resp.setPassengerLeadName(passengers.get(0).getName());
        } else {
            resp.setPassengerLeadName(b.getUser().getFullName());
        }

        // Generate QR code data payload for verification on PDF ticket
        resp.setQrCodeData("Route3D-TICKET-REF:" + b.getBookingNumber() + "|BUS:" + b.getSchedule().getBus().getBusNumber() + "|SEATS:" + String.join(",", seatNumbers) + "|STATUS:" + b.getBookingStatus());

        return resp;
    }
}
