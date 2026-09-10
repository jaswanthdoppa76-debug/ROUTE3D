package com.route3d.busmanagement.service;

import com.route3d.busmanagement.dto.UserResponse;
import com.route3d.busmanagement.entity.User;
import com.route3d.busmanagement.exception.ResourceNotFoundException;
import com.route3d.busmanagement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String email, Map<String, String> updates) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        if (updates.containsKey("fullName")) {
            user.setFullName(updates.get("fullName").trim());
        }
        if (updates.containsKey("phone")) {
            user.setPhone(updates.get("phone").trim());
        }
        if (updates.containsKey("password") && !updates.get("password").trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updates.get("password").trim()));
        }

        return mapToUserResponse(userRepository.save(user));
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setStatus("ACTIVE".equalsIgnoreCase(user.getStatus()) ? "INACTIVE" : "ACTIVE");
        return mapToUserResponse(userRepository.save(user));
    }

    public UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }
}
