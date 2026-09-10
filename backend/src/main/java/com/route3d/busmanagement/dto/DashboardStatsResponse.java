package com.route3d.busmanagement.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    private long totalBuses;
    private long activeBuses;
    private long totalUsers;
    private long todayBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private BigDecimal totalRevenue;
    private double occupancyRate;
    private List<Map<String, Object>> topRoutes;
    private List<Map<String, Object>> dailyRevenueTrends;
    private List<Map<String, Object>> busTypeDistribution;

    public DashboardStatsResponse() {
    }

    public long getTotalBuses() {
        return totalBuses;
    }

    public void setTotalBuses(long totalBuses) {
        this.totalBuses = totalBuses;
    }

    public long getActiveBuses() {
        return activeBuses;
    }

    public void setActiveBuses(long activeBuses) {
        this.activeBuses = activeBuses;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTodayBookings() {
        return todayBookings;
    }

    public void setTodayBookings(long todayBookings) {
        this.todayBookings = todayBookings;
    }

    public long getConfirmedBookings() {
        return confirmedBookings;
    }

    public void setConfirmedBookings(long confirmedBookings) {
        this.confirmedBookings = confirmedBookings;
    }

    public long getCancelledBookings() {
        return cancelledBookings;
    }

    public void setCancelledBookings(long cancelledBookings) {
        this.cancelledBookings = cancelledBookings;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public double getOccupancyRate() {
        return occupancyRate;
    }

    public void setOccupancyRate(double occupancyRate) {
        this.occupancyRate = occupancyRate;
    }

    public List<Map<String, Object>> getTopRoutes() {
        return topRoutes;
    }

    public void setTopRoutes(List<Map<String, Object>> topRoutes) {
        this.topRoutes = topRoutes;
    }

    public List<Map<String, Object>> getDailyRevenueTrends() {
        return dailyRevenueTrends;
    }

    public void setDailyRevenueTrends(List<Map<String, Object>> dailyRevenueTrends) {
        this.dailyRevenueTrends = dailyRevenueTrends;
    }

    public List<Map<String, Object>> getBusTypeDistribution() {
        return busTypeDistribution;
    }

    public void setBusTypeDistribution(List<Map<String, Object>> busTypeDistribution) {
        this.busTypeDistribution = busTypeDistribution;
    }
}
