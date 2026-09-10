package com.route3d.busmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public class RouteRequest {

    @NotBlank(message = "Source city is required")
    private String sourceCity;

    @NotBlank(message = "Source state is required")
    @Pattern(regexp = "^(TELANGANA|ANDHRA_PRADESH)$", message = "Source state must be either TELANGANA or ANDHRA_PRADESH")
    private String sourceState;

    @NotBlank(message = "Destination city is required")
    private String destinationCity;

    @NotBlank(message = "Destination state is required")
    @Pattern(regexp = "^(TELANGANA|ANDHRA_PRADESH)$", message = "Destination state must be either TELANGANA or ANDHRA_PRADESH")
    private String destinationState;

    @NotNull(message = "Distance in KM is required")
    @Positive(message = "Distance must be greater than 0")
    private Double distanceKm;

    @NotNull(message = "Estimated duration in minutes is required")
    @Positive(message = "Duration must be greater than 0")
    private Integer estimatedDurationMinutes;

    private String status = "ACTIVE";

    public RouteRequest() {
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
