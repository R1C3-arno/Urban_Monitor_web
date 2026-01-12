package com.urbanmonitor.domain.citizen.incidentdetection.strategy;

import com.urbanmonitor.domain.citizen.incidentdetection.entity.TrafficIncident;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Strategy
 */
@Component
public class CountByTypeStrategy implements StatsCalculationStrategy {


    //Tính count theo type
    @Override
    public Map<String, Integer> calculate(List<TrafficIncident> incidents) {
        return incidents.stream()
            .collect(Collectors.groupingBy(
                i -> i.getType().name(),
                Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
            ));
    }

    @Override
    public String getStrategyName() {
        return "byType";
    }
}
