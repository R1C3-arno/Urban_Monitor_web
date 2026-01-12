package com.urbanmonitor.domain.citizen.incidentdetection.mapper;

import com.urbanmonitor.domain.citizen.incidentdetection.builder.GeoJsonCollectionBuilder;
import com.urbanmonitor.domain.citizen.incidentdetection.builder.GeoJsonPointBuilder;
import com.urbanmonitor.domain.citizen.incidentdetection.config.IncidentVisualConfig;
import com.urbanmonitor.domain.citizen.incidentdetection.entity.TrafficIncident;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * BUILDER PATTERN
 */
@Component
@RequiredArgsConstructor
public class GeoJsonMapper {

    private final IncidentVisualConfig visualConfig;

    public Map<String, Object> toPointFeatureCollection(List<TrafficIncident> incidents) {
        GeoJsonCollectionBuilder collectionBuilder = GeoJsonCollectionBuilder.create();

        for (TrafficIncident incident : incidents) {
            if (hasValidCoordinates(incident)) {
                collectionBuilder.addFeature(toPointFeature(incident));
            }
        }

        return collectionBuilder.build();
    }

    private GeoJsonPointBuilder toPointFeature(TrafficIncident incident) {
        String description = getDescription(incident);
        Boolean isHighPriority = getIsHighPriority(incident);

        return GeoJsonPointBuilder.create()
            .withPoint(incident.getLng(), incident.getLat())
            .withProperty("id", incident.getId())
            .withProperty("title", incident.getTitle())
            .withProperty("description", description)
            .withProperty("level", incident.getLevel().name())
            .withProperty("type", incident.getType().name())
            .withProperty("isHighPriority", isHighPriority)
            .withProperty("color", visualConfig.getColor(incident.getLevel()))
            .withProperty("iconSize", visualConfig.getIconSize(incident.getLevel()))
            .withProperty("pulseSpeed", visualConfig.getPulseSpeed(incident.getLevel()));
    }

    private boolean hasValidCoordinates(TrafficIncident incident) {
        return incident.getLat() != null && incident.getLng() != null;
    }

    private String getDescription(TrafficIncident incident) {
        String desc = incident.getDescription();
        return (desc == null || desc.trim().isEmpty()) 
            ? "No description available" 
            : desc;
    }

    private Boolean getIsHighPriority(TrafficIncident incident) {
        return Boolean.TRUE.equals(incident.getIsHighPriority());
    }
}
