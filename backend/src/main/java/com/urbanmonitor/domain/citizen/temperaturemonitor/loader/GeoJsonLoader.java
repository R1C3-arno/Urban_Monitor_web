package com.urbanmonitor.domain.citizen.temperaturemonitor.loader;

import java.util.Map;


public interface GeoJsonLoader {
    
    /**
     * Load GeoJSON data from source
     */
    Map<String, Object> loadGeoJson();
    
    /**
     * Check if GeoJSON data is loaded
     */
    boolean isLoaded();
}
