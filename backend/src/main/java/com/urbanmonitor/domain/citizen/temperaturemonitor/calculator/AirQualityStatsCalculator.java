package com.urbanmonitor.domain.citizen.temperaturemonitor.calculator;

import com.urbanmonitor.domain.citizen.temperaturemonitor.dto.AirQualityResponse;
import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;

import java.util.List;

/**
 * Strategy Pattern:
 */
public interface AirQualityStatsCalculator {

     //Calculate statistics from list of air quality zones

    AirQualityResponse.Stats calculate(List<AirQualityZone> zones);
}
