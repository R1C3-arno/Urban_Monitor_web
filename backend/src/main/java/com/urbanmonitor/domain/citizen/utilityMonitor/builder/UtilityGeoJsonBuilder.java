package com.urbanmonitor.domain.citizen.utilityMonitor.builder;

import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;

import java.util.List;
import java.util.Map;

/**
 * Interface Segregation Principle (ISP):
 * Interface chuyên biệt cho việc build GeoJSON
 * 
 * Builder Pattern:
 * Xây dựng GeoJSON structure phức tạp
 * 
 * Dependency Inversion Principle (DIP):
 * High-level modules depend on this abstraction
 */
public interface UtilityGeoJsonBuilder {
    
    /**
     * Build GeoJSON FeatureCollection from list of stations
     * @param stations list of utility monitor stations
     * @return GeoJSON FeatureCollection as Map
     */
    Map<String, Object> buildFeatureCollection(List<UtilityMonitor> stations);
    
    /**
     * Build single GeoJSON Feature from a station
     * @param station the utility monitor station
     * @return GeoJSON Feature as Map, or null if station has no coordinates
     */
    Map<String, Object> buildFeature(UtilityMonitor station);
}
