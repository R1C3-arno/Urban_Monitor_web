package com.urbanmonitor.domain.citizen.marketMonitor.calculator;

import com.urbanmonitor.domain.citizen.marketMonitor.dto.MarketDashboardResponse;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;

import java.util.List;

/**
 * Strategy Pattern:
 * Interface định nghĩa strategy cho việc tính toán stats
 * Có thể implement các strategies khác nhau cho các loại store khác nhau
 * 
 * Interface Segregation Principle (ISP):
 * Interface chuyên biệt cho việc tính stats
 */
public interface StatsCalculator {
    
    /**
     * Calculate statistics from list of stores
     * @param stores list of licensed stores
     * @return calculated stats
     */
    MarketDashboardResponse.Stats calculate(List<LicensedStore> stores);
}
