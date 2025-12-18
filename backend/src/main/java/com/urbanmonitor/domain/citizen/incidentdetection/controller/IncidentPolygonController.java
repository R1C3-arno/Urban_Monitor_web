package com.urbanmonitor.domain.citizen.incidentdetection.controller;

import com.urbanmonitor.domain.citizen.incidentdetection.dto.IncidentLegendDTO;
import com.urbanmonitor.domain.citizen.incidentdetection.dto.IncidentStatsDTO;
import com.urbanmonitor.domain.citizen.incidentdetection.service.IncidentPolygonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller - Endpoints giữ nguyên
 * 
 * SOLID:
 * - Single Responsibility: Chỉ handle HTTP
 * - Dependency Inversion: Depend on interface
 */
@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class IncidentPolygonController {

    private final IncidentPolygonService service;

    @GetMapping("/geojson")
    public ResponseEntity<Map<String, Object>> getGeoJson() {
        log.info("GET /api/incidents/geojson");
        return ResponseEntity.ok(service.getIncidentGeoJson());
    }

    @GetMapping("/stats")
    public ResponseEntity<IncidentStatsDTO> getStats() {
        log.info("GET /api/incidents/stats");
        return ResponseEntity.ok(service.getStats());
    }

    @GetMapping("/legend")
    public ResponseEntity<IncidentLegendDTO> getLegend() {
        log.info("GET /api/incidents/legend");
        return ResponseEntity.ok(service.getLegend());
    }
}
