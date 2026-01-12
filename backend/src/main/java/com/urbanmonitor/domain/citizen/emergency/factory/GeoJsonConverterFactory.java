package com.urbanmonitor.domain.citizen.emergency.factory;

import com.urbanmonitor.domain.citizen.emergency.converter.GeoJsonConverter;
import com.urbanmonitor.domain.citizen.emergency.converter.PointGeoJsonConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * FACTORY PATTERN
 */
@Component("emergencyGeoJsonConverterFactory")
@RequiredArgsConstructor
public class GeoJsonConverterFactory {
    
    private final PointGeoJsonConverter pointConverter;
    
    public enum ConverterType {
        POINT
    }

    // chưa phát trineer
    public GeoJsonConverter getConverter(ConverterType type) {
        return switch (type) {
            case POINT -> pointConverter;
        };
    }
    
    public GeoJsonConverter getPointConverter() {
        return pointConverter;
    }
}
