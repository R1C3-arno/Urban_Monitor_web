package com.urbanmonitor.domain.citizen.algorithm;

import com.urbanmonitor.domain.citizen.dto.RouteResponse;
import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * CONTEXT - Strategy Pattern
 *
 * SOLID: DIP - Depends on PathFindingStrategy abstraction
 * Design Pattern: Strategy Context
 */
@Slf4j
@Component
public class PathFindingContext {

    private PathFindingStrategy strategy;

    public void setStrategy(PathFindingStrategy strategy) {
        if (strategy == null) {
            throw new IllegalArgumentException("Strategy cannot be null");
        }
        this.strategy = strategy;
        log.info("📍 Switched to algorithm: {} ({})",
                strategy.getAlgorithmName(),
                strategy.getTimeComplexity());
    }

    public RouteResponse findPath(
            Map<Long, List<DijkstraAlgorithm.Edge>> graph,
            Long start, Long end,
            Map<Long, TrafficNode> allNodes
    ) {
        if (strategy == null) {
            throw new IllegalStateException("Strategy not set. Call setStrategy() first.");
        }

        log.info("🔍 Finding path using: {}", strategy.getAlgorithmName());
        return strategy.findPath(graph, start, end, allNodes);
    }

    public String getCurrentAlgorithm() {
        return strategy != null ? strategy.getAlgorithmName() : "None";
    }
}