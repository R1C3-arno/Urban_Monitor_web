package com.urbanmonitor.domain.citizen.algorithm;

import com.urbanmonitor.domain.citizen.dto.RouteResponse;
import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * DIJKSTRA STRATEGY
 * Concrete implementation of PathFindingStrategy
 *
 * SOLID: SRP - Only handles Dijkstra algorithm execution
 */
@Slf4j
@Component
public class DijkstraStrategy implements PathFindingStrategy {

    @Override
    public RouteResponse findPath(
            Map<Long, List<DijkstraAlgorithm.Edge>> graph,
            Long startNodeId,
            Long endNodeId,
            Map<Long, TrafficNode> allNodes
    ) {
        log.info("🎯 Using Dijkstra's Algorithm");
        return DijkstraAlgorithm.findShortestPath(graph, startNodeId, endNodeId, allNodes);
    }

    @Override
    public String getAlgorithmName() {
        return "Dijkstra";
    }

    @Override
    public String getTimeComplexity() {
        return "O((V + E) log V)";
    }
}