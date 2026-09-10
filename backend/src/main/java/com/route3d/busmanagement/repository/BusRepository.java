package com.route3d.busmanagement.repository;

import com.route3d.busmanagement.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    Optional<Bus> findByBusNumber(String busNumber);
    List<Bus> findByStatus(String status);
    List<Bus> findByOperatorId(Long operatorId);
    long countByStatus(String status);
}
