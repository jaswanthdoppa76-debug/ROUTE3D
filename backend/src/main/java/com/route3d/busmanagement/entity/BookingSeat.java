package com.route3d.busmanagement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(
    name = "booking_seats",
    indexes = {
        @Index(name = "idx_sched_seat_status", columnList = "schedule_id, seat_id, status")
    }
)
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal seatFare;

    @Column(nullable = false, length = 20)
    private String status = "RESERVED"; // RESERVED, CANCELLED

    public BookingSeat() {
    }

    public BookingSeat(Booking booking, Schedule schedule, Seat seat, BigDecimal seatFare) {
        this.booking = booking;
        this.schedule = schedule;
        this.seat = seat;
        this.seatFare = seatFare;
        this.status = "RESERVED";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public Schedule getSchedule() {
        return schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public Seat getSeat() {
        return seat;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
    }

    public BigDecimal getSeatFare() {
        return seatFare;
    }

    public void setSeatFare(BigDecimal seatFare) {
        this.seatFare = seatFare;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
