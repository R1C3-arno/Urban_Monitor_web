package com.urbanmonitor.domain.citizen.temperaturemonitor.calculator;

import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;

import java.util.List;
import java.util.Map;

/**
 * Interface Segregation Principle (ISP):
 * Interface chuyên biệt cho việc tính legend counts
 * 
 * Strategy Pattern:
 * Có thể implement các strategies khác nhau cho việc tính legend
 */
public interface LegendCalculator {
    
    /**
     * Calculate legend counts from list of zones
     * @param zones list of air quality zones
     * @return map of safety level to count
     */
    Map<String, Integer> calculate(List<AirQualityZone> zones);
}
