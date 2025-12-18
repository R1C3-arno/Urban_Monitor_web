package com.urbanmonitor.domain.citizen.emergency.service;

import com.urbanmonitor.domain.citizen.emergency.dto.EmergencyDashboardResponse;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation;
import com.urbanmonitor.domain.citizen.emergency.entity.EmergencyLocation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * DEPENDENCY INVERSION PRINCIPLE
 * 
 * Interface cho EmergencyLocation service operations.
 */
public interface EmergencyLocationService {
    
    // Query operations
    List<EmergencyLocation> getAll();
    Optional<EmergencyLocation> getById(Long id);
    List<EmergencyLocation> getByType(EmergencyType type);
    List<EmergencyLocation> getByTypeAndStatus(EmergencyType type, EmergencyStatus status);
    
    // Command operations
    EmergencyLocation save(EmergencyLocation location);
    List<EmergencyLocation> saveAll(List<EmergencyLocation> locations);
    void deleteById(Long id);
    EmergencyLocation updateStatus(Long id, EmergencyStatus newStatus);
    
    // GeoJSON operations
    Map<String, Object> getGeoJson(List<EmergencyLocation> locations);
    
    // Dashboard operations
    EmergencyDashboardResponse getDashboardByType(EmergencyType type);
}
