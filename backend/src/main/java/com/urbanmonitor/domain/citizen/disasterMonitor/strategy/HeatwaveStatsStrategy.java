package com.urbanmonitor.domain.citizen.disasterMonitor.strategy;

import com.urbanmonitor.domain.citizen.disasterMonitor.dto.DisasterDashboardResponse.StatDetail;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.DisasterType;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.SeverityLevel;
import org.springframework.stereotype.Component;

/**
 * Strategy  HEATWAVE disasters.
 */
@Component
public class HeatwaveStatsStrategy implements DisasterStatsStrategy {
    
    @Override
    public boolean supports(DisasterZone zone) {
        return zone != null && zone.getDisasterType() == DisasterType.HEATWAVE;
    }

    //đếm số zone ở mức EXTREME severity.
    @Override
    public void updateStats(StatDetail stats, DisasterZone zone) {
        stats.setTotal(stats.getTotal() + 1);
        if (zone.getSeverity() == SeverityLevel.EXTREME) {
            stats.setExtreme(stats.getExtreme() + 1);
        }
    }
}
