package com.urbanmonitor.domain.citizen.emergency.strategy;

import com.urbanmonitor.domain.citizen.emergency.dto.EmergencyDashboardResponse.Stats;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation.*;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Strategy
 * Logic giống AMBULANCE: total, critical, responding
 */
@Component
public class FireStatsStrategy extends AbstractEmergencyStatsStrategy {
    
    @Override
    public boolean supports(EmergencyType type) {
        return type == EmergencyType.FIRE;
    }
    
    @Override
    protected void populateCriticalCount(Stats.StatsBuilder builder, List<EmergencyLocation> locations) {
        int critical = (int) locations.stream()
            .filter(l -> l.getPriority() == PriorityLevel.CRITICAL)
            .count();
        builder.critical(critical);
    }
    
    @Override
    protected void populateRespondingCount(Stats.StatsBuilder builder, List<EmergencyLocation> locations) {
        int responding = (int) locations.stream()
            .filter(l -> l.getStatus() == EmergencyStatus.RESPONDING)
            .count();
        builder.responding(responding);
    }
}
