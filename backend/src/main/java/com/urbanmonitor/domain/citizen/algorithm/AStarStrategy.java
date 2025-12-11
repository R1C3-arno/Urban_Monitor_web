package com.urbanmonitor.domain.citizen.algorithm;

import com.urbanmonitor.domain.citizen.dto.ExplorationStep;
import com.urbanmonitor.domain.citizen.dto.RouteResponse;
import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * A* ALGORITHM - WITH VISUALIZATION
 *
 * ✅ UPDATED: Now tracks exploration steps for frontend animation
 */
@Slf4j
@Component
public class AStarStrategy implements PathFindingStrategy {

    @Override
    public RouteResponse findPath(
            Map<Long, List<DijkstraAlgorithm.Edge>> graph,
            Long startNodeId,
            Long endNodeId,
            Map<Long, TrafficNode> allNodes
    ) {
        log.info("⭐ Using A* Algorithm");

        // ✅ Track exploration steps
        List<ExplorationStep> explorationSteps = new ArrayList<>();
        int stepCounter = 0;

        TrafficNode startNode = allNodes.get(startNodeId);
        TrafficNode endNode = allNodes.get(endNodeId);

        if (startNode == null || endNode == null) {
            return RouteResponse.builder()
                    .error("Start or end node not found")
                    .explorationSteps(Collections.emptyList())
                    .algorithm("A*")
                    .build();
        }

        // Data structures
        Map<Long, Integer> gScore = new HashMap<>();
        Map<Long, Integer> fScore = new HashMap<>();
        Map<Long, Long> cameFrom = new HashMap<>();
        Set<Long> closedSet = new HashSet<>();

        PriorityQueue<AStarNode> openSet = new PriorityQueue<>(
                Comparator.comparingInt(n -> n.fScore)
        );

        // Initialize
        gScore.put(startNodeId, 0);
        int heuristic = calculateHeuristic(startNode, endNode);
        fScore.put(startNodeId, heuristic);
        openSet.offer(new AStarNode(startNodeId, 0, heuristic));

        // ✅ Record START
        explorationSteps.add(ExplorationStep.visitAStar(
                stepCounter++,
                startNode,
                0,
                heuristic,
                heuristic,
                null
        ));

        int iterations = 0;
        while (!openSet.isEmpty() && iterations < 1000) {
            iterations++;

            AStarNode current = openSet.poll();
            Long currentId = current.nodeId;

            if (closedSet.contains(currentId)) continue;
            closedSet.add(currentId);

            // ✅ Record VISIT
            TrafficNode currentNode = allNodes.get(currentId);
            if (currentNode != null) {
                explorationSteps.add(ExplorationStep.visitAStar(
                        stepCounter++,
                        currentNode,
                        gScore.get(currentId),
                        calculateHeuristic(currentNode, endNode),
                        fScore.get(currentId),
                        cameFrom.get(currentId)
                ));
            }

            // Goal reached
            if (currentId.equals(endNodeId)) {
                log.info("✅ A* found path in {} iterations", iterations);

                // ✅ Record FINALIZE
                if (currentNode != null) {
                    explorationSteps.add(ExplorationStep.finalize(
                            stepCounter++,
                            currentNode,
                            gScore.get(currentId)
                    ));
                }

                return buildResponse(cameFrom, startNodeId, endNodeId,
                        gScore, allNodes, graph, iterations, explorationSteps);
            }

            // Explore neighbors
            List<DijkstraAlgorithm.Edge> neighbors =
                    graph.getOrDefault(currentId, Collections.emptyList());

            for (DijkstraAlgorithm.Edge edge : neighbors) {
                if (closedSet.contains(edge.toNodeId)) continue;

                int tentativeG = gScore.get(currentId) + edge.weight;

                if (tentativeG < gScore.getOrDefault(edge.toNodeId, Integer.MAX_VALUE)) {
                    cameFrom.put(edge.toNodeId, currentId);
                    gScore.put(edge.toNodeId, tentativeG);

                    TrafficNode neighborNode = allNodes.get(edge.toNodeId);
                    int h = neighborNode != null ?
                            calculateHeuristic(neighborNode, endNode) : 0;
                    int f = tentativeG + h;

                    fScore.put(edge.toNodeId, f);
                    openSet.offer(new AStarNode(edge.toNodeId, tentativeG, f));

                    // ✅ Optional: Record RELAX (comment nếu quá nhiều steps)
                    // if (neighborNode != null) {
                    //     explorationSteps.add(ExplorationStep.visitAStar(
                    //         stepCounter++,
                    //         neighborNode,
                    //         tentativeG,
                    //         h,
                    //         f,
                    //         currentId
                    //     ));
                    // }
                }
            }
        }

        return RouteResponse.builder()
                .error("No path found")
                .explorationSteps(explorationSteps)
                .algorithm("A*")
                .build();
    }

    private int calculateHeuristic(TrafficNode from, TrafficNode to) {
        double latDiff = Math.abs(from.getLat() - to.getLat());
        double lngDiff = Math.abs(from.getLng() - to.getLng());
        double distanceKm = (latDiff + lngDiff) * 111;
        return (int) (distanceKm * 1000);
    }

    private RouteResponse buildResponse(
            Map<Long, Long> cameFrom,
            Long start, Long end,
            Map<Long, Integer> gScore,
            Map<Long, TrafficNode> allNodes,
            Map<Long, List<DijkstraAlgorithm.Edge>> graph,
            int iterations,
            List<ExplorationStep> explorationSteps  // ✅ Include steps
    ) {
        // Reconstruct path
        LinkedList<Long> path = new LinkedList<>();
        Long current = end;

        while (current != null) {
            path.addFirst(current);
            if (current.equals(start)) break;
            current = cameFrom.get(current);
        }

        int totalDistance = gScore.getOrDefault(end, 0);
        int totalTime = calculateTime(new ArrayList<>(path), graph);

        return RouteResponse.builder()
                .path(new ArrayList<>(path))
                .totalDistance(totalDistance)
                .totalTime(totalTime)
                .nodeCount(path.size())
                .algorithmIterations(iterations)
                .explorationSteps(explorationSteps)  // ✅ Include exploration steps
                .algorithm("A*")
                .build();
    }

    private int calculateTime(List<Long> path, Map<Long, List<DijkstraAlgorithm.Edge>> graph) {
        int time = 0;
        for (int i = 0; i < path.size() - 1; i++) {
            Long from = path.get(i);
            Long to = path.get(i + 1);
            for (DijkstraAlgorithm.Edge e : graph.getOrDefault(from, Collections.emptyList())) {
                if (e.toNodeId.equals(to)) {
                    time += e.travelTime;
                    break;
                }
            }
        }
        return time;
    }

    @Override
    public String getAlgorithmName() {
        return "A*";
    }

    @Override
    public String getTimeComplexity() {
        return "O(E log V) - typically faster than Dijkstra";
    }

    static class AStarNode {
        Long nodeId;
        int gScore;
        int fScore;

        AStarNode(Long nodeId, int gScore, int fScore) {
            this.nodeId = nodeId;
            this.gScore = gScore;
            this.fScore = fScore;
        }
    }
}