package com.urbanmonitor.domain.citizen.marketMonitor.calculator;

import com.urbanmonitor.domain.citizen.marketMonitor.dto.MarketDashboardResponse;
import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;

import java.util.List;


public interface StatsCalculator {
    
    /**
     * Calculate statistics from list of stores
     * @param stores list of licensed stores
     * @return calculated stats
     */
    MarketDashboardResponse.Stats calculate(List<LicensedStore> stores);
}
