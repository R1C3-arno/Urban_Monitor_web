package com.urbanmonitor.domain.citizen.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * IncidentDetailResponse
 * Response for GET /api/traffic/incident/:id
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentDetailResponse {
    private IncidentDTO incident;

    private List<String> relatedReports;

    private int viewCount;
}