package com.urbanmonitor.domain.citizen.emergency.mapper;

import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Map emergencies entity qua các formate kiểu khác
 */
@Component
public class EmergencyLocationMapper {

     //(for GeoJSON and stats)
    public Map<String, Object> toPropertiesMap(EmergencyLocation loc) {
        Map<String, Object> properties = new LinkedHashMap<>();
        properties.put("id", loc.getId());
        properties.put("emergencyType", loc.getEmergencyType().name());
        properties.put("name", loc.getName());
        properties.put("description", loc.getDescription());
        properties.put("address", loc.getAddress());
        properties.put("longitude", loc.getLongitude());
        properties.put("latitude", loc.getLatitude());
        properties.put("status", loc.getStatus() != null ? loc.getStatus().name() : null);
        properties.put("priority", loc.getPriority() != null ? loc.getPriority().name() : null);
        properties.put("contactPhone", loc.getContactPhone());
        properties.put("imageUrl", loc.getImageUrl());
        properties.put("reportedAt", loc.getReportedAt() != null ? loc.getReportedAt().toString() : null);
        return properties;
    }
}
