package com.urbanmonitor.domain.citizen.disasterMonitor.builder;

import java.util.*;

/**
 * BUILDER PATTERN cho GeoJSON FeatureCollection
 * 
 * Build complete FeatureCollection với nhiều Features.
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
    
    public GeoJsonCollectionBuilder addFeature(GeoJsonFeatureBuilder featureBuilder) {
        return addFeature(featureBuilder.build());
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
    
    /**
     * Build empty collection
     */
    public static Map<String, Object> empty() {
        return create().build();
    }
}
