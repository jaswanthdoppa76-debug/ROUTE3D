package com.route3d.busmanagement.controller;

import com.route3d.busmanagement.dto.ApiResponse;
import com.route3d.busmanagement.dto.BusRequest;
import com.route3d.busmanagement.dto.BusResponse;
import com.route3d.busmanagement.service.BusService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @GetMapping("/buses")
    public ResponseEntity<ApiResponse<List<BusResponse>>> getAllBuses() {
        return ResponseEntity.ok(ApiResponse.success("Buses retrieved successfully", busService.getAllBuses()));
    }

    @GetMapping("/buses/{id}")
    public ResponseEntity<ApiResponse<BusResponse>> getBusById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Bus retrieved successfully", busService.getBusById(id)));
    }

    @PostMapping("/admin/buses")
    public ResponseEntity<ApiResponse<BusResponse>> createBus(@Valid @RequestBody BusRequest request) {
        BusResponse created = busService.createBus(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Bus created with physical seats layout!", created));
    }

    @PutMapping("/admin/buses/{id}")
    public ResponseEntity<ApiResponse<BusResponse>> updateBus(@PathVariable Long id, @Valid @RequestBody BusRequest request) {
        BusResponse updated = busService.updateBus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Bus updated successfully", updated));
    }

    @DeleteMapping("/admin/buses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        return ResponseEntity.ok(ApiResponse.success("Bus deleted successfully"));
    }
}
