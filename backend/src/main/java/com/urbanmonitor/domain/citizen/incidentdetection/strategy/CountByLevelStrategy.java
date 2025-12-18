package com.urbanmonitor.domain.citizen.incidentdetection.strategy;

import com.urbanmonitor.domain.citizen.incidentdetection.entity.TrafficIncident;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Strategy tính count theo Level
 */
@Component
public class CountByLevelStrategy implements StatsCalculationStrategy {

    @Override
    public Map<String, Integer> calculate(List<TrafficIncident> incidents) {
        Map<String, Integer> byLevel = new LinkedHashMap<>();
        byLevel.put("CRITICAL", 0);
        byLevel.put("HIGH", 0);
        byLevel.put("MEDIUM", 0);
        byLevel.put("LOW", 0);

        incidents.forEach(i -> {
            String level = i.getLevel().name();
            byLevel.merge(level, 1, Integer::sum);
        });

        return byLevel;
    }

    @Override
    public String getStrategyName() {
        return "byLevel";
    }
}
