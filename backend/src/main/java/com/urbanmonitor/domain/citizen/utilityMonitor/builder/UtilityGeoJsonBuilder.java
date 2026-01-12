package com.urbanmonitor.domain.citizen.utilityMonitor.builder;

import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;

import java.util.List;
import java.util.Map;

/**
 * Builder Pattern:
 */
public interface UtilityGeoJsonBuilder {
    
    /**
     * Build GeoJSON FeatureCollection from list of stations
     */
    Map<String, Object> buildFeatureCollection(List<UtilityMonitor> stations);
    
    /**
     * Build single GeoJSON Feature from a station
     */
    Map<String, Object> buildFeature(UtilityMonitor station);
}
