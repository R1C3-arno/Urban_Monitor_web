package com.urbanmonitor.domain.citizen.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * TrafficMapResponse
 * Main response for GET /api/traffic/map
 * Matches frontend expectations exactly
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrafficMapResponse {
    private List<IncidentDTO> markers;
    private MetaDTO meta;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetaDTO {
        private int total;
        private long timestamp;

        @JsonProperty("data_source")
        private String dataSource;
    }
}


// ==================== REQUEST DTOs ====================




