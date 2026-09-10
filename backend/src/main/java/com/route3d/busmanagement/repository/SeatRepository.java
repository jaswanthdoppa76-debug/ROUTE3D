package com.route3d.busmanagement.repository;

import com.route3d.busmanagement.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByBusIdOrderByDeckAscRowIndexAscColIndexAsc(Long busId);
    Optional<Seat> findByBusIdAndSeatNumber(Long busId, String seatNumber);
    long countByBusId(Long busId);
}
