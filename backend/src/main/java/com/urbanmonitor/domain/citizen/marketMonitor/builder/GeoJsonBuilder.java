package com.urbanmonitor.domain.citizen.marketMonitor.builder;

import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;

import java.util.List;
import java.util.Map;

/**
 * Interface Segregation Principle (ISP):
 * Interface chuyên biệt cho việc build GeoJSON
 * 
 * Dependency Inversion Principle (DIP):
 * High-level modules (Service, Controller) depend on this abstraction
 */
public interface GeoJsonBuilder {
    
    /**
     * Build GeoJSON FeatureCollection from list of stores
     * @param stores list of licensed stores
     * @return GeoJSON FeatureCollection as Map
     */
    Map<String, Object> buildFeatureCollection(List<LicensedStore> stores);
    
    /**
     * Build single GeoJSON Feature from a store
     * @param store the licensed store
     * @return GeoJSON Feature as Map, or null if store has no coordinates
     */
    Map<String, Object> buildFeature(LicensedStore store);
}
