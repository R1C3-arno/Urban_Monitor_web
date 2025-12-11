package com.urbanmonitor.domain.citizen.mapper;

import com.urbanmonitor.domain.citizen.dto.TrafficMapResponse;
import com.urbanmonitor.domain.citizen.dto.RouteResponse;
import com.urbanmonitor.domain.citizen.dto.IncidentDTO;
import com.urbanmonitor.domain.citizen.dto.IncidentDetailResponse;
import com.urbanmonitor.domain.citizen.dto.ReportRequest;
import com.urbanmonitor.domain.citizen.dto.ReportResponse;
import com.urbanmonitor.domain.citizen.entity.TrafficIncident;
import com.urbanmonitor.domain.citizen.entity.TrafficReport;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

/**
 * TrafficMapper
 * Maps between entities and DTOs
 * 
 * Design Pattern: Mapper Pattern
 * Separates data transformation logic
 * 
 * OOP Principle: Single Responsibility
 * Only handles data mapping, no business logic
 */
@Component
public class TrafficMapper {
    
    // ==================== INCIDENT MAPPING ====================
    
    /**
     * Convert TrafficIncident entity to IncidentDTO
     * This is the main conversion for map markers
     */
    public IncidentDTO toIncidentDTO(TrafficIncident incident) {
        if (incident == null) {
            return null;
        }
        
        return IncidentDTO.builder()
                .id(incident.getId())
                .title(incident.getTitle())
                .description(incident.getDescription())
                .lat(incident.getLat())
                .lng(incident.getLng())
                .level(incident.getLevel().name())
                .type(incident.getType().name())
                .image(incident.getImage())
                .timestamp(incident.getCreatedAt() != null ? 
                          incident.getCreatedAt()
                                  .atZone(ZoneId.systemDefault())
                                  .toInstant()
                                  .toEpochMilli() : null)
                .reporter(incident.getReporter())
                .status(incident.getStatus().name())
                .build();
    }
    
    /**
     * Convert list of incidents to DTOs
     */
    public List<IncidentDTO> toIncidentDTOs(List<TrafficIncident> incidents) {
        if (incidents == null) {
            return List.of();
        }
        
        return incidents.stream()
                .map(this::toIncidentDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Create TrafficMapResponse (main response for /api/traffic/map)
     */
    public TrafficMapResponse toTrafficMapResponse(List<TrafficIncident> incidents) {
        List<IncidentDTO> markers = toIncidentDTOs(incidents);
        
        TrafficMapResponse.MetaDTO meta = TrafficMapResponse.MetaDTO.builder()
                .total(markers.size())
                .timestamp(System.currentTimeMillis())
                .dataSource("PostgreSQL Database")
                .build();
        
        return TrafficMapResponse.builder()
                .markers(markers)
                .meta(meta)
                .build();
    }
    
    // ==================== REPORT MAPPING ====================
    
    /**
     * Convert ReportRequest DTO to TrafficReport entity
     */
    public TrafficReport toReportEntity(ReportRequest request) {
        if (request == null) {
            return null;
        }
        
        return TrafficReport.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .lat(request.getLat())
                .lng(request.getLng())
                .image(request.getImage())
                .build();
    }
    
    /**
     * Convert TrafficReport entity to ReportResponse DTO
     */
    public ReportResponse toReportResponse(TrafficReport report) {
        if (report == null) {
            return null;
        }
        
        return ReportResponse.builder()
                .id(report.getId())
                .status(report.getStatus().name())
                .createdAt(report.getCreatedAt() != null ? 
                          report.getCreatedAt().toString() : null)
                .message("Report submitted successfully. Status: " + report.getStatus())
                .build();
    }
    
    // ==================== INCIDENT DETAIL MAPPING ====================
    
    /**
     * Create detailed incident response
     */
    public IncidentDetailResponse toIncidentDetailResponse(TrafficIncident incident) {
        return IncidentDetailResponse.builder()
                .incident(toIncidentDTO(incident))
                .relatedReports(List.of()) // TODO: implement if needed
                .viewCount(0) // TODO: implement if needed
                .build();
    }
}
