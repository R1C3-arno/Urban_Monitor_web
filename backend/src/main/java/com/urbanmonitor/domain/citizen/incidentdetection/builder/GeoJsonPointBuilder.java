package com.urbanmonitor.domain.citizen.incidentdetection.builder;

import java.util.*;

/**
 * BUILDER PATTERN cho GeoJSON Point Feature
 */
public class GeoJsonPointBuilder {

    private Map<String, Object> geometry;
    private final Map<String, Object> properties = new LinkedHashMap<>();

    public static GeoJsonPointBuilder create() {
        return new GeoJsonPointBuilder();
    }

    public GeoJsonPointBuilder withPoint(Double lng, Double lat) {
        this.geometry = Map.of(
            "type", "Point",
            "coordinates", List.of(lng, lat)
        );
        return this;
    }

    public GeoJsonPointBuilder withProperty(String key, Object value) {
        this.properties.put(key, value);
        return this;
    }

    public GeoJsonPointBuilder withProperties(Map<String, Object> props) {
        this.properties.putAll(props);
        return this;
    }

    public Map<String, Object> build() {
        Map<String, Object> feature = new LinkedHashMap<>();
        feature.put("type", "Feature");
        feature.put("geometry", geometry);
        feature.put("properties", new LinkedHashMap<>(properties));
        return feature;
    }

    public boolean hasValidGeometry() {
        return geometry != null;
    }
}
