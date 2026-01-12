package com.urbanmonitor.domain.citizen.incidentdetection.factory;

import com.urbanmonitor.domain.citizen.incidentdetection.config.IncidentVisualConfig;
import com.urbanmonitor.domain.citizen.incidentdetection.dto.IncidentLegendDTO;
import com.urbanmonitor.domain.citizen.incidentdetection.entity.TrafficIncident;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * FACTORY PATTERN
 */
@Component
@RequiredArgsConstructor
public class LegendFactory {

    private final IncidentVisualConfig visualConfig;

    public IncidentLegendDTO createLegend(List<TrafficIncident> incidents) {
        Map<String, Integer> counts = initializeCounts();
        
        incidents.forEach(i -> {
            String level = i.getLevel().name();
            counts.merge(level, 1, Integer::sum);
        });

        List<IncidentLegendDTO.LegendItem> items = counts.entrySet().stream()
            .map(e -> createLegendItem(e.getKey(), e.getValue()))
            .toList();

        return IncidentLegendDTO.builder()
            .levels(items)
            .build();
    }

    private Map<String, Integer> initializeCounts() {
        Map<String, Integer> counts = new LinkedHashMap<>();
        counts.put("CRITICAL", 0);
        counts.put("HIGH", 0);
        counts.put("MEDIUM", 0);
        counts.put("LOW", 0);
        return counts;
    }

    private IncidentLegendDTO.LegendItem createLegendItem(String level, int count) {
        return IncidentLegendDTO.LegendItem.builder()
            .level(level)
            .color(visualConfig.getColor(level))
            .count(count)
            .iconSize(visualConfig.getIconSize(level))
            .build();
    }
}
