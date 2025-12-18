package com.urbanmonitor.domain.citizen.emergency.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyDashboardResponse {
    private Stats stats;
    private Map<String, Object> mapData;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Stats {
        private int total;
        private int critical;
        private int responding;
        private int active;
        private List<Map<String, Object>> recentReports;
    }
}
