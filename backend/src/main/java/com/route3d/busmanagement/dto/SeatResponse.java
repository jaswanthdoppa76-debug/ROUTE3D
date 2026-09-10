package com.route3d.busmanagement.dto;

import com.route3d.busmanagement.entity.SeatType;
import java.math.BigDecimal;

public class SeatResponse {

    private Long seatId;
    private String seatNumber;
    private SeatType seatType;
    private Integer deck;
    private Integer rowIndex;
    private Integer colIndex;
    private BigDecimal fare;
    private String status; // AVAILABLE, BOOKED, BLOCKED

    public SeatResponse() {
    }

    public SeatResponse(Long seatId, String seatNumber, SeatType seatType, Integer deck, Integer rowIndex, Integer colIndex, BigDecimal fare, String status) {
        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.deck = deck;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.fare = fare;
        this.status = status;
    }

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public SeatType getSeatType() {
        return seatType;
    }

    public void setSeatType(SeatType seatType) {
        this.seatType = seatType;
    }

    public Integer getDeck() {
        return deck;
    }

    public void setDeck(Integer deck) {
        this.deck = deck;
    }

    public Integer getRowIndex() {
        return rowIndex;
    }

    public void setRowIndex(Integer rowIndex) {
        this.rowIndex = rowIndex;
    }

    public Integer getColIndex() {
        return colIndex;
    }

    public void setColIndex(Integer colIndex) {
        this.colIndex = colIndex;
    }

    public BigDecimal getFare() {
        return fare;
    }

    public void setFare(BigDecimal fare) {
        this.fare = fare;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
