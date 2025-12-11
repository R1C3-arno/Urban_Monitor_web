package com.urbanmonitor.domain.citizen.algorithm;

import com.urbanmonitor.domain.citizen.dto.ExplorationStep;
import com.urbanmonitor.domain.citizen.dto.RouteResponse;
import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

/**
 * DIJKSTRA'S SHORTEST PATH ALGORITHM - WITH VISUALIZATION
 *
 * ✅ UPDATED: Now tracks exploration steps for frontend animation
 */
@Slf4j
public class DijkstraAlgorithm {

    public static RouteResponse findShortestPath(
            Map<Long, List<Edge>> graph,
            Long startNodeId,
            Long endNodeId,
            Map<Long, TrafficNode> allNodes
    ) {
        log.debug("🚗 Dijkstra: Finding path from {} to {}", startNodeId, endNodeId);

        // ✅ Track exploration steps for visualization
        List<ExplorationStep> explorationSteps = new ArrayList<>();
        int stepCounter = 0;

        // Edge cases
        if (startNodeId.equals(endNodeId)) {
            return RouteResponse.builder()
                    .path(Collections.singletonList(startNodeId))
                    .totalDistance(0)
                    .totalTime(0)
                    .nodeCount(1)
                    .explorationSteps(Collections.emptyList())
                    .algorithm("Dijkstra")
                    .build();
        }

        if (!graph.containsKey(startNodeId) || !graph.containsKey(endNodeId)) {
            log.warn("Log Error: Start or end node not found in graph");
            return RouteResponse.builder()
                    .path(Collections.emptyList())
                    .totalDistance(0)
                    .totalTime(0)
                    .error("Start or end node not found")
                    .explorationSteps(Collections.emptyList())
                    .algorithm("Dijkstra")
                    .build();
        }

        // Data structures for Dijkstra
        Map<Long, Integer> distances = new HashMap<>();
        Map<Long, Long> previousNodes = new HashMap<>();
        Set<Long> visited = new HashSet<>();

        PriorityQueue<NodeDistance> pq = new PriorityQueue<>(
                Comparator.comparingInt(nd -> nd.distance)
        );

        // Initialize
        distances.put(startNodeId, 0);
        pq.offer(new NodeDistance(startNodeId, 0));

        // ✅ Record START step
        TrafficNode startNode = allNodes.get(startNodeId);
        if (startNode != null) {
            explorationSteps.add(ExplorationStep.start(stepCounter++, startNode));
        }

        // DIJKSTRA'S ALGORITHM WITH TRACKING
        int iterations = 0;
        while (!pq.isEmpty() && iterations < 1000) {
            iterations++;

            NodeDistance current = pq.poll();
            Long currentNodeId = current.nodeId;
            int currentDistance = current.distance;

            if (visited.contains(currentNodeId)) continue;
            visited.add(currentNodeId);

            // ✅ Record VISIT step
            TrafficNode currentNode = allNodes.get(currentNodeId);
            if (currentNode != null) {
                explorationSteps.add(ExplorationStep.visit(
                        stepCounter++,
                        currentNode,
                        currentDistance,
                        previousNodes.get(currentNodeId)
                ));
            }

            // Found destination
            if (currentNodeId.equals(endNodeId)) {
                log.debug("Log Success: Path found in {} iterations", iterations);

                // ✅ Record FINALIZE step
                if (currentNode != null) {
                    explorationSteps.add(ExplorationStep.finalize(
                            stepCounter++,
                            currentNode,
                            currentDistance
                    ));
                }
                break;
            }

            if (currentDistance > distances.getOrDefault(currentNodeId, Integer.MAX_VALUE)) {
                continue;
            }

            // Explore neighbors
            List<Edge> neighbors = graph.getOrDefault(currentNodeId, Collections.emptyList());
            for (Edge edge : neighbors) {
                if (visited.contains(edge.toNodeId)) continue;

                int newDistance = currentDistance + edge.weight;
                int existingDistance = distances.getOrDefault(edge.toNodeId, Integer.MAX_VALUE);

                if (newDistance < existingDistance) {
                    distances.put(edge.toNodeId, newDistance);
                    previousNodes.put(edge.toNodeId, currentNodeId);
                    pq.offer(new NodeDistance(edge.toNodeId, newDistance));

                    // ✅ Record RELAX step (optional - có thể comment nếu quá nhiều)
                    // TrafficNode neighborNode = allNodes.get(edge.toNodeId);
                    // if (neighborNode != null) {
                    //     explorationSteps.add(ExplorationStep.relax(
                    //         stepCounter++,
                    //         neighborNode,
                    //         newDistance,
                    //         currentNodeId
                    //     ));
                    // }
                }
            }
        }

        // Reconstruct path
        List<Long> path = reconstructPath(previousNodes, startNodeId, endNodeId);

        if (path.isEmpty()) {
            log.warn("❌ No path found from {} to {}", startNodeId, endNodeId);
            return RouteResponse.builder()
                    .path(Collections.emptyList())
                    .error("No path found")
                    .explorationSteps(explorationSteps)
                    .algorithm("Dijkstra")
                    .build();
        }

        // Calculate statistics
        int totalDistance = distances.getOrDefault(endNodeId, 0);
        int totalTime = calculateTotalTime(path, graph);

        log.info("✅ Dijkstra: {} nodes, {}m, {}s, {} exploration steps",
                path.size(), totalDistance, totalTime, explorationSteps.size());

        return RouteResponse.builder()
                .path(path)
                .totalDistance(totalDistance)
                .totalTime(totalTime)
                .nodeCount(path.size())
                .algorithmIterations(iterations)
                .explorationSteps(explorationSteps)  // ✅ Include exploration steps
                .algorithm("Dijkstra")
                .build();
    }

    private static List<Long> reconstructPath(
            Map<Long, Long> previousNodes,
            Long startNodeId,
            Long endNodeId
    ) {
        LinkedList<Long> path = new LinkedList<>();
        Long current = endNodeId;

        while (current != null) {
            path.addFirst(current);
            if (current.equals(startNodeId)) break;
            current = previousNodes.get(current);
        }

        if (path.isEmpty() || !path.getFirst().equals(startNodeId)) {
            return Collections.emptyList();
        }

        return new ArrayList<>(path);
    }

    private static int calculateTotalTime(List<Long> path, Map<Long, List<Edge>> graph) {
        int totalTime = 0;
        for (int i = 0; i < path.size() - 1; i++) {
            Long from = path.get(i);
            Long to = path.get(i + 1);

            List<Edge> edges = graph.getOrDefault(from, Collections.emptyList());
            for (Edge edge : edges) {
                if (edge.toNodeId.equals(to)) {
                    totalTime += edge.travelTime;
                    break;
                }
            }
        }
        return totalTime;
    }

    private static class NodeDistance {
        Long nodeId;
        int distance;

        NodeDistance(Long nodeId, int distance) {
            this.nodeId = nodeId;
            this.distance = distance;
        }
    }

    public static class Edge {
        public Long toNodeId;
        public int weight;
        public int travelTime;

        public Edge(Long toNodeId, int weight, int travelTime) {
            this.toNodeId = toNodeId;
            this.weight = weight;
            this.travelTime = travelTime;
        }
    }
}