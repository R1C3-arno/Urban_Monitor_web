package com.urbanmonitor.domain.citizen.incidentdetection.controller;

import com.urbanmonitor.domain.citizen.incidentdetection.entity.TrafficIncident;
import com.urbanmonitor.domain.citizen.incidentdetection.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Debug controller để test database connection và data
 */
@RestController
@RequestMapping("/api/incidents/debug")
@RequiredArgsConstructor
@Slf4j
public class IncidentDebugController {

    private final IncidentRepository repository;

    /**
     * Test 1: Count all incidents in database
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> countIncidents() {
        try {
            long total = repository.count();
            log.info("Log: Total incidents in DB: {}", total);

            return ResponseEntity.ok(Map.of(
                    "total", total,
                    "message", "Successfully counted incidents"
            ));
        } catch (Exception e) {
            log.error("Log: Error counting incidents", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Test 2: Get all incidents (raw data)
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllIncidents() {
        try {
            List<TrafficIncident> incidents = repository.findAll();
            log.info("Log: Retrieved {} incidents", incidents.size());

            return ResponseEntity.ok(incidents);
        } catch (Exception e) {
            log.error("Log:  Error getting all incidents", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Test 3: Get validated incidents only
     */
    @GetMapping("/validated")
    public ResponseEntity<?> getValidatedIncidents() {
        try {
            List<TrafficIncident> incidents = repository.findValidated(
                    TrafficIncident.ValidationStatus.VALIDATED
            );
            log.info("Log:  Retrieved {} validated incidents", incidents.size());

            return ResponseEntity.ok(Map.of(
                    "count", incidents.size(),
                    "incidents", incidents
            ));
        } catch (Exception e) {
            log.error("Log:  Error getting validated incidents", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("stackTrace", e.getStackTrace()[0].toString());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Test 4: Database connection test
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        try {
            repository.count();
            log.info("Success: Database connection OK");
            return ResponseEntity.ok(Map.of(
                    "status", "OK",
                    "database", "Connected"
            ));
        } catch (Exception e) {
            log.error("Error Database connection failed", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "status", "ERROR",
                            "database", "Failed",
                            "error", e.getMessage()
                    ));
        }
    }
}