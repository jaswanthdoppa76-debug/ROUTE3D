package com.route3d.busmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BusManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(BusManagementApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  Route3D: AP & Telangana Bus Management API    ");
        System.out.println("  Started Successfully on http://localhost:8080 ");
        System.out.println("=================================================");
    }
}



