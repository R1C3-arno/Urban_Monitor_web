package com.urbanmonitor.domain.citizen.disasterMonitor.converter;

import com.urbanmonitor.domain.citizen.disasterMonitor.builder.GeoJsonCollectionBuilder;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;

import java.util.List;
import java.util.Map;

/**
 * NULL OBJECT PATTERN
 * 
 * Converter trả về empty GeoJSON collection thay vì null.
 * Eliminates null checks trong code sử dụng.
 */
public class NullGeoJsonConverter implements GeoJsonConverter {
    
    public static final NullGeoJsonConverter INSTANCE = new NullGeoJsonConverter();
    
    private NullGeoJsonConverter() {}
    
    @Override
    public Map<String, Object> convert(List<DisasterZone> zones) {
        return GeoJsonCollectionBuilder.empty();
    }
}
