package com.urbanmonitor.domain.citizen.marketMonitor.mapper;

import com.urbanmonitor.domain.citizen.marketMonitor.entity.LicensedStore;

import java.util.Map;


public interface StorePropertyMapper {
    
    /**
     * Map LicensedStore entity to properties map for GeoJSON
     * @param store the store entity
     * @return map of properties
     */
    Map<String, Object> mapToProperties(LicensedStore store);
}
