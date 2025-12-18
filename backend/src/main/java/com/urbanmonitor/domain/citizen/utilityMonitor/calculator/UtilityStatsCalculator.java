package com.urbanmonitor.domain.citizen.utilityMonitor.calculator;

import com.urbanmonitor.domain.citizen.utilityMonitor.dto.UtilityDashboardResponse;
import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;

import java.util.List;

/**
 * Strategy Pattern:
 * Interface định nghĩa strategy cho việc tính toán utility stats
 * 
 * Interface Segregation Principle (ISP):
 * Interface chuyên biệt cho việc tính stats
 */
public interface UtilityStatsCalculator {
    
    /**
     * Calculate statistics from list of utility monitor stations
     * @param stations list of utility monitor stations
     * @return calculated stats
     */
    UtilityDashboardResponse.Stats calculate(List<UtilityMonitor> stations);
}
