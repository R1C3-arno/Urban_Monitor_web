package com.urbanmonitor.domain.citizen.temperaturemonitor.service;

import com.urbanmonitor.domain.citizen.temperaturemonitor.dto.AirQualityResponse;
import com.urbanmonitor.domain.citizen.temperaturemonitor.entity.AirQualityZone;

import java.util.List;

/**
 * Dependency Inversion Principle (DIP):
 * Controller sẽ depend on interface này thay vì concrete class
 * 
 * Interface Segregation Principle (ISP):
 * Interface định nghĩa các operations cần thiết cho AirQuality
 */
public interface IAirQualityService {

    /**
     * Get all air quality zones
     * @return list of all zones
     */
    List<AirQualityZone> getAllZones();

    /**
     * Get dashboard data including stats, legend, and map data
     * @return dashboard response
     */
    AirQualityResponse getDashboardData();
}
