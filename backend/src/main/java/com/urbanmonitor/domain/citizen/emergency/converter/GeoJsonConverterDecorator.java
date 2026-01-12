package com.urbanmonitor.domain.citizen.emergency.converter;

import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DECORATOR PATTERN  Base Decorator
 */
@RequiredArgsConstructor
public abstract class GeoJsonConverterDecorator implements GeoJsonConverter {
    
    protected final GeoJsonConverter delegate;
    
    @Override
    public Map<String, Object> convert(List<EmergencyLocation> locations) {
        return delegate.convert(locations);
    }
}
