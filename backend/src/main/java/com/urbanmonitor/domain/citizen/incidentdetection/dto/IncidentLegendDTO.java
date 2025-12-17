package com.urbanmonitor.domain.citizen.incidentdetection.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class IncidentLegendDTO {
    private List<LegendItem> levels;
    
    @Data
    @Builder
    public static class LegendItem {
        private String level;
        private String color;
        private int count;
        private int iconSize;
    }
}
