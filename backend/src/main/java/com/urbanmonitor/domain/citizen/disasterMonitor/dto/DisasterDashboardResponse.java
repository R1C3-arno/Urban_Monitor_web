package com.urbanmonitor.domain.citizen.disasterMonitor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO cho Dashboard response.
 * Sử dụng Builder Pattern từ Lombok.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DisasterDashboardResponse {
    private Stats stats;
    private Map<String, Object> mapData;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Stats {
        private StatDetail flood;
        private StatDetail earthquake;
        private StatDetail heatwave;
        private StatDetail storm;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StatDetail {
        private int total;
        private int emergency; // Flood, Storm
        private int alert;     // Earthquake
        private int extreme;   // Heatwave
    }
}
