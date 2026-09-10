package com.route3d.busmanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "seats",
    uniqueConstraints = @UniqueConstraint(columnNames = {"bus_id", "seatNumber"})
)
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @Column(nullable = false, length = 10)
    private String seatNumber; // A1, A2, B1, B2...

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SeatType seatType = SeatType.WINDOW;

    @Column(nullable = false)
    private Integer deck = 1; // 1 = Lower/Main, 2 = Upper

    @Column(nullable = false)
    private Integer rowIndex; // e.g. 1 to 10

    @Column(nullable = false)
    private Integer colIndex; // e.g. 1, 2, 3, 4

    @Column(nullable = false)
    private Boolean isBlocked = false; // Maintenance / Admin blocked

    public Seat() {
    }

    public Seat(Bus bus, String seatNumber, SeatType seatType, Integer deck, Integer rowIndex, Integer colIndex) {
        this.bus = bus;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.deck = deck;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.isBlocked = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Bus getBus() {
        return bus;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
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

    public Boolean getIsBlocked() {
        return isBlocked;
    }

    public void setIsBlocked(Boolean isBlocked) {
        this.isBlocked = isBlocked;
    }
}
