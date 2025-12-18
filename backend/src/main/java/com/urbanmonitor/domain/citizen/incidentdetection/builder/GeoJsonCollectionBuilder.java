package com.urbanmonitor.domain.citizen.incidentdetection.builder;

import java.util.*;

/**
 * BUILDER PATTERN cho GeoJSON FeatureCollection
 */
public class GeoJsonCollectionBuilder {

    private final List<Map<String, Object>> features = new ArrayList<>();

    public static GeoJsonCollectionBuilder create() {
        return new GeoJsonCollectionBuilder();
    }

    public GeoJsonCollectionBuilder addFeature(Map<String, Object> feature) {
        if (feature != null) {
            this.features.add(feature);
        }
        return this;
    }

    public GeoJsonCollectionBuilder addFeature(GeoJsonPointBuilder builder) {
        if (builder.hasValidGeometry()) {
            return addFeature(builder.build());
        }
        return this;
    }

    public Map<String, Object> build() {
        return Map.of(
            "type", "FeatureCollection",
            "features", new ArrayList<>(features)
        );
    }

    public static Map<String, Object> empty() {
        return create().build();
    }
}
