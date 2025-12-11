package com.urbanmonitor.domain.citizen.dto;

import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 🎯 RouteResponse for Frontend Map Drawing
 *
 * MUST contain:
 * 1. path: List of node IDs [1, 2, 3, ..., 10]
 * 2. nodeDetails: List of NodeDetail with lat/lng for drawing
 * 3. explorationSteps: List of ExplorationStep for animation
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponse {

    // 🎯 Path as node IDs
    private List<Long> path;

    // 🎯 Node coordinates - CRITICAL for MapTiler drawing!
    private List<NodeDetail> nodeDetails;

    // Statistics
    private Integer totalDistance;      // meters
    private Integer totalTime;           // seconds
    private Integer nodeCount;
    private Integer algorithmIterations;

    // 🎯 Algorithm exploration - CRITICAL for animation!
    private List<ExplorationStep> explorationSteps;

    // Algorithm name
    private String algorithm;            // "Dijkstra" or "A*"

    // Status
    private Boolean success;
    private String error;

    /**
     * Convenience methods
     */
    public boolean isSuccess() {
        return success != null && success;
    }

    public String getFormattedDistance() {
        if (totalDistance == null) return "N/A";
        if (totalDistance < 1000) return totalDistance + "m";
        return String.format("%.1f km", totalDistance / 1000.0);
    }

    public String getFormattedTime() {
        if (totalTime == null) return "N/A";
        int minutes = totalTime / 60;
        int seconds = totalTime % 60;
        return String.format("%d:%02d", minutes, seconds);
    }

    /**
     * 🎯 Node detail for map rendering
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NodeDetail {
        private Long nodeId;
        private String nodeName;
        private Double lat;
        private Double lng;
    }
}

/**
 * 🎯 ExplorationStep - One step in algorithm execution
 *
 * Used for animation:
 * Frontend plays each step with timing
 * Shows which node is being processed
 * Color-codes nodes: GREEN→ORANGE→YELLOW→BLUE
 */

