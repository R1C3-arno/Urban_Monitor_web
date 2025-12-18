package com.urbanmonitor.domain.citizen.emergency.converter;

import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;

import java.util.List;
import java.util.Map;

/**
 * INTERFACE SEGREGATION PRINCIPLE
 * 
 * Interface cho GeoJSON converters.
 */
public interface GeoJsonConverter {
    
    /**
     * Convert list of emergency locations to GeoJSON FeatureCollection
     */
    Map<String, Object> convert(List<EmergencyLocation> locations);
}
