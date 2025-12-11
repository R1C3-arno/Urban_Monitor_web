package com.urbanmonitor.domain.citizen.cache;

import com.urbanmonitor.domain.citizen.entity.TrafficEdge;
import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 🎯 SHARED GRAPH STORE - SINGLE SOURCE OF TRUTH
 *
 * ✅ Both TrafficService and RouteService use THIS graph
 * ✅ Singleton pattern via Spring @Component
 * ✅ Thread-safe with ConcurrentHashMap
 *
 * CRITICAL: This ensures seed and route-finding use SAME graph!
 */


import com.urbanmonitor.domain.citizen.entity.TrafficEdge;
import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * ✅ FIXED: TrafficGraphStore with proper cache clearing
 */
@Slf4j
@Component
public class TrafficGraphStore {

    // Thread-safe maps
    private final Map<Long, TrafficNode> nodeMap = new ConcurrentHashMap<>();
    private final Map<Long, List<TrafficEdge>> adjacencyMap = new ConcurrentHashMap<>();

    /**
     * ✅ CRITICAL: Rebuild graph from fresh data
     */
    public synchronized void rebuild(List<TrafficNode> nodes, List<TrafficEdge> edges) {
        log.info("🔄 Rebuilding graph store...");

        // ✅ CRITICAL: Clear old data first
        clear();

        // Build node map
        for (TrafficNode node : nodes) {
            nodeMap.put(node.getId(), node);
        }

        // Build adjacency list
        for (TrafficEdge edge : edges) {
            Long fromId = edge.getFromNode().getId();
            adjacencyMap.computeIfAbsent(fromId, k -> new ArrayList<>()).add(edge);
        }

        log.info("✅ Graph store rebuilt: {} nodes, {} edges",
                nodeMap.size(), edges.size());

        // ✅ Log stats for verification
        double avgDegree = adjacencyMap.values().stream()
                .mapToInt(List::size)
                .average()
                .orElse(0.0);

        log.info("📊 Avg degree: {}", String.format("%.2f", avgDegree));
    }

    /**
     * ✅ NEW: Clear all cached data
     */
    public synchronized void clear() {
        log.info("🗑️ Clearing graph store cache...");

        int nodeCount = nodeMap.size();
        int edgeCount = adjacencyMap.values().stream()
                .mapToInt(List::size)
                .sum();

        nodeMap.clear();
        adjacencyMap.clear();

        log.info("✅ Cleared {} nodes, {} edges from cache", nodeCount, edgeCount);
    }

    /**
     * Get node by ID
     */
    public TrafficNode getNode(Long id) {
        return nodeMap.get(id);
    }

    /**
     * Check if node exists
     */
    public boolean hasNode(Long id) {
        return nodeMap.containsKey(id);
    }

    /**
     * Get all nodes
     */
    public List<TrafficNode> getAllNodes() {
        return new ArrayList<>(nodeMap.values());
    }

    /**
     * Get outgoing edges from a node
     */
    public List<TrafficEdge> getEdgesFrom(Long nodeId) {
        return adjacencyMap.getOrDefault(nodeId, Collections.emptyList());
    }

    /**
     * Get graph statistics
     */
    public GraphStats getStats() {
        int nodeCount = nodeMap.size();
        int edgeCount = adjacencyMap.values().stream()
                .mapToInt(List::size)
                .sum();

        double avgDegree = nodeCount > 0
                ? (double) edgeCount / nodeCount
                : 0.0;

        return new GraphStats(nodeCount, edgeCount, avgDegree);
    }

    /**
     * ✅ NEW: Get cache info for debugging
     */
    public Map<String, Object> getCacheInfo() {
        return Map.of(
                "nodeMapSize", nodeMap.size(),
                "adjacencyMapSize", adjacencyMap.size(),
                "totalEdges", adjacencyMap.values().stream()
                        .mapToInt(List::size)
                        .sum(),
                "memoryEstimate", estimateMemoryUsage()
        );
    }

    /**
     * Estimate memory usage (rough)
     */
    private String estimateMemoryUsage() {
        long nodeBytes = nodeMap.size() * 200L; // ~200 bytes per node
        long edgeBytes = adjacencyMap.values().stream()
                .mapToInt(List::size)
                .sum() * 150L; // ~150 bytes per edge

        long totalBytes = nodeBytes + edgeBytes;
        return String.format("~%.2f MB", totalBytes / 1024.0 / 1024.0);
    }

    /**
     * Graph statistics record
     */
    public record GraphStats(int nodeCount, int edgeCount, double avgDegree) {}
}