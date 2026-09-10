package com.route3d.busmanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "routes",
    uniqueConstraints = @UniqueConstraint(columnNames = {"sourceCity", "destinationCity"})
)
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String sourceCity;

    @Column(nullable = false, length = 50)
    private String sourceState; // TELANGANA or ANDHRA_PRADESH

    @Column(nullable = false, length = 100)
    private String destinationCity;

    @Column(nullable = false, length = 50)
    private String destinationState; // TELANGANA or ANDHRA_PRADESH

    @Column(nullable = false)
    private Double distanceKm;

    @Column(nullable = false)
    private Integer estimatedDurationMinutes;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";

    public Route() {
    }

    public Route(String sourceCity, String sourceState, String destinationCity, String destinationState, Double distanceKm, Integer estimatedDurationMinutes) {
        this.sourceCity = sourceCity;
        this.sourceState = sourceState;
        this.destinationCity = destinationCity;
        this.destinationState = destinationState;
        this.distanceKm = distanceKm;
        this.estimatedDurationMinutes = estimatedDurationMinutes;
        this.status = "ACTIVE";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSourceCity() {
        return sourceCity;
    }

    public void setSourceCity(String sourceCity) {
        this.sourceCity = sourceCity;
    }

    public String getSourceState() {
        return sourceState;
    }

    public void setSourceState(String sourceState) {
        this.sourceState = sourceState;
    }

    public String getDestinationCity() {
        return destinationCity;
    }

    public void setDestinationCity(String destinationCity) {
        this.destinationCity = destinationCity;
    }

    public String getDestinationState() {
        return destinationState;
    }

    public void setDestinationState(String destinationState) {
        this.destinationState = destinationState;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public Integer getEstimatedDurationMinutes() {
        return estimatedDurationMinutes;
    }

    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) {
        this.estimatedDurationMinutes = estimatedDurationMinutes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
