package com.urbanmonitor.domain.citizen.utilityMonitor.mapper;

import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Single Responsibility Principle (SRP):
 * Class này chỉ chịu trách nhiệm mapping station entity sang properties map
 * 
 * Open/Closed Principle (OCP):
 * Có thể extend class này để thêm properties mới mà không sửa code hiện tại
 */
@Component
public class DefaultUtilityPropertyMapper implements UtilityPropertyMapper {

    @Override
    public Map<String, Object> mapToProperties(UtilityMonitor station) {
        Map<String, Object> properties = new LinkedHashMap<>();
        
        properties.put("id", station.getId());
        properties.put("stationName", station.getStationName());
        properties.put("address", station.getAddress());
        properties.put("waterUsage", station.getWaterUsage());
        properties.put("electricityUsage", station.getElectricityUsage());
        properties.put("wifiPing", station.getWifiPing());
        properties.put("wifiStatus", formatWifiStatus(station.getWifiStatus()));
        properties.put("measuredAt", formatDateTime(station.getMeasuredAt()));
        
        return properties;
    }

    /**
     * Template Method - có thể override để thay đổi format
     */
    protected String formatWifiStatus(UtilityMonitor.WifiStatus status) {
        return status != null ? status.name() : null;
    }

    /**
     * Template Method - có thể override để thay đổi format datetime
     */
    protected String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.toString() : null;
    }
}
