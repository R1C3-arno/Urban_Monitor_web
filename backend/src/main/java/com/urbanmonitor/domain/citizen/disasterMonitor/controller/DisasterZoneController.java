package com.urbanmonitor.domain.citizen.disasterMonitor.controller;

import com.urbanmonitor.domain.citizen.disasterMonitor.dto.DisasterDashboardResponse;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.DisasterType;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.ZoneStatus;
import com.urbanmonitor.domain.citizen.disasterMonitor.service.DisasterZoneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * REST Controller : Disaster Zone API.
 * 
 * SOLID PRINCIPLES:
 * - Single Responsibility:  handle HTTP requests/responses
 * - Dependency Inversion: DisasterZoneService interface
 * 
 * API ENDPOINTS UNCHANGED - Frontend.
 */
@RestController
@RequestMapping("/api/disaster")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class DisasterZoneController {

    // Dependency Inversion: Depend on interface, not implementation
    private final DisasterZoneService service;

    //  DATA ENDPOINTS

    @GetMapping("/data")
    public ResponseEntity<List<DisasterZone>> getAllData() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/data/{type}")
    public ResponseEntity<List<DisasterZone>> getDataByType(@PathVariable String type) {
        DisasterType disasterType = parseDisasterType(type);
        return ResponseEntity.ok(service.getByType(disasterType));
    }

    @GetMapping("/data/active")
    public ResponseEntity<List<DisasterZone>> getActiveData() {
        return ResponseEntity.ok(service.getAllActiveOrderBySeverity());
    }

    @GetMapping("/data/active/{type}")
    public ResponseEntity<List<DisasterZone>> getActiveDataByType(@PathVariable String type) {
        DisasterType disasterType = parseDisasterType(type);
        return ResponseEntity.ok(service.getActiveByType(disasterType));
    }

    //  GEOJSON POLYGON ENDPOINTS

    @GetMapping("/geojson")
    public ResponseEntity<Map<String, Object>> getAllGeoJSON() {
        return ResponseEntity.ok(service.getPolygonGeoJson(service.getAll()));
    }

    @GetMapping("/geojson/flood")
    public ResponseEntity<Map<String, Object>> getFloodGeoJSON() {
        return ResponseEntity.ok(service.getPolygonGeoJson(service.getByType(DisasterType.FLOOD)));
    }

    @GetMapping("/geojson/earthquake")
    public ResponseEntity<Map<String, Object>> getEarthquakeGeoJSON() {
        return ResponseEntity.ok(service.getPolygonGeoJson(service.getByType(DisasterType.EARTHQUAKE)));
    }

    @GetMapping("/geojson/heatwave")
    public ResponseEntity<Map<String, Object>> getHeatwaveGeoJSON() {
        return ResponseEntity.ok(service.getPolygonGeoJson(service.getByType(DisasterType.HEATWAVE)));
    }

    @GetMapping("/geojson/storm")
    public ResponseEntity<Map<String, Object>> getStormGeoJSON() {
        return ResponseEntity.ok(service.getPolygonGeoJson(service.getByType(DisasterType.STORM)));
    }

    // Active only endpoints
    @GetMapping("/geojson/active")
    public ResponseEntity<Map<String, Object>> getActiveGeoJSON() {
        return ResponseEntity.ok(service.getPolygonGeoJson(service.getAllActiveOrderBySeverity()));
    }

    @GetMapping("/geojson/active/flood")
    public ResponseEntity<Map<String, Object>> getActiveFloodGeoJSON() {
        return ResponseEntity.ok(service.getPolygonGeoJson(service.getActiveByType(DisasterType.FLOOD)));
    }

    @GetMapping("/geojson/active/earthquake")
    public ResponseEntity<Map<String, Object>> getActiveEarthquakeGeoJSON() {
        return ResponseEntity.ok(service.getPolygonGeoJson(service.getActiveByType(DisasterType.EARTHQUAKE)));
    }

    @GetMapping("/geojson/active/heatwave")
    public ResponseEntity<Map<String, Object>> getActiveHeatwaveGeoJSON() {
        return ResponseEntity.ok(service.getPolygonGeoJson(service.getActiveByType(DisasterType.HEATWAVE)));
    }

    @GetMapping("/geojson/active/storm")
    public ResponseEntity<Map<String, Object>> getActiveStormGeoJSON() {
        return ResponseEntity.ok(service.getPolygonGeoJson(service.getActiveByType(DisasterType.STORM)));
    }

    //  CRUD ENDPOINTS

    @PostMapping
    public ResponseEntity<DisasterZone> create(@RequestBody DisasterZone zone) {
        return ResponseEntity.ok(service.save(zone));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DisasterZone> update(@PathVariable Long id, @RequestBody DisasterZone zone) {
        zone.setId(id);
        return ResponseEntity.ok(service.save(zone));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DisasterZone> updateStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        ZoneStatus newStatus = parseZoneStatus(status);
        return ResponseEntity.ok(service.updateStatus(id, newStatus));
    }

    // DASHBOARD ENDPOINT

    @GetMapping("/dashboard")
    public ResponseEntity<DisasterDashboardResponse> getDashboard() {
        return ResponseEntity.ok(service.getDashboardData());
    }

    // HELPER METHODS

    private DisasterType parseDisasterType(String type) {
        return DisasterType.valueOf(type.toUpperCase());
    }

    private ZoneStatus parseZoneStatus(String status) {
        return ZoneStatus.valueOf(status.toUpperCase());
    }
}
