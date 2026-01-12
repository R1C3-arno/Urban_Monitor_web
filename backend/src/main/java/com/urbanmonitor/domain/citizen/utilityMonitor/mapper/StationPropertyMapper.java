package com.urbanmonitor.domain.citizen.utilityMonitor.mapper;

import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;

import java.util.Map;


public interface StationPropertyMapper {
    
    /**
     * Map UtilityMonitor entity to properties map for GeoJSON
     */
    Map<String, Object> mapToProperties(UtilityMonitor station);
}
