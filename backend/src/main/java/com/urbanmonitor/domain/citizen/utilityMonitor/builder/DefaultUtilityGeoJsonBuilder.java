package com.urbanmonitor.domain.citizen.utilityMonitor.builder;

import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;
import com.urbanmonitor.domain.citizen.utilityMonitor.mapper.UtilityPropertyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;


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
     * geometry types
     */
    protected Map<String, Object> buildPointGeometry(UtilityMonitor station) {
        Map<String, Object> geometry = new LinkedHashMap<>();
        geometry.put("type", TYPE_POINT);
        geometry.put("coordinates", Arrays.asList(station.getLongitude(), station.getLatitude()));
        return geometry;
    }

    /**
     * validation rules
     */
    protected boolean hasValidCoordinates(UtilityMonitor station) {
        return station.getLongitude() != null && station.getLatitude() != null;
    }
}
