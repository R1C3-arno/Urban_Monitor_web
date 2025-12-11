package com.urbanmonitor.domain.citizen.dto;

import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * EXPLORATION STEP DTO
 * <p>
 * Tracks each step of pathfinding algorithm for frontend visualization
 * Used for animating Dijkstra and A* algorithms
 * <p>
 * Frontend will use this to:
 * - Show gray circles spreading from start node
 * - Highlight current processing node (pulsing effect)
 * - Draw final path after exploration completes
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExplorationStep {

    // Step number (0, 1, 2, ...)
    private Integer step;

    // Action type
    private String action;  // "START", "VISIT", "RELAX", "FINALIZE"

    // Node being processed
    private NodeInfo node;

    // Distance/score values
    private Integer distance;      // g-score (actual distance from start)
    private Integer heuristic;     // h-score (estimated to goal) - for A* only
    private Integer fScore;        // f-score (g + h) - for A* only

    // Parent node (for tracing back path)
    private Long parentNodeId;

    /**
     * Simple node info
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NodeInfo {
        private Long id;
        private String name;
        private Double lat;
        private Double lng;

        public static NodeInfo from(TrafficNode node) {
            if (node == null) return null;
            return NodeInfo.builder()
                    .id(node.getId())
                    .name(node.getNodeName())
                    .lat(node.getLat())
                    .lng(node.getLng())
                    .build();
        }
    }

    /**
     * Factory methods
     */
    public static ExplorationStep start(int step, TrafficNode node) {
        return ExplorationStep.builder()
                .step(step)
                .action("START")
                .node(NodeInfo.from(node))
                .distance(0)
                .build();
    }

    public static ExplorationStep visit(int step, TrafficNode node, Integer distance, Long parentId) {
        return ExplorationStep.builder()
                .step(step)
                .action("VISIT")
                .node(NodeInfo.from(node))
                .distance(distance)
                .parentNodeId(parentId)
                .build();
    }

    public static ExplorationStep relax(int step, TrafficNode node, Integer distance, Long parentId) {
        return ExplorationStep.builder()
                .step(step)
                .action("RELAX")
                .node(NodeInfo.from(node))
                .distance(distance)
                .parentNodeId(parentId)
                .build();
    }

    public static ExplorationStep finalize(int step, TrafficNode node, Integer distance) {
        return ExplorationStep.builder()
                .step(step)
                .action("FINALIZE")
                .node(NodeInfo.from(node))
                .distance(distance)
                .build();
    }

    /**
     * A* variant with heuristic
     */
    public static ExplorationStep visitAStar(int step, TrafficNode node,
                                             Integer gScore, Integer hScore, Integer fScore,
                                             Long parentId) {
        return ExplorationStep.builder()
                .step(step)
                .action("VISIT")
                .node(NodeInfo.from(node))
                .distance(gScore)
                .heuristic(hScore)
                .fScore(fScore)
                .parentNodeId(parentId)
                .build();
    }
}