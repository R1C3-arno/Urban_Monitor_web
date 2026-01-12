package com.urbanmonitor.domain.citizen.incidentdetection.strategy;

import com.urbanmonitor.domain.citizen.incidentdetection.entity.TrafficIncident;

import java.util.List;
import java.util.Map;

/**
 * STRATEGY PATTERN
 */
public interface StatsCalculationStrategy {

    //tính count
    Map<String, Integer> calculate(List<TrafficIncident> incidents);

    //tên loại
    String getStrategyName();
    //chưa phát triển
}
