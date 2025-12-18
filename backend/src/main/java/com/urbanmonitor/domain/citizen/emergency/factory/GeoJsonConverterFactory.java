package com.urbanmonitor.domain.citizen.emergency.factory;

import com.urbanmonitor.domain.citizen.emergency.converter.GeoJsonConverter;
import com.urbanmonitor.domain.citizen.emergency.converter.PointGeoJsonConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * FACTORY PATTERN
 * 
 * Tạo GeoJSON converters phù hợp.
 * 
 * SOLID:
 * - Single Responsibility: Chỉ tạo converter objects
 * - Open/Closed: Thêm converter mới không cần sửa code
 * - Dependency Inversion: Return interface
 */
@Component("emergencyGeoJsonConverterFactory")
@RequiredArgsConstructor
public class GeoJsonConverterFactory {
    
    private final PointGeoJsonConverter pointConverter;
    
    public enum ConverterType {
        POINT
    }
    
    public GeoJsonConverter getConverter(ConverterType type) {
        return switch (type) {
            case POINT -> pointConverter;
        };
    }
    
    public GeoJsonConverter getPointConverter() {
        return pointConverter;
    }
}
