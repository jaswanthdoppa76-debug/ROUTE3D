package com.route3d.busmanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "operators")
public class Operator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name; // e.g., "TGSRTC", "APSRTC"

    @Column(nullable = false, unique = true, length = 20)
    private String code; // e.g., "TGSRTC", "APSRTC"

    @Column(length = 30)
    private String contactNumber;

    @Column(length = 255)
    private String logoUrl;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";

    public Operator() {
    }

    public Operator(String name, String code, String contactNumber, String logoUrl) {
        this.name = name;
        this.code = code;
        this.contactNumber = contactNumber;
        this.logoUrl = logoUrl;
        this.status = "ACTIVE";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
