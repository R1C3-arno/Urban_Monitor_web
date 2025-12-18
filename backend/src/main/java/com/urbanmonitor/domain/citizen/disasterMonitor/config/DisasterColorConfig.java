package com.urbanmonitor.domain.citizen.disasterMonitor.config;

import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.DisasterType;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;

/**
 * SINGLE RESPONSIBILITY + OPEN/CLOSED PRINCIPLE
 * 
 * Configuration class cho màu sắc của các loại disaster.
 * Tách biệt configuration ra khỏi business logic.
 */
@Component
public class DisasterColorConfig {
    
    private final Map<DisasterType, String> colorMap;
    private static final String DEFAULT_COLOR = "#666666";
    private static final String NO_DISASTER_COLOR = "transparent";
    
    public DisasterColorConfig() {
        colorMap = new EnumMap<>(DisasterType.class);
        colorMap.put(DisasterType.FLOOD, "#94B4C1");
        colorMap.put(DisasterType.EARTHQUAKE, "#715A5A");
        colorMap.put(DisasterType.HEATWAVE, "#CC561E");
        colorMap.put(DisasterType.STORM, "#005461");
    }
    
    public String getColor(DisasterType type) {
        return colorMap.getOrDefault(type, DEFAULT_COLOR);
    }
    
    public String getDefaultColor() {
        return DEFAULT_COLOR;
    }
    
    public String getNoDisasterColor() {
        return NO_DISASTER_COLOR;
    }
}
