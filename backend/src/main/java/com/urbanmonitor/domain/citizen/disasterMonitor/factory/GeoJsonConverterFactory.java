package com.urbanmonitor.domain.citizen.disasterMonitor.factory;

import com.urbanmonitor.domain.citizen.disasterMonitor.converter.GeoJsonConverter;
import com.urbanmonitor.domain.citizen.disasterMonitor.converter.PolygonGeoJsonConverter;
import com.urbanmonitor.domain.citizen.disasterMonitor.converter.MergedProvinceGeoJsonConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * FACTORY PATTERN - Tạo GeoJSON converters phù hợp
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
