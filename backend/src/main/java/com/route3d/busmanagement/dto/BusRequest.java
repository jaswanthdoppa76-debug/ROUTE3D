package com.route3d.busmanagement.dto;

import com.route3d.busmanagement.entity.BusType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

public class BusRequest {

    @NotNull(message = "Operator ID is required")
    private Long operatorId;

    @NotBlank(message = "Bus number is required")
    private String busNumber;

    @NotBlank(message = "Bus name is required")
    private String busName;

    @NotNull(message = "Bus type is required")
    private BusType busType;

    @NotNull(message = "Total seats is required")
    @Min(value = 10, message = "Total seats must be at least 10")
    private Integer totalSeats;

    private String layoutType = "SEATER_2X2";

    private Set<Long> amenityIds;

    private String status = "ACTIVE";

    public BusRequest() {
    }

    public Long getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(Long operatorId) {
        this.operatorId = operatorId;
    }

    public String getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(String busNumber) {
        this.busNumber = busNumber;
    }

    public String getBusName() {
        return busName;
    }

    public void setBusName(String busName) {
        this.busName = busName;
    }

    public BusType getBusType() {
        return busType;
    }

    public void setBusType(BusType busType) {
        this.busType = busType;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public String getLayoutType() {
        return layoutType;
    }

    public void setLayoutType(String layoutType) {
        this.layoutType = layoutType;
    }

    public Set<Long> getAmenityIds() {
        return amenityIds;
    }

    public void setAmenityIds(Set<Long> amenityIds) {
        this.amenityIds = amenityIds;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
