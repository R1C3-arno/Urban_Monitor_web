package com.urbanmonitor.domain.citizen.disasterMonitor.converter;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * SINGLE RESPONSIBILITY PRINCIPLE:
 * Extract province name from various possible property keys in GeoJSON.
 */
@Component
public class ProvinceNameExtractor {
    
    private static final List<String> PROVINCE_NAME_KEYS = Arrays.asList(
        "Name", "name", "TEN_TINH", "NAME_1"
    );
    
    /**
     * Extract province name from GeoJSON feature properties
     */
    public String extract(Map<String, Object> properties) {
        if (properties == null) return "";
        
        for (String key : PROVINCE_NAME_KEYS) {
            Object value = properties.get(key);
            if (value instanceof String && !((String) value).isEmpty()) {
                return (String) value;
            }
        }
        
        return "";
    }
}
