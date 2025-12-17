package com.urbanmonitor.domain.citizen.utilityMonitor.controller;

import com.urbanmonitor.domain.citizen.utilityMonitor.dto.UtilityDashboardResponse;
import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;
import com.urbanmonitor.domain.citizen.utilityMonitor.service.UtilityMonitorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/utility-monitor")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UtilityMonitorController {

    private final UtilityMonitorService service;

    @GetMapping("/data")
    public ResponseEntity<List<UtilityMonitor>> getData() {
        List<UtilityMonitor> data = service.getAllStations();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/geojson")
    public ResponseEntity<Map<String, Object>> getGeoJSON() {
        List<UtilityMonitor> stations = service.getAllStations();

        List<Map<String, Object>> features = new ArrayList<>();

        for (UtilityMonitor station : stations) {
            if (station.getLongitude() == null || station.getLatitude() == null) {
                continue;
            }

            Map<String, Object> feature = new LinkedHashMap<>();
            feature.put("type", "Feature");

            Map<String, Object> geometry = new LinkedHashMap<>();
            geometry.put("type", "Point");
            geometry.put("coordinates", Arrays.asList(station.getLongitude(), station.getLatitude()));
            feature.put("geometry", geometry);

            Map<String, Object> properties = new LinkedHashMap<>();
            properties.put("id", station.getId());
            properties.put("stationName", station.getStationName());
            properties.put("address", station.getAddress());
            properties.put("waterUsage", station.getWaterUsage());
            properties.put("electricityUsage", station.getElectricityUsage());
            properties.put("wifiPing", station.getWifiPing());
            properties.put("wifiStatus", station.getWifiStatus() != null ? station.getWifiStatus().name() : null);
            properties.put("measuredAt", station.getMeasuredAt() != null ? station.getMeasuredAt().toString() : null);
            feature.put("properties", properties);

            features.add(feature);
        }

        Map<String, Object> featureCollection = new LinkedHashMap<>();
        featureCollection.put("type", "FeatureCollection");
        featureCollection.put("features", features);

        return ResponseEntity.ok(featureCollection);
    }

    // --- ENDPOINT MỚI ---
    @GetMapping("/dashboard")
    public ResponseEntity<UtilityDashboardResponse> getDashboard() {
        return ResponseEntity.ok(service.getDashboardData());
    }
}
