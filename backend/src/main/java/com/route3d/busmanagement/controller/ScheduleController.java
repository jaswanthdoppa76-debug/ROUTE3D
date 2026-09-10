package com.route3d.busmanagement.controller;

import com.route3d.busmanagement.dto.ApiResponse;
import com.route3d.busmanagement.dto.ScheduleRequest;
import com.route3d.busmanagement.dto.ScheduleResponse;
import com.route3d.busmanagement.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping("/schedules/search")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> searchSchedules(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ScheduleResponse> results = scheduleService.searchSchedules(from, to, date);
        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", results));
    }

    @GetMapping("/schedules")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getAllSchedules() {
        return ResponseEntity.ok(ApiResponse.success("Schedules retrieved successfully", scheduleService.getAllSchedules()));
    }

    @GetMapping("/schedules/{id}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> getScheduleById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Schedule retrieved successfully", scheduleService.getScheduleById(id)));
    }

    @PostMapping("/admin/schedules")
    public ResponseEntity<ApiResponse<ScheduleResponse>> createSchedule(@Valid @RequestBody ScheduleRequest request) {
        ScheduleResponse created = scheduleService.createSchedule(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Schedule created successfully", created));
    }

    @PutMapping("/admin/schedules/{id}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> updateSchedule(@PathVariable Long id, @Valid @RequestBody ScheduleRequest request) {
        ScheduleResponse updated = scheduleService.updateSchedule(id, request);
        return ResponseEntity.ok(ApiResponse.success("Schedule updated successfully", updated));
    }

    @DeleteMapping("/admin/schedules/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok(ApiResponse.success("Schedule deleted successfully"));
    }
}
