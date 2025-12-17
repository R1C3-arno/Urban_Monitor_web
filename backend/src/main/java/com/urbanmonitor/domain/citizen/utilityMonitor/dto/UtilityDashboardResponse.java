package com.urbanmonitor.domain.citizen.utilityMonitor.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class UtilityDashboardResponse {
    private Stats stats;
    private Map<String, Object> mapData; // GeoJSON

    @Data
    @Builder
    public static class Stats {
        private int totalStations;
        private double avgWater;
        private double avgElectricity;
        private int avgPing;
    }
}