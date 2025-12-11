package com.urbanmonitor.domain.citizen.algorithm;

import com.urbanmonitor.domain.citizen.dto.ExplorationStep;
import com.urbanmonitor.domain.citizen.dto.RouteResponse;
import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

/**
 * 🚀 BIDIRECTIONAL DIJKSTRA - ẢO LẬP TỪ CẢ HAI ĐẦU
 *
 * ✅ NHƯ ĐỀ CẬP: Tìm từ START và END cùng lúc
 * ✅ NHANH HƠN: O(E log V) nhưng khám phá ít hơn
 * ✅ PHÁT HIỆN: Dừng khi 2 tìm kiếm gặp nhau
 */
@Slf4j
public class BidirectionalDijkstra {

    public static RouteResponse findShortestPath(
            Map<Long, List<DijkstraAlgorithm.Edge>> graph,
            Long startNodeId,
            Long endNodeId,
            Map<Long, TrafficNode> allNodes
    ) {
        log.debug("🚀 BiDirectional Dijkstra: Finding path from {} to {}", startNodeId, endNodeId);

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
                    .algorithm("BiDirectional Dijkstra")
                    .build();
        }

        if (!graph.containsKey(startNodeId) || !graph.containsKey(endNodeId)) {
            return RouteResponse.builder()
                    .path(Collections.emptyList())
                    .totalDistance(0)
                    .totalTime(0)
                    .error("Start or end node not found")
                    .explorationSteps(Collections.emptyList())
                    .algorithm("BiDirectional Dijkstra")
                    .build();
        }

        // Forward search (from start)
        Map<Long, Integer> distancesFwd = new HashMap<>();
        Map<Long, Long> previousFwd = new HashMap<>();
        PriorityQueue<NodeDistance> queueFwd = new PriorityQueue<>(
                Comparator.comparingInt(nd -> nd.distance)
        );
        Set<Long> visitedFwd = new HashSet<>();

        // Backward search (from end)
        Map<Long, Integer> distancesBwd = new HashMap<>();
        Map<Long, Long> previousBwd = new HashMap<>();
        PriorityQueue<NodeDistance> queueBwd = new PriorityQueue<>(
                Comparator.comparingInt(nd -> nd.distance)
        );
        Set<Long> visitedBwd = new HashSet<>();

        // Initialize both directions
        distancesFwd.put(startNodeId, 0);
        queueFwd.offer(new NodeDistance(startNodeId, 0));

        distancesBwd.put(endNodeId, 0);
        queueBwd.offer(new NodeDistance(endNodeId, 0));

        TrafficNode startNode = allNodes.get(startNodeId);
        TrafficNode endNode = allNodes.get(endNodeId);

        if (startNode != null) {
            explorationSteps.add(ExplorationStep.start(stepCounter++, startNode));
        }

        int iterations = 0;
        int meetingPoint = Integer.MAX_VALUE;
        Long meetingNode = null;

