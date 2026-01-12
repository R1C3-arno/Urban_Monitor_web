package com.urbanmonitor.domain.citizen.emergency.strategy;

import com.urbanmonitor.domain.citizen.emergency.dto.EmergencyDashboardResponse.Stats;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation.*;
import com.urbanmonitor.domain.citizen.emergency.mapper.EmergencyLocationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Tính: total, active, responding, recentReports (top 5)
 */
@Component
@RequiredArgsConstructor
public class CrimeStatsStrategy extends AbstractEmergencyStatsStrategy {
    
    private final EmergencyLocationMapper mapper;
    
    @Override
    public boolean supports(EmergencyType type) {
        return type == EmergencyType.CRIME;
    }
    
    @Override
    protected void populateActiveCount(Stats.StatsBuilder builder, List<EmergencyLocation> locations) {
        int active = (int) locations.stream()
            .filter(l -> l.getStatus() == EmergencyStatus.ACTIVE)
            .count();
        builder.active(active);
    }
    
    @Override
    protected void populateRespondingCount(Stats.StatsBuilder builder, List<EmergencyLocation> locations) {
        int responding = (int) locations.stream()
            .filter(l -> l.getStatus() == EmergencyStatus.RESPONDING)
            .count();
        builder.responding(responding);
    }
    
    @Override
    protected void populateRecentReports(Stats.StatsBuilder builder, List<EmergencyLocation> locations) {
        List<Map<String, Object>> recentReports = locations.stream()
            .limit(5)
            .map(mapper::toPropertiesMap)
            .collect(Collectors.toList());
        builder.recentReports(recentReports);
    }
}
