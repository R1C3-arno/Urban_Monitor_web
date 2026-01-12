package com.urbanmonitor.domain.citizen.marketMonitor.builder;

import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;
import com.urbanmonitor.domain.citizen.marketMonitor.mapper.StorePropertyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;


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
     * Template Method
     */
    protected Map<String, Object> buildPointGeometry(LicensedStore store) {
        Map<String, Object> geometry = new LinkedHashMap<>();
        geometry.put("type", TYPE_POINT);
        geometry.put("coordinates", Arrays.asList(store.getLongitude(), store.getLatitude()));
        return geometry;
    }

    /**
     * Validation method
     */
    protected boolean hasValidCoordinates(LicensedStore store) {
        return store.getLongitude() != null && store.getLatitude() != null;
    }
}
