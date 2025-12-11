package com.urbanmonitor.domain.citizen.service;

import com.urbanmonitor.domain.citizen.cache.TrafficGraphStore;
import com.urbanmonitor.domain.citizen.dto.RouteResponse;
import com.urbanmonitor.domain.citizen.dto.ExplorationStep;
import com.urbanmonitor.domain.citizen.entity.TrafficEdge;
import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 🎯 FOCUSED: Backend for Map Visualization
 *
 * Returns RouteResponse with:
 * - path: [1, 2, 3, ..., 10]
 * - nodeDetails: [lat/lng for each node]
 * - explorationSteps: [step-by-step execution]
 *
 * Frontend vẽ đường bằng coordinates!
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TrafficGraphService {

    private final TrafficGraphStore graphStore;

    /**
     * 🎯 Main API endpoint
     * GET /citizen/routes/find?start=1&end=10&algorithm=dijkstra
     *
     * Returns complete data for frontend to draw path
     */
    public RouteResponse findShortestPath(Long startId, Long endId, String algorithm) {
        log.info("🚀 Finding route: {} → {} [{}]", startId, endId, algorithm);

        // Validate nodes exist
        if (!graphStore.hasNode(startId) || !graphStore.hasNode(endId)) {
            log.error("❌ Start or end node not found");
            return RouteResponse.builder()
                    .error("Node not found")
                    .success(false)
                    .algorithm(algorithm)
                    .build();
        }

        // Same start/end
        if (startId.equals(endId)) {
            TrafficNode node = graphStore.getNode(startId);
            return RouteResponse.builder()
                    .path(List.of(startId))
                    .totalDistance(0)
                    .totalTime(0)
                    .nodeCount(1)
                    .algorithm(algorithm)
                    .nodeDetails(List.of(
                            RouteResponse.NodeDetail.builder()
                                    .nodeId(node.getId())
                                    .nodeName(node.getNodeName())
                                    .lat(node.getLat())
                                    .lng(node.getLng())
                                    .build()
                    ))
                    .explorationSteps(List.of())
                    .success(true)
                    .build();
        }

        // Run algorithm
        RouteResult result = "astar".equalsIgnoreCase(algorithm)
                ? runAStar(startId, endId)
                : runDijkstra(startId, endId);

        if (result.path.isEmpty()) {
            log.warn("❌ No path found");
            return RouteResponse.builder()
                    .error("No path exists")
                    .success(false)
                    .algorithm(algorithm)
                    .algorithmIterations(result.iterations)
                    .build();
        }

        // Build response
        log.info("✅ Path found: {} nodes", result.path.size());
        return buildResponse(result, algorithm);
    }

    /**
     * 🎯 Dijkstra Algorithm
     *
     * Tracks each step for visualization:
     * - START: initial node
     * - VISIT: pop from queue
     * - RELAX: update neighbor
     * - FINALIZE: reached goal
     */
    private RouteResult runDijkstra(Long startId, Long endId) {
        Map<Long, Integer> distances = new HashMap<>();
        Map<Long, Long> previous = new HashMap<>();
        PriorityQueue<NodeDist> queue = new PriorityQueue<>(
                Comparator.comparingInt(nd -> nd.dist)
        );
        Set<Long> visited = new HashSet<>();
        List<ExplorationStep> steps = new ArrayList<>();
        int iteration = 0;

        TrafficNode startNode = graphStore.getNode(startId);
        TrafficNode endNode = graphStore.getNode(endId);

        // INIT
        distances.put(startId, 0);
        queue.offer(new NodeDist(startId, 0));

        // Step 0: START
        steps.add(ExplorationStep.start(iteration++, startNode));

        // DIJKSTRA
        int maxIter = 100000;
        while (!queue.isEmpty() && iteration < maxIter) {
            NodeDist current = queue.poll();
            Long nodeId = current.nodeId;
            int dist = current.dist;

            if (visited.contains(nodeId)) continue;
            visited.add(nodeId);

            TrafficNode currentNode = graphStore.getNode(nodeId);

            // Step: VISIT
            steps.add(ExplorationStep.visit(iteration++, currentNode, dist, previous.get(nodeId)));

            // Found goal
            if (nodeId.equals(endId)) {
                steps.add(ExplorationStep.finalize(iteration++, currentNode, dist));
                break;
            }

            // Explore neighbors
            List<TrafficEdge> edges = graphStore.getEdgesFrom(nodeId);
            for (TrafficEdge edge : edges) {
                Long neighborId = edge.getToNode().getId();
                if (visited.contains(neighborId)) continue;

                int newDist = dist + edge.getDistance();
                if (newDist < distances.getOrDefault(neighborId, Integer.MAX_VALUE)) {
                    distances.put(neighborId, newDist);
                    previous.put(neighborId, nodeId);
                    queue.offer(new NodeDist(neighborId, newDist));

                    // Step: RELAX
                    TrafficNode neighbor = graphStore.getNode(neighborId);
                    steps.add(ExplorationStep.relax(iteration++, neighbor, newDist, nodeId));
                }
            }
        }

        // Reconstruct path
        List<Long> path = reconstructPath(previous, startId, endId);
        int totalDist = distances.getOrDefault(endId, 0);

        return new RouteResult(path, totalDist, iteration - 1, steps);
    }

    /**
     * 🎯 A* Algorithm with heuristic
     */
    private RouteResult runAStar(Long startId, Long endId) {
        Map<Long, Integer> gScore = new HashMap<>();
        Map<Long, Integer> fScore = new HashMap<>();
        Map<Long, Long> previous = new HashMap<>();
        PriorityQueue<NodeDist> openSet = new PriorityQueue<>(
                Comparator.comparingInt(nd -> nd.dist)
        );
        Set<Long> closedSet = new HashSet<>();
        List<ExplorationStep> steps = new ArrayList<>();
        int iteration = 0;

        TrafficNode startNode = graphStore.getNode(startId);
        TrafficNode endNode = graphStore.getNode(endId);

        // INIT
        int h = heuristic(startNode, endNode);
        gScore.put(startId, 0);
        fScore.put(startId, h);
        openSet.offer(new NodeDist(startId, h));

        // Step 0: START
        steps.add(ExplorationStep.visitAStar(iteration++, startNode, 0, h, h, null));

        // A*
        int maxIter = 100000;
        while (!openSet.isEmpty() && iteration < maxIter) {
            NodeDist current = openSet.poll();
            Long nodeId = current.nodeId;

            if (closedSet.contains(nodeId)) continue;
            closedSet.add(nodeId);

            TrafficNode currentNode = graphStore.getNode(nodeId);
            int g = gScore.get(nodeId);
            int hEstimate = heuristic(currentNode, endNode);
            int f = fScore.get(nodeId);

            // Step: VISIT with A* scores
            steps.add(ExplorationStep.visitAStar(iteration++, currentNode, g, hEstimate, f, previous.get(nodeId)));

            // Found goal
            if (nodeId.equals(endId)) {
                steps.add(ExplorationStep.finalize(iteration++, currentNode, g));
                break;
            }

            // Explore neighbors
            List<TrafficEdge> edges = graphStore.getEdgesFrom(nodeId);
            for (TrafficEdge edge : edges) {
                Long neighborId = edge.getToNode().getId();
                if (closedSet.contains(neighborId)) continue;

                int tentativeG = g + edge.getDistance();
                if (tentativeG < gScore.getOrDefault(neighborId, Integer.MAX_VALUE)) {
                    previous.put(neighborId, nodeId);
                    gScore.put(neighborId, tentativeG);

                    TrafficNode neighbor = graphStore.getNode(neighborId);
                    int neighborH = heuristic(neighbor, endNode);
                    int neighborF = tentativeG + neighborH;

                    fScore.put(neighborId, neighborF);
                    openSet.offer(new NodeDist(neighborId, neighborF));

                    // Step: VISIT with A* scores
                    steps.add(ExplorationStep.visitAStar(iteration++, neighbor, tentativeG, neighborH, neighborF, nodeId));
                }
            }
        }

        // Reconstruct path
        List<Long> path = reconstructPath(previous, startId, endId);
        int totalDist = gScore.getOrDefault(endId, 0);

        return new RouteResult(path, totalDist, iteration - 1, steps);
    }

    /**
     * Simple heuristic: straight-line distance
     */
    private int heuristic(TrafficNode from, TrafficNode to) {
        double dLat = Math.abs(from.getLat() - to.getLat());
        double dLng = Math.abs(from.getLng() - to.getLng());
        double km = (dLat + dLng) * 111;
        return (int)(km * 1000); // meters
    }

    /**
     * Reconstruct path from previous map
     */
    private List<Long> reconstructPath(Map<Long, Long> previous, Long start, Long end) {
        List<Long> path = new LinkedList<>();
        Long current = end;

        int maxSteps = 100000;
        int steps = 0;

        // Check if end was reached
        if (!previous.containsKey(end) && !start.equals(end)) {
            return new ArrayList<>();
        }

        while (current != null && !current.equals(start)) {
            path.add(0, current);
            current = previous.get(current);
            steps++;
            if (steps > maxSteps) return new ArrayList<>();
        }

        if (current != null) {
            path.add(0, start);
        }

        return path;
    }

    /**
     * 🎯 Build response for frontend
     *
     * Must include:
     * - path: node IDs
     * - nodeDetails: lat/lng coordinates (FOR DRAWING!)
     * - explorationSteps: animation data
     */
    private RouteResponse buildResponse(RouteResult result, String algorithm) {
        // Build node details (CRITICAL for frontend map drawing)
        List<RouteResponse.NodeDetail> nodeDetails = new ArrayList<>();
        for (Long nodeId : result.path) {
            TrafficNode node = graphStore.getNode(nodeId);
            if (node != null) {
                nodeDetails.add(RouteResponse.NodeDetail.builder()
                        .nodeId(node.getId())
                        .nodeName(node.getNodeName())
                        .lat(node.getLat())
                        .lng(node.getLng())
                        .build());
            }
        }

        int totalTime = calculateTime(result.path);

        return RouteResponse.builder()
                .path(result.path)
                .nodeDetails(nodeDetails)  // 🎯 For drawing on map!
                .totalDistance(result.totalDistance)
                .totalTime(totalTime)
                .nodeCount(result.path.size())
                .algorithmIterations(result.iterations)
                .explorationSteps(result.steps)  // 🎯 For animation!
                .algorithm(algorithm)
                .success(true)
                .build();
    }

    /**
     * Calculate travel time
     */
    private int calculateTime(List<Long> path) {
        int time = 0;
        for (int i = 0; i < path.size() - 1; i++) {
            Long from = path.get(i);
            Long to = path.get(i + 1);

            List<TrafficEdge> edges = graphStore.getEdgesFrom(from);
            for (TrafficEdge edge : edges) {
                if (edge.getToNode().getId().equals(to)) {
                    time += edge.getTravelTime();
                    break;
                }
            }
        }
        return time;
    }

    /**
     * Get graph stats
     */
    public Map<String, Object> getGraphStats() {
        var stats = graphStore.getStats();
        return Map.of(
                "totalNodes", stats.nodeCount(),
                "totalEdges", stats.edgeCount(),
                "averageDegree", stats.avgDegree(),
                "graphInitialized", stats.nodeCount() > 0
        );
    }

    // ═════════════════════════════════════════════════════════════
    // Helper classes
    // ═════════════════════════════════════════════════════════════

    private static class NodeDist {
        Long nodeId;
        int dist;
        NodeDist(Long nodeId, int dist) {
            this.nodeId = nodeId;
            this.dist = dist;
        }
    }

    private static class RouteResult {
        List<Long> path;
        int totalDistance;
        int iterations;
        List<ExplorationStep> steps;

        RouteResult(List<Long> path, int totalDistance, int iterations, List<ExplorationStep> steps) {
            this.path = path;
            this.totalDistance = totalDistance;
            this.iterations = iterations;
            this.steps = steps;
        }
    }

    public Set<Long> filterNodesWithEdges(Set<Long> nodes) {
        Set<Long> valid = new HashSet<>();

        for (Long nodeId : nodes) {
            List<TrafficEdge> edges = graphStore.getEdgesFrom(nodeId);
            if (edges != null && !edges.isEmpty()) {
                valid.add(nodeId);
            }
        }

        return valid;
    }
}