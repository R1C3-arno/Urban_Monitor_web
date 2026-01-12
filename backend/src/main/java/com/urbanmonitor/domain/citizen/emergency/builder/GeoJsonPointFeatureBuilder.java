package com.urbanmonitor.domain.citizen.emergency.builder;

import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;

import java.util.*;

/**
 * BUILDER PATTERN
 * 
 * Tạo GeoJSON Point features cho emergency locations.
 */
public class GeoJsonPointFeatureBuilder {
    
    private String type = "Feature";
    private Map<String, Object> geometry;
    private final Map<String, Object> properties = new LinkedHashMap<>();
    
    public static GeoJsonPointFeatureBuilder create() {
        return new GeoJsonPointFeatureBuilder();
    }
    
    public GeoJsonPointFeatureBuilder withPointGeometry(Double longitude, Double latitude) {
        this.geometry = new LinkedHashMap<>();
        this.geometry.put("type", "Point");
        this.geometry.put("coordinates", Arrays.asList(longitude, latitude));
        return this;
    }
    
    public GeoJsonPointFeatureBuilder withProperty(String key, Object value) {
        this.properties.put(key, value);
        return this;
    }
    
    public GeoJsonPointFeatureBuilder withProperties(Map<String, Object> props) {
        this.properties.putAll(props);
        return this;
    }
    
    public GeoJsonPointFeatureBuilder withEmergencyLocationData(EmergencyLocation loc) {
        return this
            .withProperty("id", loc.getId())
            .withProperty("emergencyType", loc.getEmergencyType().name())
            .withProperty("name", loc.getName())
            .withProperty("description", loc.getDescription())
            .withProperty("address", loc.getAddress())
            .withProperty("status", loc.getStatus() != null ? loc.getStatus().name() : null)
            .withProperty("priority", loc.getPriority() != null ? loc.getPriority().name() : null)
            .withProperty("contactPhone", loc.getContactPhone())
            .withProperty("imageUrl", loc.getImageUrl())
            .withProperty("reportedAt", loc.getReportedAt() != null ? loc.getReportedAt().toString() : null);
    }
    
    public Map<String, Object> build() {
        Map<String, Object> feature = new LinkedHashMap<>();
        feature.put("type", type);
        feature.put("geometry", geometry);
        feature.put("properties", new LinkedHashMap<>(properties));
        return feature;
    }
    
    /**
     * hàm check format ( đang xơ xài thôi, có thể thêm giới hạn vùng quốc gia)
     */
    public boolean hasValidGeometry() {
        return geometry != null;
    }
}
