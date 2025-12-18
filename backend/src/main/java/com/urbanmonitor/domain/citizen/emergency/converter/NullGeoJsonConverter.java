package com.urbanmonitor.domain.citizen.emergency.converter;

import com.urbanmonitor.domain.citizen.emergency.builder.GeoJsonCollectionBuilder;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;

import java.util.List;
import java.util.Map;

/**
 * NULL OBJECT PATTERN
 * 
 * Trả về empty GeoJSON collection thay vì null.
 */
public class NullGeoJsonConverter implements GeoJsonConverter {
    
    public static final NullGeoJsonConverter INSTANCE = new NullGeoJsonConverter();
    
    private NullGeoJsonConverter() {}
    
    @Override
    public Map<String, Object> convert(List<EmergencyLocation> locations) {
        return GeoJsonCollectionBuilder.empty();
    }
}
