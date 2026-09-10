package com.route3d.busmanagement.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class SeatBlockRequest {

    @NotNull(message = "Bus ID is required")
    private Long busId;

    @NotEmpty(message = "At least one seat ID must be specified")
    private List<Long> seatIds;

    private boolean blocked;

    public SeatBlockRequest() {
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public List<Long> getSeatIds() {
        return seatIds;
    }

    public void setSeatIds(List<Long> seatIds) {
        this.seatIds = seatIds;
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }
}
