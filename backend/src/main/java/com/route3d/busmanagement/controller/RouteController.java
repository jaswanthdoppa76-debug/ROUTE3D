package com.route3d.busmanagement.controller;

import com.route3d.busmanagement.dto.ApiResponse;
import com.route3d.busmanagement.dto.RouteRequest;
import com.route3d.busmanagement.dto.RouteResponse;
import com.route3d.busmanagement.service.RouteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping("/routes")
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getAllRoutes() {
        return ResponseEntity.ok(ApiResponse.success("Routes retrieved successfully", routeService.getAllRoutes()));
    }

    @GetMapping("/routes/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> getRouteById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Route retrieved successfully", routeService.getRouteById(id)));
    }

    @PostMapping("/admin/routes")
    public ResponseEntity<ApiResponse<RouteResponse>> createRoute(@Valid @RequestBody RouteRequest request) {
        RouteResponse created = routeService.createRoute(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("AP-Telangana route created successfully", created));
    }

    @PutMapping("/admin/routes/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> updateRoute(@PathVariable Long id, @Valid @RequestBody RouteRequest request) {
        RouteResponse updated = routeService.updateRoute(id, request);
        return ResponseEntity.ok(ApiResponse.success("Route updated successfully", updated));
    }

    @DeleteMapping("/admin/routes/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return ResponseEntity.ok(ApiResponse.success("Route deleted successfully"));
    }
}
