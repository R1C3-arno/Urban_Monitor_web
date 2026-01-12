package com.urbanmonitor.domain.citizen.emergency.converter;

import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

/**
 * DECORATOR PATTERN - Concrete Decorator
 * Thêm logging cho conversion operations.
 */
@Slf4j
public class LoggingGeoJsonConverterDecorator extends GeoJsonConverterDecorator {
    
    public LoggingGeoJsonConverterDecorator(GeoJsonConverter delegate) {
        super(delegate);
    }
    
    @Override
    public Map<String, Object> convert(List<EmergencyLocation> locations) {
        long startTime = System.currentTimeMillis();
        
        log.info("Starting GeoJSON conversion for {} emergency locations", locations.size());
        
        Map<String, Object> result = delegate.convert(locations);
        
        long duration = System.currentTimeMillis() - startTime;
        
        @SuppressWarnings("unchecked")
        List<Object> features = (List<Object>) result.get("features");
        int featureCount = features != null ? features.size() : 0;
        
        log.info("GeoJSON conversion completed: {} features in {}ms", featureCount, duration);
        
        return result;
    }
}
