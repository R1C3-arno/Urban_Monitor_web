package com.urbanmonitor.domain.citizen.emergency.controller;

import com.urbanmonitor.domain.citizen.emergency.dto.EmergencyDashboardResponse;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation.EmergencyType;
import com.urbanmonitor.domain.citizen.emergency.service.EmergencyLocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EmergencyLocationController {

    private final EmergencyLocationService service;

    @GetMapping("/data")
    public ResponseEntity<List<EmergencyLocation>> getAllData() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/data/{type}")
    public ResponseEntity<List<EmergencyLocation>> getDataByType(@PathVariable String type) {
        EmergencyType emergencyType = EmergencyType.valueOf(type.toUpperCase());
        return ResponseEntity.ok(service.getByType(emergencyType));
    }

    @GetMapping("/geojson")
    public ResponseEntity<Map<String, Object>> getAllGeoJSON() {
        return ResponseEntity.ok(buildGeoJSON(service.getAll()));
    }

    @GetMapping("/geojson/ambulance")
    public ResponseEntity<Map<String, Object>> getAmbulanceGeoJSON() {
        return ResponseEntity.ok(buildGeoJSON(service.getByType(EmergencyType.AMBULANCE)));
    }

    @GetMapping("/geojson/fire")
    public ResponseEntity<Map<String, Object>> getFireGeoJSON() {
        return ResponseEntity.ok(buildGeoJSON(service.getByType(EmergencyType.FIRE)));
    }

    @GetMapping("/geojson/crime")
    public ResponseEntity<Map<String, Object>> getCrimeGeoJSON() {
        return ResponseEntity.ok(buildGeoJSON(service.getByType(EmergencyType.CRIME)));
    }

    @GetMapping("/geojson/family")
    public ResponseEntity<Map<String, Object>> getFamilyGeoJSON() {
        return ResponseEntity.ok(buildGeoJSON(service.getByType(EmergencyType.FAMILY)));
    }

    private Map<String, Object> buildGeoJSON(List<EmergencyLocation> locations) {
        List<Map<String, Object>> features = new ArrayList<>();

        for (EmergencyLocation loc : locations) {
            if (loc.getLongitude() == null || loc.getLatitude() == null) {
                continue;
            }

            Map<String, Object> feature = new LinkedHashMap<>();
            feature.put("type", "Feature");

            Map<String, Object> geometry = new LinkedHashMap<>();
            geometry.put("type", "Point");
            geometry.put("coordinates", Arrays.asList(loc.getLongitude(), loc.getLatitude()));
            feature.put("geometry", geometry);

            Map<String, Object> properties = new LinkedHashMap<>();
            properties.put("id", loc.getId());
            properties.put("emergencyType", loc.getEmergencyType().name());
            properties.put("name", loc.getName());
            properties.put("description", loc.getDescription());
            properties.put("address", loc.getAddress());
            properties.put("status", loc.getStatus() != null ? loc.getStatus().name() : null);
            properties.put("priority", loc.getPriority() != null ? loc.getPriority().name() : null);
            properties.put("contactPhone", loc.getContactPhone());
            properties.put("imageUrl", loc.getImageUrl());
            properties.put("reportedAt", loc.getReportedAt() != null ? loc.getReportedAt().toString() : null);
            feature.put("properties", properties);

            features.add(feature);
        }

        Map<String, Object> featureCollection = new LinkedHashMap<>();
        featureCollection.put("type", "FeatureCollection");
        featureCollection.put("features", features);

        return featureCollection;
    }
    // Trong EmergencyLocationController.java
    @GetMapping("/dashboard/ambulance")
    public ResponseEntity<EmergencyDashboardResponse> getAmbulanceDashboard() {
        return ResponseEntity.ok(service.getDashboardByType(EmergencyType.AMBULANCE));
    }

    @GetMapping("/dashboard/fire")
    public ResponseEntity<EmergencyDashboardResponse> getFireDashboard() {
        return ResponseEntity.ok(service.getDashboardByType(EmergencyType.FIRE));
    }

    @GetMapping("/dashboard/crime")
    public ResponseEntity<EmergencyDashboardResponse> getCrimeDashboard() {
        return ResponseEntity.ok(service.getDashboardByType(EmergencyType.CRIME));
    }

    @GetMapping("/dashboard/family")
    public ResponseEntity<EmergencyDashboardResponse> getFamilyDashboard() {
        return ResponseEntity.ok(service.getDashboardByType(EmergencyType.FAMILY));
    }
}
