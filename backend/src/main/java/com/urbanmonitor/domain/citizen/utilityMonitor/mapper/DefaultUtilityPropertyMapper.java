package com.urbanmonitor.domain.citizen.utilityMonitor.mapper;

import com.urbanmonitor.domain.citizen.utilityMonitor.entity.UtilityMonitor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;


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
     * chuẩn hóa wifi status
     */
    protected String formatWifiStatus(UtilityMonitor.WifiStatus status) {
        return status != null ? status.name() : null;
    }

    /**
     * chuẩn hóa ngày
     */
    protected String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.toString() : null;
    }
}
