package com.urbanmonitor.domain.citizen.emergency.converter;

import com.urbanmonitor.domain.citizen.emergency.builder.GeoJsonCollectionBuilder;
import com.urbanmonitor.domain.citizen.emergency.builder.GeoJsonPointFeatureBuilder;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Convert emergency locations to Point GeoJSON
 * Builder Pattern tạo GeoJSON objects.
 */
@Component
public class PointGeoJsonConverter implements GeoJsonConverter {
    
    @Override
    public Map<String, Object> convert(List<EmergencyLocation> locations) {
        GeoJsonCollectionBuilder collectionBuilder = GeoJsonCollectionBuilder.create();
        
        for (EmergencyLocation loc : locations) {
            if (hasValidCoordinates(loc)) {
                GeoJsonPointFeatureBuilder featureBuilder = GeoJsonPointFeatureBuilder.create()
                    .withPointGeometry(loc.getLongitude(), loc.getLatitude())
                    .withEmergencyLocationData(loc);
                    
                collectionBuilder.addFeature(featureBuilder);
            }
        }
        
        return collectionBuilder.build();
    }
    
    private boolean hasValidCoordinates(EmergencyLocation loc) {
        return loc.getLongitude() != null && loc.getLatitude() != null;
    }
}
