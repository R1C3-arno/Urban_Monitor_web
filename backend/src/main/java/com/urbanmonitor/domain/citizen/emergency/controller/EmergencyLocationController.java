package com.urbanmonitor.domain.citizen.emergency.controller;

import com.urbanmonitor.domain.citizen.emergency.dto.EmergencyDashboardResponse;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation.EmergencyType;
import com.urbanmonitor.domain.citizen.emergency.service.EmergencyLocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller : Emergency Location API.
 */
@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EmergencyLocationController {

    private final EmergencyLocationService service;

    //  DATA ENDPOINTS

    @GetMapping("/data")
    public ResponseEntity<List<EmergencyLocation>> getAllData() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/data/{type}")
    public ResponseEntity<List<EmergencyLocation>> getDataByType(@PathVariable String type) {
        EmergencyType emergencyType = parseEmergencyType(type);
        return ResponseEntity.ok(service.getByType(emergencyType));
    }

    //  GEOJSON ENDPOINTS

    @GetMapping("/geojson")
    public ResponseEntity<Map<String, Object>> getAllGeoJSON() {
        return ResponseEntity.ok(service.getGeoJson(service.getAll()));
    }

    @GetMapping("/geojson/ambulance")
    public ResponseEntity<Map<String, Object>> getAmbulanceGeoJSON() {
        return ResponseEntity.ok(service.getGeoJson(service.getByType(EmergencyType.AMBULANCE)));
    }

    @GetMapping("/geojson/fire")
    public ResponseEntity<Map<String, Object>> getFireGeoJSON() {
        return ResponseEntity.ok(service.getGeoJson(service.getByType(EmergencyType.FIRE)));
    }

    @GetMapping("/geojson/crime")
    public ResponseEntity<Map<String, Object>> getCrimeGeoJSON() {
        return ResponseEntity.ok(service.getGeoJson(service.getByType(EmergencyType.CRIME)));
    }

    @GetMapping("/geojson/family")
    public ResponseEntity<Map<String, Object>> getFamilyGeoJSON() {
        return ResponseEntity.ok(service.getGeoJson(service.getByType(EmergencyType.FAMILY)));
    }

    //  DASHBOARD ENDPOINTS

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

    //  HELPER

    private EmergencyType parseEmergencyType(String type) {
        return EmergencyType.valueOf(type.toUpperCase());
    }
}
