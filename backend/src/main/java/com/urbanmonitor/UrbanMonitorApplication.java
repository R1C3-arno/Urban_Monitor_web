package com.urbanmonitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * SMART TRAFFIC & BRANCH MANAGEMENT SYSTEM
 * Main Application Entry Point
 * 
 * Design Patterns Applied:
 * - Singleton Pattern (Spring Application Context)
 * - Factory Pattern (Bean Factory)
 * - Dependency Injection (Spring Core)
 * 
 * @author Your Name
 * @version 1.0.0
 */
@SpringBootApplication
public class UrbanMonitorApplication {

    public static void main(String[] args) {
        System.out.println("╔════════════════════════════════════════════════════════╗");
        System.out.println("║  SMART TRAFFIC & BRANCH MANAGEMENT SYSTEM             ║");
        System.out.println("║  OOP + DSA Project                                     ║");
        System.out.println("║  Spring Boot + PostgreSQL                              ║");
        System.out.println("╚════════════════════════════════════════════════════════╝");
        
        SpringApplication.run(UrbanMonitorApplication.class, args);
        
        System.out.println("\n✅ Application started successfully!");
        System.out.println("📍 API Base URL: http://localhost:8080/api");
        System.out.println("🏢 Branch API: http://localhost:8080/api/company/branches");
        System.out.println("🚗 Traffic API: http://localhost:8080/api/citizen/traffic");
        System.out.println("🗺️  Route API: http://localhost:8080/api/citizen/routes");
    }
}
