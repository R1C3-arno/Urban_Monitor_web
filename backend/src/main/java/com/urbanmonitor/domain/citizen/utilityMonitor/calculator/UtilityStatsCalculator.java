package com.urbanmonitor.domain.citizen.utilityMonitor.calculator;

import com.urbanmonitor.domain.citizen.utilityMonitor.dto.UtilityDashboardResponse;
import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;

import java.util.List;

/**
 * Strategy Pattern:
 */
public interface UtilityStatsCalculator {
    
    /**
     * Calculate statistics from list of utility monitor stations
     */
    UtilityDashboardResponse.Stats calculate(List<UtilityMonitor> stations);
}
