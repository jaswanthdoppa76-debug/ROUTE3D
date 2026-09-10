package com.route3d.busmanagement.service;

import com.route3d.busmanagement.dto.RouteRequest;
import com.route3d.busmanagement.dto.RouteResponse;
import com.route3d.busmanagement.entity.Route;
import com.route3d.busmanagement.exception.InvalidBookingException;
import com.route3d.busmanagement.exception.ResourceNotFoundException;
import com.route3d.busmanagement.repository.RouteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private static final List<String> ALLOWED_STATES = Arrays.asList("TELANGANA", "ANDHRA_PRADESH");

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public List<RouteResponse> getAllRoutes() {
        return routeRepository.findAll().stream()
                .map(this::mapToRouteResponse)
                .collect(Collectors.toList());
    }

    public RouteResponse getRouteById(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + id));
        return mapToRouteResponse(route);
    }

    @Transactional
    public RouteResponse createRoute(RouteRequest request) {
        validateStates(request.getSourceState(), request.getDestinationState());

        Route route = new Route(
                request.getSourceCity().trim(),
                request.getSourceState().toUpperCase().trim(),
                request.getDestinationCity().trim(),
                request.getDestinationState().toUpperCase().trim(),
                request.getDistanceKm(),
                request.getEstimatedDurationMinutes()
        );
        route.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        return mapToRouteResponse(routeRepository.save(route));
    }

    @Transactional
    public RouteResponse updateRoute(Long id, RouteRequest request) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + id));

        validateStates(request.getSourceState(), request.getDestinationState());

        route.setSourceCity(request.getSourceCity().trim());
        route.setSourceState(request.getSourceState().toUpperCase().trim());
        route.setDestinationCity(request.getDestinationCity().trim());
        route.setDestinationState(request.getDestinationState().toUpperCase().trim());
        route.setDistanceKm(request.getDistanceKm());
        route.setEstimatedDurationMinutes(request.getEstimatedDurationMinutes());
        route.setStatus(request.getStatus());

        return mapToRouteResponse(routeRepository.save(route));
    }

    @Transactional
    public void deleteRoute(Long id) {
        if (!routeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Route not found with ID: " + id);
        }
        routeRepository.deleteById(id);
    }

    private void validateStates(String sourceState, String destinationState) {
        if (!ALLOWED_STATES.contains(sourceState.toUpperCase().trim()) ||
            !ALLOWED_STATES.contains(destinationState.toUpperCase().trim())) {
            throw new InvalidBookingException("Route validation failed: Only routes within or between TELANGANA and ANDHRA_PRADESH are permitted.");
        }
    }

    public RouteResponse mapToRouteResponse(Route route) {
        RouteResponse resp = new RouteResponse();
        resp.setId(route.getId());
        resp.setSourceCity(route.getSourceCity());
        resp.setSourceState(route.getSourceState());
        resp.setDestinationCity(route.getDestinationCity());
        resp.setDestinationState(route.getDestinationState());
        resp.setDistanceKm(route.getDistanceKm());
        resp.setEstimatedDurationMinutes(route.getEstimatedDurationMinutes());
        resp.setStatus(route.getStatus());
        return resp;
    }
}
