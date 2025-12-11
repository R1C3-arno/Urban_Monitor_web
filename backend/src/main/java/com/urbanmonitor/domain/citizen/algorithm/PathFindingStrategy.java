package com.urbanmonitor.domain.citizen.algorithm;

import com.urbanmonitor.domain.citizen.dto.RouteResponse;
import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import java.util.List;
import java.util.Map;

/**
 * STRATEGY PATTERN - Path Finding
 *
 * SOLID Principles:
 * - OCP: Open for extension (new algorithms), Closed for modification
 * - DIP: High-level code depends on abstraction, not concrete implementation
 *
 * Design Pattern: Strategy
 * Purpose: Cho phép switch giữa các thuật toán khác nhau runtime
 */
public interface PathFindingStrategy {

    RouteResponse findPath(
            Map<Long, List<DijkstraAlgorithm.Edge>> graph,
            Long startNodeId,
            Long endNodeId,
            Map<Long, TrafficNode> allNodes
    );

    String getAlgorithmName();
    String getTimeComplexity();
}