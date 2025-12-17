package com.urbanmonitor.domain.citizen.temperaturemonitor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AirQualityResponse {
    private GeoJsonData mapData;
    private Stats stats;
    private Map<String, Integer> legend;

    @Data
    @Builder
    public static class GeoJsonData {
        private String type; // "FeatureCollection"
        private List<Feature> features;
    }

    @Data
    @Builder
    public static class Feature {
        private String type; // "Feature"
        private Map<String, Object> geometry; // Giữ nguyên geometry từ file JSON gốc
        private Map<String, Object> properties;
    }

    @Data
    @Builder
    public static class Stats {
        private int total;
        private int avgAqi;
        private String worst;
    }
}