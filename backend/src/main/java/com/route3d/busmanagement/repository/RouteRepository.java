package com.route3d.busmanagement.repository;

import com.route3d.busmanagement.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findBySourceCityIgnoreCaseAndDestinationCityIgnoreCase(String sourceCity, String destinationCity);
    List<Route> findByStatus(String status);
    List<Route> findBySourceStateAndDestinationState(String sourceState, String destinationState);
}
