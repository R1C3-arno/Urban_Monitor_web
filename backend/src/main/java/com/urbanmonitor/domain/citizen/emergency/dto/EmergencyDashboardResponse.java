package com.urbanmonitor.domain.citizen.emergency.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class EmergencyDashboardResponse {
    private Stats stats;
    private Map<String, Object> mapData; // GeoJSON structure

    @Data
    @Builder
    public static class Stats {
        private int total;
        private int critical;
        private int responding;
        private int active;     // Dùng cho Crime
        private List<Map<String, Object>> recentReports; // Dùng cho Crime (Top 5)
    }
}