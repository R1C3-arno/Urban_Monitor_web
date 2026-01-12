package com.urbanmonitor.domain.citizen.disasterMonitor.builder;

import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;

import java.util.*;

/**
 * BUILDER PATTERN
 * 
 * SOLID includes:
 * - Single Responsibility
 * - Open/Closed
 */
public class GeoJsonFeatureBuilder {
    
    private String type = "Feature";
    private Map<String, Object> geometry;
    private final Map<String, Object> properties = new LinkedHashMap<>();
    
    public static GeoJsonFeatureBuilder create() {
        return new GeoJsonFeatureBuilder();
    }
    
    public GeoJsonFeatureBuilder withPolygonGeometry(List<List<List<Double>>> coordinates) {
        this.geometry = new LinkedHashMap<>();
        this.geometry.put("type", "Polygon");
        this.geometry.put("coordinates", coordinates);
        return this;
    }
    
    public GeoJsonFeatureBuilder withExistingGeometry(Map<String, Object> geometry) {
        this.geometry = geometry;
        return this;
    }
    
    public GeoJsonFeatureBuilder withProperty(String key, Object value) {
        this.properties.put(key, value);
        return this;
    }
    
    public GeoJsonFeatureBuilder withProperties(Map<String, Object> props) {
        this.properties.putAll(props);
        return this;
    }
    
    /**
     * Add all disaster zone properties to feature
     */
    public GeoJsonFeatureBuilder withDisasterZoneData(DisasterZone zone) {
        return this
            .withProperty("id", zone.getId())
            .withProperty("disasterType", zone.getDisasterType().name())
            .withProperty("name", zone.getName())
            .withProperty("description", zone.getDescription())
            .withProperty("region", zone.getRegion())
            .withProperty("severity", zone.getSeverity() != null ? zone.getSeverity().name() : null)
            .withProperty("status", zone.getStatus() != null ? zone.getStatus().name() : null)
            .withProperty("centerLongitude", zone.getCenterLongitude())
            .withProperty("centerLatitude", zone.getCenterLatitude())
            .withProperty("affectedAreaKm2", zone.getAffectedAreaKm2())
            .withProperty("affectedPopulation", zone.getAffectedPopulation())
            .withProperty("measurementValue", zone.getMeasurementValue())
            .withProperty("measurementUnit", zone.getMeasurementUnit())
            .withProperty("alertMessage", zone.getAlertMessage())
            .withProperty("evacuationInfo", zone.getEvacuationInfo())
            .withProperty("contactHotline", zone.getContactHotline())
            .withProperty("startedAt", zone.getStartedAt() != null ? zone.getStartedAt().toString() : null)
            .withProperty("expectedEndAt", zone.getExpectedEndAt() != null ? zone.getExpectedEndAt().toString() : null);
    }
    
    /**
     * Add province disaster info for merged GeoJSON
     */
    public GeoJsonFeatureBuilder withProvinceDisasterInfo(DisasterZone zone, String provinceName, int disasterCount, String color) {
        return this
            .withProperty("provinceName", provinceName)
            .withProperty("disasterCount", disasterCount)
            .withProperty("hasDisaster", true)
            .withProperty("id", zone.getId())
            .withProperty("disasterType", zone.getDisasterType().name())
            .withProperty("name", zone.getName())
            .withProperty("severity", zone.getSeverity().name())
            .withProperty("status", zone.getStatus().name())
            .withProperty("region", zone.getRegion())
            .withProperty("description", zone.getDescription())
            .withProperty("measurementValue", zone.getMeasurementValue())
            .withProperty("measurementUnit", zone.getMeasurementUnit())
            .withProperty("affectedAreaKm2", zone.getAffectedAreaKm2())
            .withProperty("affectedPopulation", zone.getAffectedPopulation())
            .withProperty("alertMessage", zone.getAlertMessage())
            .withProperty("contactHotline", zone.getContactHotline())
            .withProperty("color", color);
    }
    
    public GeoJsonFeatureBuilder withNoDisaster(String provinceName) {
        return this
            .withProperty("provinceName", provinceName)
            .withProperty("hasDisaster", false)
            .withProperty("color", "transparent");
    }
    
    public Map<String, Object> build() {
        Map<String, Object> feature = new LinkedHashMap<>();
        feature.put("type", type);
        feature.put("geometry", geometry);
        feature.put("properties", new LinkedHashMap<>(properties));
        return feature;
    }
}
