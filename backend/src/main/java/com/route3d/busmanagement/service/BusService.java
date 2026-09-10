package com.route3d.busmanagement.service;

import com.route3d.busmanagement.dto.BusRequest;
import com.route3d.busmanagement.dto.BusResponse;
import com.route3d.busmanagement.entity.*;
import com.route3d.busmanagement.exception.ResourceNotFoundException;
import com.route3d.busmanagement.repository.AmenityRepository;
import com.route3d.busmanagement.repository.BusRepository;
import com.route3d.busmanagement.repository.OperatorRepository;
import com.route3d.busmanagement.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BusService {

    private final BusRepository busRepository;
    private final OperatorRepository operatorRepository;
    private final AmenityRepository amenityRepository;
    private final SeatRepository seatRepository;

    public BusService(BusRepository busRepository,
                      OperatorRepository operatorRepository,
                      AmenityRepository amenityRepository,
                      SeatRepository seatRepository) {
        this.busRepository = busRepository;
        this.operatorRepository = operatorRepository;
        this.amenityRepository = amenityRepository;
        this.seatRepository = seatRepository;
    }

    public List<BusResponse> getAllBuses() {
        return busRepository.findAll().stream()
                .map(this::mapToBusResponse)
                .collect(Collectors.toList());
    }

    public BusResponse getBusById(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + id));
        return mapToBusResponse(bus);
    }

    @Transactional
    public BusResponse createBus(BusRequest request) {
        Operator operator = operatorRepository.findById(request.getOperatorId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found with ID: " + request.getOperatorId()));

        Bus bus = new Bus();
        bus.setOperator(operator);
        bus.setBusNumber(request.getBusNumber().trim().toUpperCase());
        bus.setBusName(request.getBusName().trim());
        bus.setBusType(request.getBusType());
        bus.setTotalSeats(request.getTotalSeats());
        bus.setLayoutType(request.getLayoutType() != null ? request.getLayoutType() : "SEATER_2X2");
        bus.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        if (request.getAmenityIds() != null && !request.getAmenityIds().isEmpty()) {
            Set<Amenity> amenities = new HashSet<>(amenityRepository.findAllById(request.getAmenityIds()));
            bus.setAmenities(amenities);
        }

        Bus savedBus = busRepository.save(bus);

        // Generate physical seat layout for the bus automatically
        generatePhysicalSeats(savedBus);

        return mapToBusResponse(savedBus);
    }

    @Transactional
    public BusResponse updateBus(Long id, BusRequest request) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + id));

        Operator operator = operatorRepository.findById(request.getOperatorId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found with ID: " + request.getOperatorId()));

        bus.setOperator(operator);
        bus.setBusNumber(request.getBusNumber().trim().toUpperCase());
        bus.setBusName(request.getBusName().trim());
        bus.setBusType(request.getBusType());
        bus.setStatus(request.getStatus());

        if (request.getAmenityIds() != null) {
            Set<Amenity> amenities = new HashSet<>(amenityRepository.findAllById(request.getAmenityIds()));
            bus.setAmenities(amenities);
        }

        return mapToBusResponse(busRepository.save(bus));
    }

    @Transactional
    public void deleteBus(Long id) {
        if (!busRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bus not found with ID: " + id);
        }
        busRepository.deleteById(id);
    }

    private void generatePhysicalSeats(Bus bus) {
        int totalSeats = bus.getTotalSeats();
        List<Seat> seats = new ArrayList<>();
        char[] rowLetters = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'};
        int seatsPerRow = "SLEEPER_2X1".equalsIgnoreCase(bus.getLayoutType()) ? 3 : 4;
        int rowCount = (int) Math.ceil((double) totalSeats / seatsPerRow);

        int seatCounter = 0;
        for (int r = 0; r < rowCount && seatCounter < totalSeats; r++) {
            char rowChar = rowLetters[r % rowLetters.length];
            for (int c = 1; c <= seatsPerRow && seatCounter < totalSeats; c++) {
                seatCounter++;
                String seatNumber = "" + rowChar + c;
                SeatType type;
                if (c == 1 || c == seatsPerRow) {
                    type = SeatType.WINDOW;
                } else {
                    type = SeatType.AISLE;
                }
                Seat seat = new Seat(bus, seatNumber, type, 1, r + 1, c);
                seats.add(seat);
            }
        }
        seatRepository.saveAll(seats);
    }

    public BusResponse mapToBusResponse(Bus bus) {
        BusResponse resp = new BusResponse();
        resp.setId(bus.getId());
        resp.setOperatorId(bus.getOperator().getId());
        resp.setOperatorName(bus.getOperator().getName());
        resp.setOperatorCode(bus.getOperator().getCode());
        resp.setBusNumber(bus.getBusNumber());
        resp.setBusName(bus.getBusName());
        resp.setBusType(bus.getBusType());
        resp.setTotalSeats(bus.getTotalSeats());
        resp.setLayoutType(bus.getLayoutType());
        resp.setStatus(bus.getStatus());
        resp.setAmenities(bus.getAmenities().stream().map(Amenity::getName).collect(Collectors.toList()));
        return resp;
    }
}
