package com.urbanmonitor.domain.citizen.temperaturemonitor.controller;

import com.urbanmonitor.domain.citizen.temperaturemonitor.dto.AirQualityResponse;
import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;
import com.urbanmonitor.domain.citizen.temperaturemonitor.service.AirQualityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller để cung cấp GeoJSON data cho air quality choropleth map
 */
@RestController
@RequestMapping("/api/air-quality")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AirQualityController {

    private final AirQualityService service;

    @GetMapping("/data") // Đổi endpoint cho rõ nghĩa
    public ResponseEntity<List<AirQualityZone>> getAirQualityData() {
        // Service chỉ cần findAll() từ DB ra
        List<AirQualityZone> data = service.getAllZones();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AirQualityResponse> getAirQualityDashboard() {
        AirQualityResponse data = service.getDashboardData();
        return ResponseEntity.ok(data);
    }
}