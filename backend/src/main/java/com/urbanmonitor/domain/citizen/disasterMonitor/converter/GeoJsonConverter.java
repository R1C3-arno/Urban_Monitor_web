package com.urbanmonitor.domain.citizen.disasterMonitor.converter;

import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;

import java.util.List;
import java.util.Map;

/**
 * INTERFACE SEGREGATION PRINCIPLE
 * 
 * Interface cho các GeoJSON converters.
 * Mỗi converter implement một cách convert khác nhau.
 */
public interface GeoJsonConverter {
    
    /**
     * Convert list of disaster zones to GeoJSON FeatureCollection
     */
    Map<String, Object> convert(List<DisasterZone> zones);
}
