package com.urbanmonitor.domain.citizen.disasterMonitor.service;

import com.urbanmonitor.domain.citizen.disasterMonitor.dto.DisasterDashboardResponse;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone;
import com.urbanmonitor.domain.citizen.disasterMonitor.entity.DisasterZone.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * DEPENDENCY INVERSION PRINCIPLE
 * 
 * Interface cho DisasterZone service operations.
 * High-level modules (Controller) depend on this abstraction,
 * not on low-level modules (Service implementation).
 */
public interface DisasterZoneService {
    
    //  QUERY OPERATIONS
    
    List<DisasterZone> getAll();
    
    Optional<DisasterZone> getById(Long id);
    
    List<DisasterZone> getByType(DisasterType type);
    
    List<DisasterZone> getActiveByType(DisasterType type);
    
    List<DisasterZone> getByTypeAndStatus(DisasterType type, ZoneStatus status);
    
    List<DisasterZone> getByTypeAndSeverity(DisasterType type, SeverityLevel severity);
    
    List<DisasterZone> getAllActiveOrderBySeverity();
    
    List<DisasterZone> getByRegion(String region);
    
    // COMMAND OPERATIONS
    
    DisasterZone save(DisasterZone zone);
    
    List<DisasterZone> saveAll(List<DisasterZone> zones);
    
    void deleteById(Long id);
    
    DisasterZone updateStatus(Long id, ZoneStatus newStatus);
    
    //  GEOJSON OPERATIONS

    Map<String, Object> getPolygonGeoJson(List<DisasterZone> zones);
    
    //  DASHBOARD OPERATIONS
    
    DisasterDashboardResponse getDashboardData();
}
