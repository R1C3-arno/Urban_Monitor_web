package com.urbanmonitor.domain.citizen.temperaturemonitor.calculator;

import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;

import java.util.List;
import java.util.Map;

/**
 * Strategy Pattern:
 */
public interface LegendCalculator {
    
    /**
     * Calculate legend counts from list of zones
     */
    Map<String, Integer> calculate(List<AirQualityZone> zones);
}
