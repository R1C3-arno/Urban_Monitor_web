package com.urbanmonitor.domain.citizen.emergency.strategy;

import com.urbanmonitor.domain.citizen.emergency.dto.EmergencyDashboardResponse.Stats;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation.EmergencyType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * STRATEGY PATTERN
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EmergencyStatsCalculator {
    
    private final List<EmergencyStatsStrategy> strategies;

     //Tính stats cho emergency type

    public Stats calculate(EmergencyType type, List<EmergencyLocation> locations) {
        return strategies.stream()
            .filter(strategy -> strategy.supports(type))
            .findFirst()
            .map(strategy -> {
                log.debug("Using strategy {} for type {}", strategy.getClass().getSimpleName(), type);
                return strategy.calculateStats(locations);
            })
            .orElseGet(() -> {
                log.warn("No strategy found for type {}", type);
                return Stats.builder().build();
            });
    }
}
