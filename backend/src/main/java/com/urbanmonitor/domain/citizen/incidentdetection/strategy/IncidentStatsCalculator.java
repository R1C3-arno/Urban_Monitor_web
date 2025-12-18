package com.urbanmonitor.domain.citizen.incidentdetection.strategy;

import com.urbanmonitor.domain.citizen.incidentdetection.dto.IncidentStatsDTO;
import com.urbanmonitor.domain.citizen.incidentdetection.entity.TrafficIncident;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * STRATEGY PATTERN - Context
 * Orchestrates các strategies để tính stats
 */
@Component
@RequiredArgsConstructor
public class IncidentStatsCalculator {

    private final CountByLevelStrategy byLevelStrategy;
    private final CountByTypeStrategy byTypeStrategy;

    public IncidentStatsDTO calculate(List<TrafficIncident> incidents) {
        int total = incidents.size();
        
        int highPriority = (int) incidents.stream()
            .filter(i -> Boolean.TRUE.equals(i.getIsHighPriority()))
            .count();

        // Strategy Pattern - delegate calculations
        Map<String, Integer> byLevel = byLevelStrategy.calculate(incidents);
        Map<String, Integer> byType = byTypeStrategy.calculate(incidents);

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
}
