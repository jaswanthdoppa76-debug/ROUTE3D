package com.route3d.busmanagement.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    // Simple in-memory cache for OTPs: Email -> OTP string
    // In production, use Redis or a DB table with expiry.
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    public String generateOtp(String email) {
        // Generate a 6-digit OTP
        int otpNum = 100000 + secureRandom.nextInt(900000);
        String otp = String.valueOf(otpNum);
        otpCache.put(email.toLowerCase().trim(), otp);
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        String cachedOtp = otpCache.get(email.toLowerCase().trim());
        if (cachedOtp != null && cachedOtp.equals(otp.trim())) {
            otpCache.remove(email.toLowerCase().trim());
            return true;
        }
        return false;
    }
}
