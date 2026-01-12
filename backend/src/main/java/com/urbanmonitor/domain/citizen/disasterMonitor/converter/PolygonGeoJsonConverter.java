package com.urbanmonitor.domain.citizen.disasterMonitor.converter;

import com.urbanmonitor.domain.citizen.disasterMonitor.builder.GeoJsonCollectionBuilder;
import com.urbanmonitor.domain.citizen.disasterMonitor.builder.GeoJsonFeatureBuilder;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * SINGLE RESPONSIBILITY: Convert disaster zones to polygon GeoJSON
 * Sử dụng Builder Pattern để tạo GeoJSON objects.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PolygonGeoJsonConverter implements GeoJsonConverter {
    
    private final CoordinateParser coordinateParser;
    
    @Override
    public Map<String, Object> convert(List<DisasterZone> zones) {
        GeoJsonCollectionBuilder collectionBuilder = GeoJsonCollectionBuilder.create();
        
        for (DisasterZone zone : zones) {
            convertZone(zone).ifPresent(collectionBuilder::addFeature);
        }
        
        return collectionBuilder.build();
    }
    
    private java.util.Optional<Map<String, Object>> convertZone(DisasterZone zone) {
        return coordinateParser.parsePolygonCoordinates(zone.getPolygonCoordinates())
            .map(coordinates -> 
                GeoJsonFeatureBuilder.create()
                    .withPolygonGeometry(coordinates)
                    .withDisasterZoneData(zone)
                    .build()
            );
    }
}
