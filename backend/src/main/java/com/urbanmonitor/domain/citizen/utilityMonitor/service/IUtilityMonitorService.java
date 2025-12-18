package com.urbanmonitor.domain.citizen.utilityMonitor.service;

import com.urbanmonitor.domain.citizen.utilityMonitor.dto.UtilityDashboardResponse;
import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;

import java.util.List;

/**
 * Dependency Inversion Principle (DIP):
 * Controller sẽ depend on interface này thay vì concrete class
 * 
 * Interface Segregation Principle (ISP):
 * Interface định nghĩa các operations cần thiết cho UtilityMonitor
 */
public interface IUtilityMonitorService {

    /**
     * Get all utility monitor stations
     * @return list of all stations
     */
    List<UtilityMonitor> getAllStations();

    /**
     * Save a single station
     * @param station station to save
     * @return saved station
     */
    UtilityMonitor saveStation(UtilityMonitor station);

    /**
     * Save multiple stations
     * @param stations list of stations to save
     * @return list of saved stations
     */
    List<UtilityMonitor> saveAllStations(List<UtilityMonitor> stations);

    /**
     * Get dashboard data including stats and map data
     * @return dashboard response
     */
    UtilityDashboardResponse getDashboardData();
}
