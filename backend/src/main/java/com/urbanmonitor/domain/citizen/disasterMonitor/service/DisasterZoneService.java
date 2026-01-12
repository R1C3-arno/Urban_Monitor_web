package com.urbanmonitor.domain.citizen.disasterMonitor.service;

import com.urbanmonitor.domain.citizen.disasterMonitor.dto.DisasterDashboardResponse;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * DEPENDENCY INVERSION PRINCIPLE
 * Interface cho DisasterZone service operations.
 */
public interface DisasterZoneService {
    
    //  QUERY OPERATIONS
    
    List<DisasterZone> getAll();
    
    Optional<DisasterZone> getById(Long id); //chưa phát triển
    
    List<DisasterZone> getByType(DisasterType type);
    
    List<DisasterZone> getActiveByType(DisasterType type);
    
    List<DisasterZone> getByTypeAndStatus(DisasterType type, ZoneStatus status); // chưa phát triển
    
    List<DisasterZone> getByTypeAndSeverity(DisasterType type, SeverityLevel severity); // chưa phát triển
    
    List<DisasterZone> getAllActiveOrderBySeverity();
    
    List<DisasterZone> getByRegion(String region); // chưa phát triển
    
    // COMMAND OPERATIONS
    
    DisasterZone save(DisasterZone zone);
    
    List<DisasterZone> saveAll(List<DisasterZone> zones); // chưa phát triển
    
    void deleteById(Long id);
    
    DisasterZone updateStatus(Long id, ZoneStatus newStatus);
    
    //  GEOJSON OPERATIONS

    Map<String, Object> getPolygonGeoJson(List<DisasterZone> zones);
    
    //  DASHBOARD OPERATIONS
    
    DisasterDashboardResponse getDashboardData();
}
