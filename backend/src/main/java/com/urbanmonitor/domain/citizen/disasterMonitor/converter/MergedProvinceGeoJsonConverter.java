package com.urbanmonitor.domain.citizen.disasterMonitor.converter;

import com.urbanmonitor.domain.citizen.disasterMonitor.builder.GeoJsonCollectionBuilder;
import com.urbanmonitor.domain.citizen.disasterMonitor.builder.GeoJsonFeatureBuilder;
import com.urbanmonitor.domain.citizen.disasterMonitor.config.DisasterColorConfig;
import com.urbanmonitor.domain.citizen.disasterMonitor.config.ProvinceGeoJsonLoader;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * SINGLE RESPONSIBILITY: Merge disaster data with province GeoJSON boundaries
 * 
 * Sử dụng:
 * - Builder Pattern: GeoJsonFeatureBuilder, GeoJsonCollectionBuilder
 * - Dependency Injection: Các helper classes
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class MergedProvinceGeoJsonConverter implements GeoJsonConverter {
    
    private final ProvinceGeoJsonLoader provinceLoader;
    private final ProvinceNameExtractor nameExtractor;
    private final DisasterMatcher disasterMatcher;
    private final DisasterColorConfig colorConfig;
    
    @Override
    public Map<String, Object> convert(List<DisasterZone> disasters) {
        if (!provinceLoader.isLoaded()) {
            log.error("Province GeoJSON data not loaded");
            return GeoJsonCollectionBuilder.empty();
        }
        
        List<Map<String, Object>> features = provinceLoader.getFeatures();
        GeoJsonCollectionBuilder collectionBuilder = GeoJsonCollectionBuilder.create();
        
        log.debug("Processing {} provinces with {} disasters", features.size(), disasters.size());
        
        for (Map<String, Object> feature : features) {
            Map<String, Object> mergedFeature = processFeature(feature, disasters);
            collectionBuilder.addFeature(mergedFeature);
        }
        
        return collectionBuilder.build();
    }
    
    @SuppressWarnings("unchecked")
    private Map<String, Object> processFeature(Map<String, Object> feature, List<DisasterZone> disasters) {
        Map<String, Object> properties = (Map<String, Object>) feature.get("properties");
        Map<String, Object> geometry = (Map<String, Object>) feature.get("geometry");
        String provinceName = nameExtractor.extract(properties);
        
        // Find matching disasters
        List<DisasterZone> matchingDisasters = disasterMatcher.findMatchingDisasters(provinceName, disasters);
        
        GeoJsonFeatureBuilder featureBuilder = GeoJsonFeatureBuilder.create()
            .withExistingGeometry(geometry)
            .withProperties(new HashMap<>(properties));
        
        if (!matchingDisasters.isEmpty()) {
            // Has disasters - get most severe
            DisasterZone primaryDisaster = disasterMatcher.findMostSevere(matchingDisasters)
                .orElse(matchingDisasters.get(0));
            
            String color = colorConfig.getColor(primaryDisaster.getDisasterType());
            featureBuilder.withProvinceDisasterInfo(primaryDisaster, provinceName, matchingDisasters.size(), color);
            
        } else {
            // No disasters
            featureBuilder.withNoDisaster(provinceName);
        }
        
        return featureBuilder.build();
    }
}
