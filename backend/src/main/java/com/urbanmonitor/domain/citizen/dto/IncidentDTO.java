package com.urbanmonitor.domain.citizen.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * IncidentDTO
 * Individual incident/marker data
 * MUST match frontend TrafficIncident model
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentDTO {
    private Long id;

    private String title;

    private String description;

    /**
     * Latitude
     */
    private Double lat;

    /**
     * Longitude
     */
    private Double lng;

    /**
     * Severity level: LOW, MEDIUM, HIGH
     */
    private String level;

    /**
     * Incident type: CAR, BIKE, ACCIDENT, JAM, SLOW, FAST
     */
    private String type;

    /**
     * Image URL or base64 string
     */
    private String image;

    /**
     * Unix timestamp (for frontend sorting)
     */
    private Long timestamp;

    /**
     * Reporter name
     */
    private String reporter;

    /**
     * Status: PENDING, VALIDATED, RESOLVED
     */
    private String status;
}
