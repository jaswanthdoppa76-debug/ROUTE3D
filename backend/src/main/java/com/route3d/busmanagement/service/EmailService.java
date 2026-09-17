package com.route3d.busmanagement.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendOtpEmail(String toEmail, String otp) {
        // We log the OTP to the console first for local testing purposes.
        // This is especially useful if real SMTP credentials aren't set in application.yml.
        logger.info("\n=========================================\n" +
                    "  [OTP] GENERATED FOR {}: {} \n" +
                    "=========================================\n", toEmail, otp);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("no-reply@route3d.com");
            message.setTo(toEmail);
            message.setSubject("Your Route3D Bus Booking OTP");
            message.setText("Hello,\n\nYour One-Time Password (OTP) for Route3D is: " + otp + "\n\nThis OTP is valid for 5 minutes.\n\nThank you,\nRoute3D Team");
            
            javaMailSender.send(message);
            logger.info("Email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.warn("Failed to send real email to {}. If you are testing locally, use the OTP printed above. Error: {}", toEmail, e.getMessage());
        }
    }
}
