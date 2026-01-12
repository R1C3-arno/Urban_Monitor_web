package com.urbanmonitor.domain.citizen.disasterMonitor.strategy;

import com.urbanmonitor.domain.citizen.disasterMonitor.dto.DisasterDashboardResponse.StatDetail;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;

/**
 * TEMPLATE METHOD PATTERN
 * 
 * Abstract base cho thằng  DisasterStatsStrategy.
 *                                                  Skeleton (
 *                                                              Logic hiển thị
 *                                                            )
 * SOLID:(
 *          Open/Closed:
 *          Liskov Substitution:
 *       )
 */
public abstract class AbstractDisasterStatsStrategy implements DisasterStatsStrategy {
    
    /**
     * skeleton của algorithm
     */
    @Override
    public final void updateStats(StatDetail stats, DisasterZone zone) {
        // đặt mặc định
        incrementTotal(stats);
        
        // check điều kiện (kiểu loại của thiên taiiii)
        if (shouldIncrementSpecialCount(zone)) {
            incrementSpecialCount(stats);
        }
        
        // thêm hook tùy biêến
        additionalProcessing(stats, zone);
    }
    
    /**
     * increment total count
     */
    protected void incrementTotal(StatDetail stats) {
        stats.setTotal(stats.getTotal() + 1);
    }
    
    /**
     * check if special count should be incremented
     * nhớ override lại
     */
    protected abstract boolean shouldIncrementSpecialCount(DisasterZone zone);
    
    /**
     * increment the special count
     */
    protected abstract void incrementSpecialCount(StatDetail stats);
    
    /**
     * Hook : optional additional processing
     */
    protected void additionalProcessing(StatDetail stats, DisasterZone zone) {
        // mặc định
    }
}
