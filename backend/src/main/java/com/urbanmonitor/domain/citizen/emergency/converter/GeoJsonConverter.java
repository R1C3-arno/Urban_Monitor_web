package com.urbanmonitor.domain.citizen.emergency.converter;

import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;

import java.util.List;
import java.util.Map;

/**
 * Interface cho GeoJSON converters.
 */
public interface GeoJsonConverter {
    
    /**
     * đổi danh sách Emergency qua Geojson
     */
    Map<String, Object> convert(List<EmergencyLocation> locations);
}
