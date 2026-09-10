package com.route3d.busmanagement.service;

import com.route3d.busmanagement.dto.ScheduleRequest;
import com.route3d.busmanagement.dto.ScheduleResponse;
import com.route3d.busmanagement.entity.*;
import com.route3d.busmanagement.exception.ResourceNotFoundException;
import com.route3d.busmanagement.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final BookingSeatRepository bookingSeatRepository;

    public ScheduleService(ScheduleRepository scheduleRepository,
                           BusRepository busRepository,
                           RouteRepository routeRepository,
                           BookingSeatRepository bookingSeatRepository) {
        this.scheduleRepository = scheduleRepository;
        this.busRepository = busRepository;
        this.routeRepository = routeRepository;
        this.bookingSeatRepository = bookingSeatRepository;
    }

    public List<ScheduleResponse> searchSchedules(String sourceCity, String destinationCity, LocalDate travelDate) {
        List<Schedule> schedules = scheduleRepository.searchSchedules(
                sourceCity.trim(),
                destinationCity.trim(),
                travelDate
        );

        return schedules.stream()
                .map(this::mapToScheduleResponse)
                .collect(Collectors.toList());
    }

    public List<ScheduleResponse> getAllSchedules() {
        return scheduleRepository.findAll().stream()
                .map(this::mapToScheduleResponse)
                .collect(Collectors.toList());
    }

    public ScheduleResponse getScheduleById(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));
        return mapToScheduleResponse(schedule);
    }

    @Transactional
    public ScheduleResponse createSchedule(ScheduleRequest request) {
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + request.getBusId()));

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + request.getRouteId()));

        Schedule schedule = new Schedule(
                bus,
                route,
                request.getTravelDate(),
                request.getDepartureTime(),
                request.getArrivalTime(),
                request.getBaseFare()
        );
        schedule.setStatus(request.getStatus() != null ? request.getStatus() : "SCHEDULED");

        return mapToScheduleResponse(scheduleRepository.save(schedule));
    }

    @Transactional
    public ScheduleResponse updateSchedule(Long id, ScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + request.getBusId()));

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + request.getRouteId()));

        schedule.setBus(bus);
        schedule.setRoute(route);
        schedule.setTravelDate(request.getTravelDate());
        schedule.setDepartureTime(request.getDepartureTime());
        schedule.setArrivalTime(request.getArrivalTime());
        schedule.setBaseFare(request.getBaseFare());
        schedule.setStatus(request.getStatus());

        return mapToScheduleResponse(scheduleRepository.save(schedule));
    }

    @Transactional
    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule not found with ID: " + id);
        }
        scheduleRepository.deleteById(id);
    }

    public ScheduleResponse mapToScheduleResponse(Schedule s) {
        ScheduleResponse resp = new ScheduleResponse();
        resp.setId(s.getId());
        resp.setBusId(s.getBus().getId());
        resp.setBusNumber(s.getBus().getBusNumber());
        resp.setBusName(s.getBus().getBusName());
        resp.setBusType(s.getBus().getBusType());
        resp.setLayoutType(s.getBus().getLayoutType());
        resp.setOperatorName(s.getBus().getOperator().getName());
        resp.setOperatorCode(s.getBus().getOperator().getCode());
        resp.setOperatorLogo(s.getBus().getOperator().getLogoUrl());
        resp.setRouteId(s.getRoute().getId());
        resp.setSourceCity(s.getRoute().getSourceCity());
        resp.setSourceState(s.getRoute().getSourceState());
        resp.setDestinationCity(s.getRoute().getDestinationCity());
        resp.setDestinationState(s.getRoute().getDestinationState());
        resp.setDistanceKm(s.getRoute().getDistanceKm());
        resp.setDurationMinutes(s.getRoute().getEstimatedDurationMinutes());
        resp.setTravelDate(s.getTravelDate());
        resp.setDepartureTime(s.getDepartureTime());
        resp.setArrivalTime(s.getArrivalTime());
        resp.setBaseFare(s.getBaseFare());
        resp.setTotalSeats(s.getBus().getTotalSeats());

        long bookedSeatsCount = bookingSeatRepository.countByScheduleIdAndStatus(s.getId(), "RESERVED");
        resp.setAvailableSeats((int) Math.max(0, s.getBus().getTotalSeats() - bookedSeatsCount));

        resp.setAmenities(s.getBus().getAmenities().stream().map(Amenity::getName).collect(Collectors.toList()));
        resp.setStatus(s.getStatus());
        return resp;
    }
}
