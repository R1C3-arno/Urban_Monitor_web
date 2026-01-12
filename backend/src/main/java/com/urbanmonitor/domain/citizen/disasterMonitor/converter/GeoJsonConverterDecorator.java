package com.urbanmonitor.domain.citizen.disasterMonitor.converter;

import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

/**
 * DECORATOR PATTERN
 * 
 * Base decorator cho GeoJsonConverter.
 */
@RequiredArgsConstructor
@Slf4j
public abstract class GeoJsonConverterDecorator implements GeoJsonConverter {
    
    protected final GeoJsonConverter delegate;
    
    @Override
    public Map<String, Object> convert(List<DisasterZone> zones) {
        return delegate.convert(zones);
    }
}
