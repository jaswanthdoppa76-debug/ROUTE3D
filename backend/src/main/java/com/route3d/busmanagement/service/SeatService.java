package com.route3d.busmanagement.service;

import com.route3d.busmanagement.dto.SeatBlockRequest;
import com.route3d.busmanagement.dto.SeatResponse;
import com.route3d.busmanagement.entity.BookingSeat;
import com.route3d.busmanagement.entity.Schedule;
import com.route3d.busmanagement.entity.Seat;
import com.route3d.busmanagement.exception.ResourceNotFoundException;
import com.route3d.busmanagement.repository.BookingSeatRepository;
import com.route3d.busmanagement.repository.ScheduleRepository;
import com.route3d.busmanagement.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final ScheduleRepository scheduleRepository;
    private final BookingSeatRepository bookingSeatRepository;

    public SeatService(SeatRepository seatRepository,
                       ScheduleRepository scheduleRepository,
                       BookingSeatRepository bookingSeatRepository) {
        this.seatRepository = seatRepository;
        this.scheduleRepository = scheduleRepository;
        this.bookingSeatRepository = bookingSeatRepository;
    }

    public List<SeatResponse> getSeatsForSchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + scheduleId));

        Long busId = schedule.getBus().getId();
        List<Seat> physicalSeats = seatRepository.findByBusIdOrderByDeckAscRowIndexAscColIndexAsc(busId);

        // Get currently reserved seat IDs for this schedule
        List<BookingSeat> reservedSeats = bookingSeatRepository.findByScheduleIdAndStatus(scheduleId, "RESERVED");
        Set<Long> reservedSeatIds = reservedSeats.stream()
                .map(bs -> bs.getSeat().getId())
                .collect(Collectors.toSet());

        return physicalSeats.stream().map(seat -> {
            String status;
            if (Boolean.TRUE.equals(seat.getIsBlocked())) {
                status = "BLOCKED";
            } else if (reservedSeatIds.contains(seat.getId())) {
                status = "BOOKED";
            } else {
                status = "AVAILABLE";
            }

            return new SeatResponse(
                    seat.getId(),
                    seat.getSeatNumber(),
                    seat.getSeatType(),
                    seat.getDeck(),
                    seat.getRowIndex(),
                    seat.getColIndex(),
                    schedule.getBaseFare(),
                    status
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public void toggleSeatBlock(SeatBlockRequest request) {
        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        for (Seat seat : seats) {
            seat.setIsBlocked(request.isBlocked());
        }
        seatRepository.saveAll(seats);
    }
}
