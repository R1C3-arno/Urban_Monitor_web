package com.urbanmonitor.domain.citizen.disasterMonitor.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * SINGLE RESPONSIBILITY PRINCIPLE
 * 
 * Class chỉ có một nhiệm vụ: load và cung cấp province GeoJSON data.
 * Cũng áp dụng một phần của Singleton Pattern thông qua Spring @Component.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ProvinceGeoJsonLoader {
    
    private static final String GEOJSON_PATH = "geojson/vietnam-provinces.json";
    
    private final ObjectMapper objectMapper;
    private Map<String, Object> provincesGeoJson;
    
    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource(GEOJSON_PATH);
            InputStream inputStream = resource.getInputStream();
            provincesGeoJson = objectMapper.readValue(inputStream, new TypeReference<>() {});
            log.info("oaded Vietnam provinces GeoJSON successfully");
        } catch (IOException e) {
            log.error("Failed to load GeoJSON from {}: {}", GEOJSON_PATH, e.getMessage());
            provincesGeoJson = null;
        }
    }
    
    /**
     * Get all features from the loaded GeoJSON
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getFeatures() {
        if (provincesGeoJson == null || !provincesGeoJson.containsKey("features")) {
            log.warn("GeoJSON data is not available");
            return Collections.emptyList();
        }
        return (List<Map<String, Object>>) provincesGeoJson.get("features");
    }
    
    /**
     * Check if GeoJSON data is loaded
     */
    public boolean isLoaded() {
        return provincesGeoJson != null && provincesGeoJson.containsKey("features");
    }
    
    /**
     * Get raw GeoJSON data
     */
    public Optional<Map<String, Object>> getRawData() {
        return Optional.ofNullable(provincesGeoJson);
    }
}
