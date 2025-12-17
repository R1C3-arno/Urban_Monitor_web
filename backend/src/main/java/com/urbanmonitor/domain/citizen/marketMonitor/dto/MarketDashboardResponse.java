package com.urbanmonitor.domain.citizen.marketMonitor.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class MarketDashboardResponse {
    private Stats stats;
    private Map<String, Object> mapData; // GeoJSON structure

    @Data
    @Builder
    public static class Stats {
        private int total;
        private int active;
        private double avgRating; // Đã làm tròn 1 chữ số thập phân
    }
}