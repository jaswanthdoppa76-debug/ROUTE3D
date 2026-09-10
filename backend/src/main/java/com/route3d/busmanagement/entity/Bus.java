package com.route3d.busmanagement.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "operator_id", nullable = false)
    private Operator operator;

    @Column(nullable = false, unique = true, length = 30)
    private String busNumber; // TS 09 Z 1234, AP 29 Z 5678

    @Column(nullable = false, length = 100)
    private String busName; // TGSRTC Rajdhani, APSRTC Amaravati

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private BusType busType;

    @Column(nullable = false)
    private Integer totalSeats = 40;

    @Column(nullable = false, length = 30)
    private String layoutType = "SEATER_2X2"; // SEATER_2X2, SLEEPER_2X1

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "bus_amenities",
        joinColumns = @JoinColumn(name = "bus_id"),
        inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private Set<Amenity> amenities = new HashSet<>();

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE"; // ACTIVE, MAINTENANCE, INACTIVE

    public Bus() {
    }

    public Bus(Operator operator, String busNumber, String busName, BusType busType, Integer totalSeats, String layoutType) {
        this.operator = operator;
        this.busNumber = busNumber;
        this.busName = busName;
        this.busType = busType;
        this.totalSeats = totalSeats;
        this.layoutType = layoutType;
        this.status = "ACTIVE";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Operator getOperator() {
        return operator;
    }

    public void setOperator(Operator operator) {
        this.operator = operator;
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

    public Set<Amenity> getAmenities() {
        return amenities;
    }

    public void setAmenities(Set<Amenity> amenities) {
        this.amenities = amenities;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
