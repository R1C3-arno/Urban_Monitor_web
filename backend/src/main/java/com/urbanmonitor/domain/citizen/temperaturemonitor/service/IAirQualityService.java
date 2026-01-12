package com.urbanmonitor.domain.citizen.temperaturemonitor.service;

import com.urbanmonitor.domain.citizen.temperaturemonitor.dto.AirQualityResponse;
import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;

import java.util.List;


public interface IAirQualityService {

    /**
     * Get all air quality zones
     */
    List<AirQualityZone> getAllZones();

    /**
     * Get dashboard data including stats, legend, and map data
     */
    AirQualityResponse getDashboardData();
}
