package com.urbanmonitor.domain.citizen.temperaturemonitor.builder;

import com.urbanmonitor.domain.citizen.temperaturemonitor.dto.AirQualityResponse;
import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;

import java.util.List;

/**
 * Interface Segregation Principle (ISP):
 * Interface chuyên biệt cho việc build GeoJSON data
 * 
 * Builder Pattern:
 * Xây dựng GeoJSON structure phức tạp
 * 
 * Dependency Inversion Principle (DIP):
 * High-level modules depend on this abstraction
 */
public interface AirQualityGeoJsonBuilder {
    
    /**
     * Build GeoJSON data by merging backend data with raw GeoJSON
     * @param backendData list of air quality zones from database
     * @return merged GeoJSON data
     */
    AirQualityResponse.GeoJsonData build(List<AirQualityZone> backendData);
}
