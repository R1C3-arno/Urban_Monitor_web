package com.urbanmonitor.domain.citizen.incidentdetection.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class IncidentStatsDTO {
    private int total;
    private int highPriority;
    private String topType;
    private int topTypeCount;
    private Map<String, Integer> byLevel;
    private Map<String, Integer> byType;
}
