package com.urbanmonitor.domain.citizen.temperaturemonitor.loader;

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
import java.util.Map;

/**
 * Single Responsibility Principle (SRP):
 * Class này chỉ chịu trách nhiệm load GeoJSON từ classpath
 * 
 * Open/Closed Principle (OCP):
 * Có thể extend để load từ sources khác (URL, database, etc.)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ClasspathGeoJsonLoader implements GeoJsonLoader {

    private final ObjectMapper objectMapper;
    
    private Map<String, Object> rawGeoJson;
    
    private static final String GEOJSON_FILE_PATH = "vietnam-provinces.json";

    @PostConstruct
    public void init() {
        loadFromClasspath();
    }

    @Override
    public Map<String, Object> loadGeoJson() {
        return rawGeoJson != null ? rawGeoJson : Collections.emptyMap();
    }

    @Override
    public boolean isLoaded() {
        return rawGeoJson != null && !rawGeoJson.isEmpty();
    }

    /**
     * Template Method - có thể override để thay đổi cách load
     */
    protected void loadFromClasspath() {
        try {
            ClassPathResource resource = new ClassPathResource(getFilePath());
            InputStream inputStream = resource.getInputStream();
            rawGeoJson = objectMapper.readValue(inputStream, new TypeReference<>() {});
            log.info("GeoJSON loaded successfully from: {}", getFilePath());
        } catch (IOException e) {
            log.error("Failed to load GeoJSON file: {}", getFilePath(), e);
            rawGeoJson = Collections.emptyMap();
        }
    }

    /**
     * Template Method - có thể override để thay đổi file path
     */
    protected String getFilePath() {
        return GEOJSON_FILE_PATH;
    }
}
