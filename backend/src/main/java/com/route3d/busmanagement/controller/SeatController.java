package com.route3d.busmanagement.controller;

import com.route3d.busmanagement.dto.ApiResponse;
import com.route3d.busmanagement.dto.SeatBlockRequest;
import com.route3d.busmanagement.dto.SeatResponse;
import com.route3d.busmanagement.service.SeatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/schedules/{scheduleId}/seats")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getSeatsForSchedule(@PathVariable Long scheduleId) {
        List<SeatResponse> seats = seatService.getSeatsForSchedule(scheduleId);
        return ResponseEntity.ok(ApiResponse.success("Seat layout retrieved successfully", seats));
    }

    @PostMapping("/admin/seats/block")
    public ResponseEntity<ApiResponse<Void>> toggleSeatBlock(@Valid @RequestBody SeatBlockRequest request) {
        seatService.toggleSeatBlock(request);
        String action = request.isBlocked() ? "blocked" : "unblocked";
        return ResponseEntity.ok(ApiResponse.success("Seats successfully " + action));
    }
}
