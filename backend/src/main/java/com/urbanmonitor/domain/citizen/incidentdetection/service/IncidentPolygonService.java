package com.urbanmonitor.domain.citizen.incidentdetection.service;

import com.urbanmonitor.domain.citizen.incidentdetection.dto.IncidentLegendDTO;
import com.urbanmonitor.domain.citizen.incidentdetection.dto.IncidentStatsDTO;
import com.urbanmonitor.domain.citizen.incidentdetection.entity.TrafficIncident;
import com.urbanmonitor.domain.citizen.incidentdetection.mapper.GeoJsonMapper;
import com.urbanmonitor.domain.citizen.incidentdetection.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class IncidentPolygonService {

    private final IncidentRepository repository;
    private final GeoJsonMapper mapper;

    private static final Map<String, String> LEVEL_COLORS = Map.of(
            "CRITICAL", "#dc2626",
            "HIGH", "#ea580c",
            "MEDIUM", "#f59e0b",
            "LOW", "#84cc16"
    );

    private static final Map<String, Integer> LEVEL_ICON_SIZES = Map.of(
            "CRITICAL", 80,
            "HIGH", 60,
            "MEDIUM", 50,
            "LOW", 40
    );

    @Transactional(readOnly = true)
    public Map<String, Object> getIncidentGeoJson() {
        log.info("Fetching validated incidents for animated icons");

        List<TrafficIncident> incidents = repository.findValidated(
                TrafficIncident.ValidationStatus.VALIDATED
        );

        log.info("Found {} validated incidents", incidents.size());

        return mapper.toPointFeatureCollection(incidents);
    }

    @Transactional(readOnly = true)
    public IncidentStatsDTO getStats() {
        List<TrafficIncident> incidents = repository.findValidated(
                TrafficIncident.ValidationStatus.VALIDATED
        );

        int total = incidents.size();
        int highPriority = (int) incidents.stream()
                .filter(i -> Boolean.TRUE.equals(i.getIsHighPriority()))
                .count();

        // Count by level
        Map<String, Integer> byLevel = new LinkedHashMap<>();
        byLevel.put("CRITICAL", 0);
        byLevel.put("HIGH", 0);
        byLevel.put("MEDIUM", 0);
        byLevel.put("LOW", 0);
        
        incidents.forEach(i -> {
            String level = i.getLevel().name();
            byLevel.merge(level, 1, Integer::sum);
        });

        // Count by type
        Map<String, Integer> byType = incidents.stream()
                .collect(Collectors.groupingBy(
                        i -> i.getType().name(),
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));

        // Find top type
        String topType = "N/A";
        int topTypeCount = 0;
        for (Map.Entry<String, Integer> entry : byType.entrySet()) {
            if (entry.getValue() > topTypeCount) {
                topType = entry.getKey();
                topTypeCount = entry.getValue();
            }
        }

        return IncidentStatsDTO.builder()
                .total(total)
                .highPriority(highPriority)
                .topType(topType)
                .topTypeCount(topTypeCount)
                .byLevel(byLevel)
                .byType(byType)
                .build();
    }

    @Transactional(readOnly = true)
    public IncidentLegendDTO getLegend() {
        List<TrafficIncident> incidents = repository.findValidated(
                TrafficIncident.ValidationStatus.VALIDATED
        );

        Map<String, Integer> counts = new LinkedHashMap<>();
        counts.put("CRITICAL", 0);
        counts.put("HIGH", 0);
        counts.put("MEDIUM", 0);
        counts.put("LOW", 0);

        incidents.forEach(i -> {
            String level = i.getLevel().name();
            counts.merge(level, 1, Integer::sum);
        });

        List<IncidentLegendDTO.LegendItem> items = counts.entrySet().stream()
                .map(e -> IncidentLegendDTO.LegendItem.builder()
                        .level(e.getKey())
                        .color(LEVEL_COLORS.getOrDefault(e.getKey(), "#6b7280"))
                        .count(e.getValue())
                        .iconSize(LEVEL_ICON_SIZES.getOrDefault(e.getKey(), 50))
                        .build())
                .toList();

        return IncidentLegendDTO.builder()
                .levels(items)
                .build();
    }
}
