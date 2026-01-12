package com.urbanmonitor.domain.citizen.disasterMonitor.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * SINGLE RESPONSIBILITY PRINCIPLE
 * 
 * Chỉ parse polygon coordinates từ JSON string.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CoordinateParser {
    
    private final ObjectMapper objectMapper;
    
    /**
     * Parse polygon coordinates từ JSON string
     * 
     * @param coordinatesJson JSON string format: [[lng1,lat1],[lng2,lat2],...]
     * @return Optional containing parsed coordinates, or empty if parsing fails
     */
    public Optional<List<List<List<Double>>>> parsePolygonCoordinates(String coordinatesJson) {
        if (coordinatesJson == null || coordinatesJson.isEmpty()) {
            return Optional.empty();
        }
        
        try {
            List<List<Double>> ring = objectMapper.readValue(
                coordinatesJson, 
                new TypeReference<List<List<Double>>>() {}
            );
            
            List<List<List<Double>>> coordinates = new ArrayList<>();
            coordinates.add(ring);
            
            return Optional.of(coordinates);
            
        } catch (Exception e) {
            log.error("Failed to parse polygon coordinates: {}", e.getMessage());
            return Optional.empty();
        }
    }
    
    /**
     * Parse raw coordinates from GeoJSON
     */
    public Optional<List<List<Double>>> parseRingCoordinates(String coordinatesJson) {
        if (coordinatesJson == null || coordinatesJson.isEmpty()) {
            return Optional.empty();
        }
        
        try {
            List<List<Double>> ring = objectMapper.readValue(
                coordinatesJson, 
                new TypeReference<List<List<Double>>>() {}
            );
            return Optional.of(ring);
            
        } catch (Exception e) {
            log.error("Failed to parse ring coordinates: {}", e.getMessage());
            return Optional.empty();
        }
    }
}
