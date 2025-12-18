package com.urbanmonitor.domain.citizen.disasterMonitor.strategy;

import com.urbanmonitor.domain.citizen.disasterMonitor.dto.DisasterDashboardResponse.StatDetail;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.DisasterType;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.ZoneStatus;
import org.springframework.stereotype.Component;

/**
 * Strategy cho tính stats của EARTHQUAKE disasters.
 * Earthquake đếm số zone ở trạng thái ALERT.
 */
@Component
public class EarthquakeStatsStrategy implements DisasterStatsStrategy {
    
    @Override
    public boolean supports(DisasterZone zone) {
        return zone != null && zone.getDisasterType() == DisasterType.EARTHQUAKE;
    }
    
    @Override
    public void updateStats(StatDetail stats, DisasterZone zone) {
        stats.setTotal(stats.getTotal() + 1);
        if (zone.getStatus() == ZoneStatus.ALERT) {
            stats.setAlert(stats.getAlert() + 1);
        }
    }
}
