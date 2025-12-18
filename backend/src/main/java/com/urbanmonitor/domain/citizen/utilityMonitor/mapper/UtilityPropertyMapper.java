package com.urbanmonitor.domain.citizen.utilityMonitor.mapper;

import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;

import java.util.Map;

/**
 * Interface Segregation Principle (ISP):
 * Interface chuyên biệt cho việc mapping utility station properties
 * 
 * Dependency Inversion Principle (DIP):
 * High-level modules depend on this abstraction
 */
public interface UtilityPropertyMapper {
    
    /**
     * Map UtilityMonitor entity to properties map for GeoJSON
     * @param station the utility monitor station
     * @return map of properties
     */
    Map<String, Object> mapToProperties(UtilityMonitor station);
}
