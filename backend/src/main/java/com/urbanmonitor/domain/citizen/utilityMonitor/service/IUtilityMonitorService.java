package com.urbanmonitor.domain.citizen.utilityMonitor.service;

import com.urbanmonitor.domain.citizen.utilityMonitor.dto.UtilityDashboardResponse;
import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;

import java.util.List;


public interface IUtilityMonitorService {

    /**
     * Get all utility monitor stations
     */
    List<UtilityMonitor> getAllStations();

    /**
     * Save a single station
     */
    UtilityMonitor saveStation(UtilityMonitor station);

    /**
     * Save multiple stations
     */
    List<UtilityMonitor> saveAllStations(List<UtilityMonitor> stations);

    /**
     * Get dashboard data including stats and map data
     */
    UtilityDashboardResponse getDashboardData();
}
