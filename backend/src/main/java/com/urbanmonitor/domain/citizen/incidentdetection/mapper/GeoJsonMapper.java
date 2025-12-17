package com.urbanmonitor.domain.citizen.incidentdetection.mapper;

import com.urbanmonitor.domain.citizen.incidentdetection.entity.TrafficIncident;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class GeoJsonMapper {

    /**
     * Tạo GeoJSON FeatureCollection với Point features
     * Mỗi point sẽ được render với animated icon trên map
     */
    public Map<String, Object> toPointFeatureCollection(List<TrafficIncident> incidents) {
        List<Map<String, Object>> features = incidents.stream()
                .map(this::toPointFeature)
                .toList();

        return Map.of(
                "type", "FeatureCollection",
                "features", features
        );
    }

    /**
     * Tạo Point feature với properties cho animated icon
     */
    private Map<String, Object> toPointFeature(TrafficIncident incident) {
        // Ensure description is never null
        String description = incident.getDescription();
        if (description == null || description.trim().isEmpty()) {
            description = "No description available";
        }

        // Ensure isHighPriority is never null
        Boolean isHighPriority = incident.getIsHighPriority();
        if (isHighPriority == null) {
            isHighPriority = false;
        }

        return Map.of(
                "type", "Feature",
                "geometry", Map.of(
                        "type", "Point",
                        "coordinates", List.of(incident.getLng(), incident.getLat())
                ),
                "properties", Map.of(
                        "id", incident.getId(),
                        "title", incident.getTitle(),
                        "description", description,
                        "level", incident.getLevel().name(),
                        "type", incident.getType().name(),
                        "isHighPriority", isHighPriority,
                        "color", getColorForLevel(incident.getLevel()),
                        "iconSize", getIconSizeForLevel(incident.getLevel()),
                        "pulseSpeed", getPulseSpeedForLevel(incident.getLevel())
                )
        );
    }

    /**
     * Màu sắc cho từng level (để tạo animated icon)
     */
    private String getColorForLevel(TrafficIncident.IncidentLevel level) {
        return switch (level) {
            case CRITICAL -> "#dc2626"; // Red
            case HIGH -> "#ea580c";     // Orange
            case MEDIUM -> "#f59e0b";   // Amber
            case LOW -> "#84cc16";      // Green
        };
    }

    /**
     * Kích thước icon dựa trên mức độ nghiêm trọng
     */
    private int getIconSizeForLevel(TrafficIncident.IncidentLevel level) {
        return switch (level) {
            case CRITICAL -> 80;  // Lớn nhất
            case HIGH -> 60;
            case MEDIUM -> 50;
            case LOW -> 40;       // Nhỏ nhất
        };
    }

    /**
     * Tốc độ pulse animation (ms)
     */
    private int getPulseSpeedForLevel(TrafficIncident.IncidentLevel level) {
        return switch (level) {
            case CRITICAL -> 800;  // Nhanh nhất
            case HIGH -> 1000;
            case MEDIUM -> 1200;
            case LOW -> 1500;      // Chậm nhất
        };
    }
}