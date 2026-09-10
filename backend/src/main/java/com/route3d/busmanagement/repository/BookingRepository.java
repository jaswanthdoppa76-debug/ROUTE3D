package com.route3d.busmanagement.repository;

import com.route3d.busmanagement.entity.Booking;
import com.route3d.busmanagement.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingNumber(String bookingNumber);

    List<Booking> findByUserIdOrderByBookingTimeDesc(Long userId);

    long countByBookingStatus(BookingStatus bookingStatus);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.bookingStatus = 'CONFIRMED'")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.bookingTime >= :startOfDay AND b.bookingTime <= :endOfDay")
    long countTodayBookings(
        @Param("startOfDay") LocalDateTime startOfDay,
        @Param("endOfDay") LocalDateTime endOfDay
    );

    @Query("SELECT b FROM Booking b ORDER BY b.bookingTime DESC")
    List<Booking> findRecentBookings();
}
