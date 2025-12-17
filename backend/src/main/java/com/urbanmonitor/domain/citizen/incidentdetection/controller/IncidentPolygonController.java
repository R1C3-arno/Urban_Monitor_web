package com.urbanmonitor.domain.citizen.incidentdetection.controller;

import com.urbanmonitor.domain.citizen.incidentdetection.dto.IncidentLegendDTO;
import com.urbanmonitor.domain.citizen.incidentdetection.dto.IncidentStatsDTO;
import com.urbanmonitor.domain.citizen.incidentdetection.service.IncidentPolygonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class IncidentPolygonController {

    private final IncidentPolygonService service;

    /**
     * GET /api/incidents/geojson
     * Returns GeoJSON FeatureCollection with all incident points
     */
    @GetMapping("/geojson")
    public ResponseEntity<Map<String, Object>> getGeoJson() {
        log.info("GET /api/incidents/geojson");
        return ResponseEntity.ok(service.getIncidentGeoJson());
    }

    /**
     * GET /api/incidents/stats
     * Returns pre-calculated statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<IncidentStatsDTO> getStats() {
        log.info("GET /api/incidents/stats");
        return ResponseEntity.ok(service.getStats());
    }

    /**
     * GET /api/incidents/legend
     * Returns legend data with colors and counts
     */
    @GetMapping("/legend")
    public ResponseEntity<IncidentLegendDTO> getLegend() {
        log.info("GET /api/incidents/legend");
        return ResponseEntity.ok(service.getLegend());
    }
}
