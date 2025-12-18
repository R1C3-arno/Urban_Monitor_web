package com.urbanmonitor.domain.citizen.temperaturemonitor.calculator;

import com.urbanmonitor.domain.citizen.temperaturemonitor.dto.AirQualityResponse;
import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;

import java.util.List;

/**
 * Strategy Pattern:
 * Interface định nghĩa strategy cho việc tính toán air quality stats
 * 
 * Interface Segregation Principle (ISP):
 * Interface chuyên biệt cho việc tính stats
 */
public interface AirQualityStatsCalculator {
    
    /**
     * Calculate statistics from list of air quality zones
     * @param zones list of air quality zones
     * @return calculated stats
     */
    AirQualityResponse.Stats calculate(List<AirQualityZone> zones);
}
