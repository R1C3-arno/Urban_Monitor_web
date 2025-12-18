package com.urbanmonitor.domain.citizen.disasterMonitor.strategy;

import com.urbanmonitor.domain.citizen.disasterMonitor.dto.DisasterDashboardResponse.StatDetail;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;

/**
 * TEMPLATE METHOD PATTERN
 * 
 * Abstract base class cho DisasterStatsStrategy với template method.
 * Định nghĩa skeleton của algorithm, cho phép subclasses override steps cụ thể.
 * 
 * SOLID:
 * - Open/Closed: Template method cố định, các steps có thể extend
 * - Liskov Substitution: Tất cả subclasses đều có thể thay thế base class
 */
public abstract class AbstractDisasterStatsStrategy implements DisasterStatsStrategy {
    
    /**
     * Template method - skeleton của algorithm
     */
    @Override
    public final void updateStats(StatDetail stats, DisasterZone zone) {
        // Step 1: Always increment total (common for all)
        incrementTotal(stats);
        
        // Step 2: Check special condition (varies by disaster type)
        if (shouldIncrementSpecialCount(zone)) {
            incrementSpecialCount(stats);
        }
        
        // Step 3: Optional hook for additional processing
        additionalProcessing(stats, zone);
    }
    
    /**
     * Common step: increment total count
     */
    protected void incrementTotal(StatDetail stats) {
        stats.setTotal(stats.getTotal() + 1);
    }
    
    /**
     * Abstract method: check if special count should be incremented
     * Must be implemented by subclasses
     */
    protected abstract boolean shouldIncrementSpecialCount(DisasterZone zone);
    
    /**
     * Abstract method: increment the special count
     * Must be implemented by subclasses
     */
    protected abstract void incrementSpecialCount(StatDetail stats);
    
    /**
     * Hook method: optional additional processing
     * Can be overridden by subclasses if needed
     */
    protected void additionalProcessing(StatDetail stats, DisasterZone zone) {
        // Default: do nothing
        // Subclasses can override for custom behavior
    }
}
