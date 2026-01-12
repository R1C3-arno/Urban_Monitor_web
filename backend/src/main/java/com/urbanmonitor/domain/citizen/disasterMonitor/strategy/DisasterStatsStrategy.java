package com.urbanmonitor.domain.citizen.disasterMonitor.strategy;

import com.urbanmonitor.domain.citizen.disasterMonitor.dto.DisasterDashboardResponse.StatDetail;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;

/**
 * STRATEGY PATTERN

 * Mỗi loại disaster (
 *                  Flood,
 *                  Earthquake,
 *                  Heatwave,
 *                  Storm
 *                     )
 * các chỉ số đặc biệt (
 *                       emergency,
 *                       alert,
 *                       extreme
 *                       ).
 */
public interface DisasterStatsStrategy {
    
    /**
     * hàm kiểm tra có handle dc kiểu disaster ko
     */
    boolean supports(DisasterZone zone);
    
    /**
     * update state cho zone
     */
    void updateStats(StatDetail stats, DisasterZone zone);
}
