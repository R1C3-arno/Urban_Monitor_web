package com.urbanmonitor.domain.citizen.incidentdetection.config;

import com.urbanmonitor.domain.citizen.incidentdetection.entity.TrafficIncident.IncidentLevel;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;

/**
 * SINGLE RESPONSIBILITY: Configuration cho incident visual properties
 */
@Component
public class IncidentVisualConfig {

    private final Map<IncidentLevel, String> colorMap;
    private final Map<IncidentLevel, Integer> iconSizeMap;
    private final Map<IncidentLevel, Integer> pulseSpeedMap;

    public IncidentVisualConfig() {
        colorMap = new EnumMap<>(IncidentLevel.class);
        colorMap.put(IncidentLevel.CRITICAL, "#dc2626");
        colorMap.put(IncidentLevel.HIGH, "#ea580c");
        colorMap.put(IncidentLevel.MEDIUM, "#f59e0b");
        colorMap.put(IncidentLevel.LOW, "#84cc16");

        iconSizeMap = new EnumMap<>(IncidentLevel.class);
        iconSizeMap.put(IncidentLevel.CRITICAL, 80);
        iconSizeMap.put(IncidentLevel.HIGH, 60);
        iconSizeMap.put(IncidentLevel.MEDIUM, 50);
        iconSizeMap.put(IncidentLevel.LOW, 40);

        pulseSpeedMap = new EnumMap<>(IncidentLevel.class);
        pulseSpeedMap.put(IncidentLevel.CRITICAL, 800);
        pulseSpeedMap.put(IncidentLevel.HIGH, 1000);
        pulseSpeedMap.put(IncidentLevel.MEDIUM, 1200);
        pulseSpeedMap.put(IncidentLevel.LOW, 1500);
    }

    public String getColor(IncidentLevel level) {
        return colorMap.getOrDefault(level, "#6b7280");
    }

    public String getColor(String levelName) {
        try {
            return getColor(IncidentLevel.valueOf(levelName));
        } catch (Exception e) {
            return "#6b7280";
        }
    }

    public int getIconSize(IncidentLevel level) {
        return iconSizeMap.getOrDefault(level, 50);
    }

    public int getIconSize(String levelName) {
        try {
            return getIconSize(IncidentLevel.valueOf(levelName));
        } catch (Exception e) {
            return 50;
        }
    }

    public int getPulseSpeed(IncidentLevel level) {
        return pulseSpeedMap.getOrDefault(level, 1200);
    }
}
