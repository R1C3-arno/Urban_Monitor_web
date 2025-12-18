package com.urbanmonitor.domain.citizen.emergency.strategy;

import com.urbanmonitor.domain.citizen.emergency.dto.EmergencyDashboardResponse.Stats;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;

import java.util.Collections;
import java.util.List;

/**
 * TEMPLATE METHOD PATTERN
 * 
 * Abstract base class định nghĩa skeleton của algorithm.
 * Subclasses override các steps cụ thể.
 */
public abstract class AbstractEmergencyStatsStrategy implements EmergencyStatsStrategy {
    
    @Override
    public final Stats calculateStats(List<EmergencyLocation> locations) {
        if (locations == null || locations.isEmpty()) {
            return createEmptyStats();
        }
        
        Stats.StatsBuilder builder = Stats.builder()
            .total(locations.size());
        
        // Hook methods - subclasses override
        populateCriticalCount(builder, locations);
        populateRespondingCount(builder, locations);
        populateActiveCount(builder, locations);
        populateRecentReports(builder, locations);
        
        // Additional processing hook
        additionalProcessing(builder, locations);
        
        return builder.build();
    }
    
    protected Stats createEmptyStats() {
        return Stats.builder()
            .total(0)
            .critical(0)
            .responding(0)
            .active(0)
            .recentReports(Collections.emptyList())
            .build();
    }
    
    // Hook methods - default implementations do nothing
    protected void populateCriticalCount(Stats.StatsBuilder builder, List<EmergencyLocation> locations) {}
    protected void populateRespondingCount(Stats.StatsBuilder builder, List<EmergencyLocation> locations) {}
    protected void populateActiveCount(Stats.StatsBuilder builder, List<EmergencyLocation> locations) {}
    protected void populateRecentReports(Stats.StatsBuilder builder, List<EmergencyLocation> locations) {}
    protected void additionalProcessing(Stats.StatsBuilder builder, List<EmergencyLocation> locations) {}
}
