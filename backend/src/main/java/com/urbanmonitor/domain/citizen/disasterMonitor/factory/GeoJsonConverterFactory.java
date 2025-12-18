package com.urbanmonitor.domain.citizen.disasterMonitor.factory;

import com.urbanmonitor.domain.citizen.disasterMonitor.converter.GeoJsonConverter;
import com.urbanmonitor.domain.citizen.disasterMonitor.converter.PolygonGeoJsonConverter;
import com.urbanmonitor.domain.citizen.disasterMonitor.converter.MergedProvinceGeoJsonConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * FACTORY PATTERN - Tạo GeoJSON converters phù hợp
 * 
 * Encapsulate logic quyết định sử dụng converter nào.
 * 
 * SOLID:
 * - Single Responsibility: Chỉ tạo converter objects
 * - Open/Closed: Thêm converter mới không cần sửa code cũ
 * - Dependency Inversion: Return interface, không phải implementation
 */

@Component("disasterGeoJsonConverterFactory")
@RequiredArgsConstructor
public class GeoJsonConverterFactory {
    
    private final PolygonGeoJsonConverter polygonConverter;
    private final MergedProvinceGeoJsonConverter mergedConverter;
    
    public enum ConverterType {
        POLYGON,        // Convert disaster zones to polygon GeoJSON
        MERGED_PROVINCE // Merge disasters with province boundaries
    }
    
    /**
     * Get converter by type
     */
    public GeoJsonConverter getConverter(ConverterType type) {
        return switch (type) {
            case POLYGON -> polygonConverter;
            case MERGED_PROVINCE -> mergedConverter;
        };
    }
    
    /**
     * Get default polygon converter
     */
    public GeoJsonConverter getPolygonConverter() {
        return polygonConverter;
    }
    
    /**
     * Get merged province converter
     */
    public GeoJsonConverter getMergedConverter() {
        return mergedConverter;
    }
}
