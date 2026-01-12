package com.urbanmonitor.domain.citizen.utilityMonitor.controller;

import com.urbanmonitor.domain.citizen.utilityMonitor.builder.UtilityGeoJsonBuilder;
import com.urbanmonitor.domain.citizen.utilityMonitor.dto.UtilityDashboardResponse;
import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;
import com.urbanmonitor.domain.citizen.utilityMonitor.service.IUtilityMonitorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/utility-monitor")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UtilityMonitorController {

    private final IUtilityMonitorService service;
    private final UtilityGeoJsonBuilder geoJsonBuilder;

    @GetMapping("/data")
    public ResponseEntity<List<UtilityMonitor>> getData() {
        List<UtilityMonitor> data = service.getAllStations();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/geojson")
    public ResponseEntity<Map<String, Object>> getGeoJSON() {
        List<UtilityMonitor> stations = service.getAllStations();
        return ResponseEntity.ok(geoJsonBuilder.buildFeatureCollection(stations));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<UtilityDashboardResponse> getDashboard() {
        return ResponseEntity.ok(service.getDashboardData());
    }
}
