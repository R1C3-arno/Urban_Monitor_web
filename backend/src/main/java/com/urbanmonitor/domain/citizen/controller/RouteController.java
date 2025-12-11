package com.urbanmonitor.domain.citizen.controller;

import com.urbanmonitor.domain.citizen.cache.TrafficGraphStore;
import com.urbanmonitor.domain.citizen.dto.RouteResponse;
import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import com.urbanmonitor.domain.citizen.service.TrafficGraphService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.*;

/**
 * 🎯 FOCUSED RouteController
 *
 * Single purpose: Return route data for frontend map drawing
 *
 * Response includes:
 * - path: [1, 2, 3, ..., 10]
 * - nodeDetails: [{lat, lng}, {lat, lng}, ...]  ← For MapTiler!
 * - explorationSteps: [step0, step1, ...]  ← For animation!
 */
@Slf4j
@RestController
@RequestMapping("/citizen/routes")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class RouteController {

    private final TrafficGraphService trafficGraphService;
    private final TrafficGraphStore graphStore;
    /**
     * 🎯 Main endpoint for frontend
     *
     * GET /citizen/routes/find?start=1&end=10&algorithm=dijkstra
     *
     * Returns:
     * {
     *   "success": true,
     *   "algorithm": "dijkstra",
     *   "path": [1, 2, 3, 10],
     *   "nodeDetails": [
     *     {"nodeId": 1, "lat": 10.77, "lng": 106.69, "nodeName": "Node 1"},
     *     {"nodeId": 2, "lat": 10.771, "lng": 106.691, "nodeName": "Node 2"},
     *     ...
     *   ],
     *   "totalDistance": 550,
     *   "totalTime": 45,
     *   "nodeCount": 4,
     *   "algorithmIterations": 8,
     *   "explorationSteps": [
     *     {"step": 0, "action": "START", "node": {...}, "distance": 0},
     *     {"step": 1, "action": "VISIT", "node": {...}, "distance": 0},
     *     {"step": 2, "action": "RELAX", "node": {...}, "distance": 150},
     *     ...
     *   ]
     * }
     */
    @GetMapping("/find")
    public ResponseEntity<RouteResponse> findRoute(
            @RequestParam Long start,
            @RequestParam Long end,
            @RequestParam(defaultValue = "dijkstra") String algorithm
    ) {
        log.info("📍 GET /citizen/routes/find | start={}, end={}, algorithm={}",
                start, end, algorithm);

        try {
            // 🎯 Call service - returns complete response
            RouteResponse response = trafficGraphService.findShortestPath(start, end, algorithm);

            if (response.isSuccess()) {
                log.info("✅ Route found: {} nodes, {} meters",
                        response.getNodeCount(),
                        response.getTotalDistance());

                // 🎯 Frontend can now:
                // 1. Draw path using nodeDetails (lat/lng)
                // 2. Animate using explorationSteps
                // 3. Show metrics: distance, time, iterations

                return ResponseEntity.ok(response);
            } else {
                log.warn("❌ Route not found: {}", response.getError());
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("❌ Error finding route", e);
            return ResponseEntity.internalServerError()
                    .body(RouteResponse.builder()
                            .error("Server error: " + e.getMessage())
                            .success(false)
                            .algorithm(algorithm)
                            .build());
        }
    }

    /**
     * Get graph stats for debug/display
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        log.info("📊 GET /citizen/routes/stats");
        try {
            Map<String, Object> stats = trafficGraphService.getGraphStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("❌ Error getting stats", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    private double calculateDistance(TrafficNode from, TrafficNode to) {
        double R = 6371; // Earth radius in km
        double dLat = Math.toRadians(to.getLat() - from.getLat());
        double dLon = Math.toRadians(to.getLng() - from.getLng());

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(from.getLat())) *
                        Math.cos(Math.toRadians(to.getLat())) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    /**
     * ✅ NEW: Get farthest node pair
     * GET /citizen/routes/farthest-pair
     */
    @GetMapping("/farthest-pair")
    public ResponseEntity<?> getFarthestNodePair() {
        log.info("📏 API: Getting farthest node pair");

        try {
            List<TrafficNode> allNodes = graphStore.getAllNodes();

            if (allNodes.size() < 2) {
                return ResponseEntity.ok(Map.of(
                        "error", "Not enough nodes"
                ));
            }

            // Find farthest pair
            double maxDistance = 0;
            TrafficNode farthestStart = null;
            TrafficNode farthestEnd = null;

            for (int i = 0; i < allNodes.size(); i++) {
                for (int j = i + 1; j < allNodes.size(); j++) {
                    double dist = calculateDistance(allNodes.get(i), allNodes.get(j));

                    if (dist > maxDistance) {
                        maxDistance = dist;
                        farthestStart = allNodes.get(i);
                        farthestEnd = allNodes.get(j);
                    }
                }
            }

            log.info("📏 Farthest pair: {}km apart", String.format("%.2f", maxDistance));

            return ResponseEntity.ok(Map.of(
                    "startId", farthestStart.getId(),
                    "endId", farthestEnd.getId(),
                    "distance", maxDistance,
                    "start", Map.of(
                            "lat", farthestStart.getLat(),
                            "lng", farthestStart.getLng()
                    ),
                    "end", Map.of(
                            "lat", farthestEnd.getLat(),
                            "lng", farthestEnd.getLng()
                    )
            ));

        } catch (Exception e) {
            log.error("❌ Error finding farthest pair: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }


}