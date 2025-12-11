package com.urbanmonitor.domain.citizen.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * ReportResponse
 * Response for POST /api/reports
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private Long id;

    private String status;

    @JsonProperty("created_at")
    private String createdAt;

    private String message;


}
