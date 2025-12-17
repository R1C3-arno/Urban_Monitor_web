package com.urbanmonitor.domain.citizen.disasterMonitor.controller;

import com.urbanmonitor.domain.citizen.disasterMonitor.dto.DisasterDashboardResponse;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.DisasterType;
import com.urbanmonitor.domain.citizen.disasterMonitor.service.DisasterZoneService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/disaster")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class DisasterZoneController {

    private final DisasterZoneService service;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ============== DATA ENDPOINTS ==============

    @GetMapping("/data")
    public ResponseEntity<List<DisasterZone>> getAllData() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/data/{type}")
    public ResponseEntity<List<DisasterZone>> getDataByType(@PathVariable String type) {
        DisasterType disasterType = DisasterType.valueOf(type.toUpperCase());
        return ResponseEntity.ok(service.getByType(disasterType));
    }

    @GetMapping("/data/active")
    public ResponseEntity<List<DisasterZone>> getActiveData() {
        return ResponseEntity.ok(service.getAllActiveOrderBySeverity());
    }

    @GetMapping("/data/active/{type}")
    public ResponseEntity<List<DisasterZone>> getActiveDataByType(@PathVariable String type) {
        DisasterType disasterType = DisasterType.valueOf(type.toUpperCase());
        return ResponseEntity.ok(service.getActiveByType(disasterType));
    }

    // ============== GEOJSON POLYGON ENDPOINTS ==============

    @GetMapping("/geojson")
    public ResponseEntity<Map<String, Object>> getAllGeoJSON() {
        return ResponseEntity.ok(buildPolygonGeoJSON(service.getAll()));
    }

    @GetMapping("/geojson/flood")
    public ResponseEntity<Map<String, Object>> getFloodGeoJSON() {
        return ResponseEntity.ok(buildPolygonGeoJSON(service.getByType(DisasterType.FLOOD)));
    }

    @GetMapping("/geojson/earthquake")
    public ResponseEntity<Map<String, Object>> getEarthquakeGeoJSON() {
        return ResponseEntity.ok(buildPolygonGeoJSON(service.getByType(DisasterType.EARTHQUAKE)));
    }

    @GetMapping("/geojson/heatwave")
    public ResponseEntity<Map<String, Object>> getHeatwaveGeoJSON() {
        return ResponseEntity.ok(buildPolygonGeoJSON(service.getByType(DisasterType.HEATWAVE)));
    }

    @GetMapping("/geojson/storm")
    public ResponseEntity<Map<String, Object>> getStormGeoJSON() {
        return ResponseEntity.ok(buildPolygonGeoJSON(service.getByType(DisasterType.STORM)));
    }

    // Active only endpoints
    @GetMapping("/geojson/active")
    public ResponseEntity<Map<String, Object>> getActiveGeoJSON() {
        return ResponseEntity.ok(buildPolygonGeoJSON(service.getAllActiveOrderBySeverity()));
    }

    @GetMapping("/geojson/active/flood")
    public ResponseEntity<Map<String, Object>> getActiveFloodGeoJSON() {
        return ResponseEntity.ok(buildPolygonGeoJSON(service.getActiveByType(DisasterType.FLOOD)));
    }

    @GetMapping("/geojson/active/earthquake")
    public ResponseEntity<Map<String, Object>> getActiveEarthquakeGeoJSON() {
        return ResponseEntity.ok(buildPolygonGeoJSON(service.getActiveByType(DisasterType.EARTHQUAKE)));
    }

    @GetMapping("/geojson/active/heatwave")
    public ResponseEntity<Map<String, Object>> getActiveHeatwaveGeoJSON() {
        return ResponseEntity.ok(buildPolygonGeoJSON(service.getActiveByType(DisasterType.HEATWAVE)));
    }

    @GetMapping("/geojson/active/storm")
    public ResponseEntity<Map<String, Object>> getActiveStormGeoJSON() {
        return ResponseEntity.ok(buildPolygonGeoJSON(service.getActiveByType(DisasterType.STORM)));
    }

    // ============== CRUD ENDPOINTS ==============

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
        DisasterZone.ZoneStatus newStatus = DisasterZone.ZoneStatus.valueOf(status.toUpperCase());
        return ResponseEntity.ok(service.updateStatus(id, newStatus));
    }

    // ============== HELPER METHODS ==============

    private Map<String, Object> buildPolygonGeoJSON(List<DisasterZone> zones) {
        List<Map<String, Object>> features = new ArrayList<>();

        for (DisasterZone zone : zones) {
            if (zone.getPolygonCoordinates() == null || zone.getPolygonCoordinates().isEmpty()) {
                continue;
            }

            Map<String, Object> feature = new LinkedHashMap<>();
            feature.put("type", "Feature");

            // Parse polygon coordinates from JSON string
            Map<String, Object> geometry = new LinkedHashMap<>();
            geometry.put("type", "Polygon");
            
            try {
                List<List<List<Double>>> coordinates = new ArrayList<>();
                List<List<Double>> ring = objectMapper.readValue(
                    zone.getPolygonCoordinates(), 
                    new TypeReference<List<List<Double>>>() {}
                );
                coordinates.add(ring);
                geometry.put("coordinates", coordinates);
            } catch (Exception e) {
                log.error("Failed to parse polygon coordinates for zone {}: {}", zone.getId(), e.getMessage());
                continue;
            }
            
            feature.put("geometry", geometry);

            // Properties
            Map<String, Object> properties = new LinkedHashMap<>();
            properties.put("id", zone.getId());
            properties.put("disasterType", zone.getDisasterType().name());
            properties.put("name", zone.getName());
            properties.put("description", zone.getDescription());
            properties.put("region", zone.getRegion());
            properties.put("severity", zone.getSeverity() != null ? zone.getSeverity().name() : null);
            properties.put("status", zone.getStatus() != null ? zone.getStatus().name() : null);
            properties.put("centerLongitude", zone.getCenterLongitude());
            properties.put("centerLatitude", zone.getCenterLatitude());
            properties.put("affectedAreaKm2", zone.getAffectedAreaKm2());
            properties.put("affectedPopulation", zone.getAffectedPopulation());
            properties.put("measurementValue", zone.getMeasurementValue());
            properties.put("measurementUnit", zone.getMeasurementUnit());
            properties.put("alertMessage", zone.getAlertMessage());
            properties.put("evacuationInfo", zone.getEvacuationInfo());
            properties.put("contactHotline", zone.getContactHotline());
            properties.put("startedAt", zone.getStartedAt() != null ? zone.getStartedAt().toString() : null);
            properties.put("expectedEndAt", zone.getExpectedEndAt() != null ? zone.getExpectedEndAt().toString() : null);

            feature.put("properties", properties);
            features.add(feature);
        }

        Map<String, Object> featureCollection = new LinkedHashMap<>();
        featureCollection.put("type", "FeatureCollection");
        featureCollection.put("features", features);

        return featureCollection;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DisasterDashboardResponse> getDashboard() {
        return ResponseEntity.ok(service.getDashboardData());
    }
}
