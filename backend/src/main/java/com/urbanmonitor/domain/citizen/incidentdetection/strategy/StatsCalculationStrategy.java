package com.urbanmonitor.domain.citizen.incidentdetection.strategy;

import com.urbanmonitor.domain.citizen.incidentdetection.entity.TrafficIncident;

import java.util.List;
import java.util.Map;

/**
 * STRATEGY PATTERN - Interface cho các loại stats calculation
 */
public interface StatsCalculationStrategy {

    /**
     * Tính count theo một criteria
     */
    Map<String, Integer> calculate(List<TrafficIncident> incidents);

    /**
     * Tên của strategy
     */
    String getStrategyName();
}
