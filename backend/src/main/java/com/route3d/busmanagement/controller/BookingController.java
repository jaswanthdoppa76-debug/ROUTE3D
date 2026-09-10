package com.route3d.busmanagement.controller;

import com.route3d.busmanagement.dto.ApiResponse;
import com.route3d.busmanagement.dto.BookingRequest;
import com.route3d.busmanagement.dto.BookingResponse;
import com.route3d.busmanagement.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        BookingResponse booking = bookingService.createBooking(request, email);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking confirmed successfully!", booking));
    }

    @GetMapping("/bookings/my")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(Authentication authentication) {
        String email = authentication.getName();
        List<BookingResponse> bookings = bookingService.getMyBookings(email);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));

        BookingResponse booking = bookingService.getBookingById(id, email, isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking));
    }

    @GetMapping("/bookings/ref/{bookingNumber}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingByNumber(@PathVariable String bookingNumber) {
        BookingResponse booking = bookingService.getBookingByNumber(bookingNumber);
        return ResponseEntity.ok(ApiResponse.success("Ticket verified successfully", booking));
    }

    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));

        BookingResponse cancelled = bookingService.cancelBooking(id, email, isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled and refunded successfully", cancelled));
    }

    @GetMapping("/admin/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.success("All bookings retrieved", bookingService.getAllBookings()));
    }
}
