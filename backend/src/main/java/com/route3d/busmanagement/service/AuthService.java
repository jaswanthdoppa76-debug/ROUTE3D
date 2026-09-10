package com.route3d.busmanagement.service;

import com.route3d.busmanagement.config.JwtTokenProvider;
import com.route3d.busmanagement.dto.AuthResponse;
import com.route3d.busmanagement.dto.LoginRequest;
import com.route3d.busmanagement.dto.RegisterRequest;
import com.route3d.busmanagement.entity.Role;
import com.route3d.busmanagement.entity.User;
import com.route3d.busmanagement.exception.InvalidBookingException;
import com.route3d.busmanagement.exception.ResourceNotFoundException;
import com.route3d.busmanagement.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new InvalidBookingException("An account with email " + request.getEmail() + " already exists.");
        }

        Role userRole = "jaswanthdoppa76@gmail.com".equalsIgnoreCase(request.getEmail().trim())
                ? Role.ROLE_ADMIN
                : Role.ROLE_USER;

        User user = new User(
                request.getFullName().trim(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getPhone().trim(),
                userRole
        );

        User saved = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(saved.getEmail(), saved.getId(), saved.getRole().name(), saved.getFullName());

        return new AuthResponse(token, saved.getId(), saved.getFullName(), saved.getEmail(), saved.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new InvalidBookingException("This account is currently deactivated. Please contact support.");
        }

        // Enforce strict administrative clearance: only jaswanthdoppa76@gmail.com can hold ROLE_ADMIN
        if (user.getRole() == Role.ROLE_ADMIN && !"jaswanthdoppa76@gmail.com".equalsIgnoreCase(user.getEmail())) {
            user.setRole(Role.ROLE_USER);
            userRepository.save(user);
        } else if ("jaswanthdoppa76@gmail.com".equalsIgnoreCase(user.getEmail()) && user.getRole() != Role.ROLE_ADMIN) {
            user.setRole(Role.ROLE_ADMIN);
            userRepository.save(user);
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId(), user.getRole().name(), user.getFullName());
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
