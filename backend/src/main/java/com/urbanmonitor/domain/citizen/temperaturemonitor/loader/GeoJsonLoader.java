package com.urbanmonitor.domain.citizen.temperaturemonitor.loader;

import java.util.Map;

/**
 * Interface Segregation Principle (ISP):
 * Interface chuyên biệt cho việc load GeoJSON data
 * 
 * Dependency Inversion Principle (DIP):
 * High-level modules depend on this abstraction
 */
public interface GeoJsonLoader {
    
    /**
     * Load GeoJSON data from source
     * @return raw GeoJSON as Map
     */
    Map<String, Object> loadGeoJson();
    
    /**
     * Check if GeoJSON data is loaded
     * @return true if loaded successfully
     */
    boolean isLoaded();
}
