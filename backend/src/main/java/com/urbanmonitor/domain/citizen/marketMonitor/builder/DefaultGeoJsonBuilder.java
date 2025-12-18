package com.urbanmonitor.domain.citizen.marketMonitor.builder;

import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;
import com.urbanmonitor.domain.citizen.marketMonitor.mapper.StorePropertyMapper;
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
 * Depend on StorePropertyMapper abstraction
 */
@Component
@RequiredArgsConstructor
public class DefaultGeoJsonBuilder implements GeoJsonBuilder {

    private final StorePropertyMapper propertyMapper;

    private static final String TYPE_FEATURE_COLLECTION = "FeatureCollection";
    private static final String TYPE_FEATURE = "Feature";
    private static final String TYPE_POINT = "Point";

    @Override
    public Map<String, Object> buildFeatureCollection(List<LicensedStore> stores) {
        List<Map<String, Object>> features = new ArrayList<>();

        for (LicensedStore store : stores) {
            Map<String, Object> feature = buildFeature(store);
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
    public Map<String, Object> buildFeature(LicensedStore store) {
        if (!hasValidCoordinates(store)) {
            return null;
        }

        Map<String, Object> feature = new LinkedHashMap<>();
        feature.put("type", TYPE_FEATURE);
        feature.put("geometry", buildPointGeometry(store));
        feature.put("properties", propertyMapper.mapToProperties(store));

        return feature;
    }

    /**
     * Template Method - có thể override để support các geometry types khác
     */
    protected Map<String, Object> buildPointGeometry(LicensedStore store) {
        Map<String, Object> geometry = new LinkedHashMap<>();
        geometry.put("type", TYPE_POINT);
        geometry.put("coordinates", Arrays.asList(store.getLongitude(), store.getLatitude()));
        return geometry;
    }

    /**
     * Validation method - có thể override để thêm validation rules
     */
    protected boolean hasValidCoordinates(LicensedStore store) {
        return store.getLongitude() != null && store.getLatitude() != null;
    }
}
