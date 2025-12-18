package com.urbanmonitor.domain.citizen.utilityMonitor.builder;

import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;
import com.urbanmonitor.domain.citizen.utilityMonitor.mapper.UtilityPropertyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Single Responsibility Principle (SRP):
 * Class này chỉ chịu trách nhiệm build GeoJSON structure
 * 
 * Open/Closed Principle (OCP):
 * Có thể extend để thêm geometry types khác mà không sửa code hiện tại
 * 
 * Dependency Inversion Principle (DIP):
 * Depend on UtilityPropertyMapper abstraction
 */
@Component
@RequiredArgsConstructor
public class DefaultUtilityGeoJsonBuilder implements UtilityGeoJsonBuilder {

    private final UtilityPropertyMapper propertyMapper;

    private static final String TYPE_FEATURE_COLLECTION = "FeatureCollection";
    private static final String TYPE_FEATURE = "Feature";
    private static final String TYPE_POINT = "Point";

    @Override
    public Map<String, Object> buildFeatureCollection(List<UtilityMonitor> stations) {
        List<Map<String, Object>> features = new ArrayList<>();

        for (UtilityMonitor station : stations) {
            Map<String, Object> feature = buildFeature(station);
            if (feature != null) {
                features.add(feature);
            }
        }

        Map<String, Object> featureCollection = new LinkedHashMap<>();
        featureCollection.put("type", TYPE_FEATURE_COLLECTION);
        featureCollection.put("features", features);

        return featureCollection;
    }

    @Override
    public Map<String, Object> buildFeature(UtilityMonitor station) {
        if (!hasValidCoordinates(station)) {
            return null;
        }

        Map<String, Object> feature = new LinkedHashMap<>();
        feature.put("type", TYPE_FEATURE);
        feature.put("geometry", buildPointGeometry(station));
        feature.put("properties", propertyMapper.mapToProperties(station));

        return feature;
    }

    /**
     * Template Method - có thể override để support các geometry types khác
     */
    protected Map<String, Object> buildPointGeometry(UtilityMonitor station) {
        Map<String, Object> geometry = new LinkedHashMap<>();
        geometry.put("type", TYPE_POINT);
        geometry.put("coordinates", Arrays.asList(station.getLongitude(), station.getLatitude()));
        return geometry;
    }

    /**
     * Validation method - có thể override để thêm validation rules
     */
    protected boolean hasValidCoordinates(UtilityMonitor station) {
        return station.getLongitude() != null && station.getLatitude() != null;
    }
}
