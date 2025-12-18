package com.urbanmonitor.domain.citizen.marketMonitor.mapper;

import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;

import java.util.Map;

/**
 * Interface Segregation Principle (ISP):
 * Interface chuyên biệt cho việc mapping store properties
 * 
 * Dependency Inversion Principle (DIP):
 * High-level modules depend on this abstraction
 */
public interface StorePropertyMapper {
    
    /**
     * Map LicensedStore entity to properties map for GeoJSON
     * @param store the store entity
     * @return map of properties
     */
    Map<String, Object> mapToProperties(LicensedStore store);
}
