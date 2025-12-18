package com.urbanmonitor.domain.citizen.emergency.builder;

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
    
    public GeoJsonCollectionBuilder addFeature(GeoJsonPointFeatureBuilder featureBuilder) {
        if (featureBuilder.hasValidGeometry()) {
            return addFeature(featureBuilder.build());
        }
        return this;
    }
    
    public GeoJsonCollectionBuilder addFeatures(List<Map<String, Object>> features) {
        this.features.addAll(features);
        return this;
    }
    
    public Map<String, Object> build() {
        Map<String, Object> collection = new LinkedHashMap<>();
        collection.put("type", "FeatureCollection");
        collection.put("features", new ArrayList<>(features));
        return collection;
    }
    
    public static Map<String, Object> empty() {
        return create().build();
    }
}
