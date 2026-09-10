package com.route3d.busmanagement.repository;

import com.route3d.busmanagement.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {

    List<BookingSeat> findByScheduleIdAndStatus(Long scheduleId, String status);

    boolean existsByScheduleIdAndSeatIdAndStatus(Long scheduleId, Long seatId, String status);

    @Query("SELECT bs FROM BookingSeat bs WHERE bs.schedule.id = :scheduleId AND bs.seat.id IN :seatIds AND bs.status = 'RESERVED'")
    List<BookingSeat> findReservedSeats(
        @Param("scheduleId") Long scheduleId,
        @Param("seatIds") List<Long> seatIds
    );

    long countByScheduleIdAndStatus(Long scheduleId, String status);
}