        while ((!queueFwd.isEmpty() || !queueBwd.isEmpty()) && iterations < 2000) {
            iterations++;

            // Forward step
            if (!queueFwd.isEmpty()) {
                NodeDistance current = queueFwd.poll();
                if (!visitedFwd.contains(current.nodeId)) {
                    visitedFwd.add(current.nodeId);

                    if (visitedBwd.contains(current.nodeId)) {
                        // Found meeting point!
                        int totalDist = distancesFwd.get(current.nodeId) + distancesBwd.get(current.nodeId);
                        if (totalDist < meetingPoint) {
                            meetingPoint = totalDist;
                            meetingNode = current.nodeId;
                        }
                    }

                    List<DijkstraAlgorithm.Edge> neighbors = graph.getOrDefault(current.nodeId, Collections.emptyList());
                    for (DijkstraAlgorithm.Edge edge : neighbors) {
                        if (visitedFwd.contains(edge.toNodeId)) continue;

                        int newDist = current.distance + edge.weight;
                        if (newDist < distancesFwd.getOrDefault(edge.toNodeId, Integer.MAX_VALUE)) {
                            distancesFwd.put(edge.toNodeId, newDist);
                            previousFwd.put(edge.toNodeId, current.nodeId);
                            queueFwd.offer(new NodeDistance(edge.toNodeId, newDist));
                        }
                    }
                }
            }

            // Backward step
            if (!queueBwd.isEmpty()) {
                NodeDistance current = queueBwd.poll();
                if (!visitedBwd.contains(current.nodeId)) {
                    visitedBwd.add(current.nodeId);

                    if (visitedFwd.contains(current.nodeId)) {
                        // Found meeting point!
                        int totalDist = distancesFwd.get(current.nodeId) + distancesBwd.get(current.nodeId);
                        if (totalDist < meetingPoint) {
                            meetingPoint = totalDist;
                            meetingNode = current.nodeId;
                        }
                    }

                    List<DijkstraAlgorithm.Edge> neighbors = graph.getOrDefault(current.nodeId, Collections.emptyList());
                    for (DijkstraAlgorithm.Edge edge : neighbors) {
                        if (visitedBwd.contains(edge.toNodeId)) continue;

                        int newDist = current.distance + edge.weight;
                        if (newDist < distancesBwd.getOrDefault(edge.toNodeId, Integer.MAX_VALUE)) {
                            distancesBwd.put(edge.toNodeId, newDist);
                            previousBwd.put(edge.toNodeId, current.nodeId);
                            queueBwd.offer(new NodeDistance(edge.toNodeId, newDist));
                        }
                    }
                }
            }

            // Early termination if already found good meeting point
            if (meetingNode != null &&
                    distancesFwd.getOrDefault(startNodeId, 0) >= meetingPoint / 2 &&
                    distancesBwd.getOrDefault(endNodeId, 0) >= meetingPoint / 2) {
                break;
            }
        }

        if (meetingNode == null) {
            log.warn("❌ No path found");
            return RouteResponse.builder()
                    .path(Collections.emptyList())
                    .error("No path found")
                    .explorationSteps(explorationSteps)
                    .algorithm("BiDirectional Dijkstra")
                    .build();
        }

        // Reconstruct path from both sides
        List<Long> pathFwd = reconstructPath(previousFwd, startNodeId, meetingNode);
        List<Long> pathBwd = reconstructPath(previousBwd, endNodeId, meetingNode);
        Collections.reverse(pathBwd);

        List<Long> finalPath = new ArrayList<>(pathFwd);
        if (!pathBwd.isEmpty() && pathBwd.get(0).equals(meetingNode)) {
            finalPath.addAll(pathBwd.subList(1, pathBwd.size()));
        } else {
            finalPath.addAll(pathBwd);
        }

        int totalDistance = meetingPoint;
        int totalTime = calculateTotalTime(finalPath, graph);

        log.info("✅ BiDirectional Dijkstra: {} nodes, {}m, {}s, {} iterations",
                finalPath.size(), totalDistance, totalTime, iterations);

        return RouteResponse.builder()
                .path(finalPath)
                .totalDistance(totalDistance)
                .totalTime(totalTime)
                .nodeCount(finalPath.size())
                .algorithmIterations(iterations)
                .explorationSteps(explorationSteps)
                .algorithm("BiDirectional Dijkstra")
                .build();
    }

    private static List<Long> reconstructPath(
            Map<Long, Long> previousNodes,
            Long startNodeId,
            Long endNodeId
    ) {
        LinkedList<Long> path = new LinkedList<>();
        Long current = endNodeId;
        int maxSteps = 1000;
        int steps = 0;

        while (current != null && steps < maxSteps) {
            path.addFirst(current);
            if (current.equals(startNodeId)) break;
            current = previousNodes.get(current);
            steps++;
        }

        return new ArrayList<>(path);
    }

    private static int calculateTotalTime(List<Long> path, Map<Long, List<DijkstraAlgorithm.Edge>> graph) {
        int totalTime = 0;
        for (int i = 0; i < path.size() - 1; i++) {
            Long from = path.get(i);
            Long to = path.get(i + 1);

            List<DijkstraAlgorithm.Edge> edges = graph.getOrDefault(from, Collections.emptyList());
            for (DijkstraAlgorithm.Edge edge : edges) {
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
}