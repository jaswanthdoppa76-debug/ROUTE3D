package com.route3d.busmanagement.controller;

import com.route3d.busmanagement.dto.ApiResponse;
import com.route3d.busmanagement.dto.UserResponse;
import com.route3d.busmanagement.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", userService.getProfile(email)));
    }

    @PutMapping("/users/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @RequestBody Map<String, String> updates,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", userService.updateProfile(email, updates)));
    }

    @GetMapping("/admin/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", userService.getAllUsers()));
    }

    @PutMapping("/admin/users/{id}/toggle")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("User status toggled", userService.toggleUserStatus(id)));
    }
}
