package com.route3d.busmanagement.repository;

import com.route3d.busmanagement.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    @Query("SELECT s FROM Schedule s WHERE " +
           "LOWER(s.route.sourceCity) = LOWER(:sourceCity) AND " +
           "LOWER(s.route.destinationCity) = LOWER(:destinationCity) AND " +
           "s.travelDate = :travelDate AND " +
           "s.status = 'SCHEDULED' " +
           "ORDER BY s.departureTime ASC")
    List<Schedule> searchSchedules(
        @Param("sourceCity") String sourceCity,
        @Param("destinationCity") String destinationCity,
        @Param("travelDate") LocalDate travelDate
    );

    List<Schedule> findByTravelDate(LocalDate travelDate);

    List<Schedule> findByBusId(Long busId);

    List<Schedule> findByStatus(String status);
}
