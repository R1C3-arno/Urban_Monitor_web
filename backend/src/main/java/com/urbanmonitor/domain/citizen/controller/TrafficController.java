package com.urbanmonitor.domain.citizen.controller;

import com.urbanmonitor.domain.citizen.algorithm.BlackspotDetector;
import com.urbanmonitor.domain.citizen.algorithm.NearestIncidentFinder;
import com.urbanmonitor.domain.citizen.dto.*;
import com.urbanmonitor.domain.citizen.entity.TrafficEdge;
import com.urbanmonitor.domain.citizen.entity.TrafficIncident;
import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import com.urbanmonitor.domain.citizen.mapper.TrafficMapper;
import com.urbanmonitor.domain.citizen.service.TrafficGraphService;
import com.urbanmonitor.domain.citizen.service.TrafficService;
import com.urbanmonitor.domain.citizen.cache.RouteLRUCache;
import com.urbanmonitor.domain.citizen.observer.StatisticsObserver;
import com.urbanmonitor.domain.citizen.repository.TrafficNodeRepository;
import com.urbanmonitor.domain.citizen.repository.TrafficEdgeRepository;
import com.urbanmonitor.domain.citizen.service.EnhancedDataSeeder;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import lombok.Data;
import lombok.Builder;

/**
 * TRAFFIC CONTROLLER - Complete with Visualization Support
 *
 * Features:
 * - Map data endpoints
 * - Graph edges for visualization
 * - Blackspot detection
 * - Enhanced data seeding (100 nodes)
 */
@RestController
@RequestMapping("/api/traffic")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:8080"})
public class TrafficController {

    // ✅ Dependencies
    private final TrafficService trafficService;
    private final TrafficGraphService trafficGraphService;
    private final TrafficMapper trafficMapper;
    private final TrafficNodeRepository nodeRepository;
    private final TrafficEdgeRepository edgeRepository;  // ✅ ADDED
    private final RouteLRUCache routeCache;
    private final StatisticsObserver statisticsObserver;
    private final EnhancedDataSeeder enhancedDataSeeder;

    // ═══════════════════════════════════════════════════════════
    // 🗺️ MAP DATA ENDPOINTS
    // ═══════════════════════════════════════════════════════════

    /**
     * GET /api/traffic/map
     * Primary endpoint - Returns all validated traffic incidents
     */
    @GetMapping("/map")
    public ResponseEntity<TrafficMapResponse> getTrafficMap() {
        log.info("🗺️ GET /api/traffic/map");

        try {
            List<TrafficIncident> incidents = trafficService.getAllValidatedIncidents();
            TrafficMapResponse response = trafficMapper.toTrafficMapResponse(incidents);

            log.info("✅ Returning {} markers", response.getMarkers().size());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Error fetching traffic map", e);
            return ResponseEntity.ok(TrafficMapResponse.builder()
                    .markers(List.of())
                    .meta(TrafficMapResponse.MetaDTO.builder()
                            .total(0)
                            .timestamp(System.currentTimeMillis())
                            .dataSource("Error: " + e.getMessage())
                            .build())
                    .build());
        }
    }

    /**
     * GET /api/traffic/map/bounds
     * Optimized endpoint - Only returns incidents within map bounds
     */
    @GetMapping("/map/bounds")
    public ResponseEntity<TrafficMapResponse> getIncidentsInBounds(
            @RequestParam Double minLat,
            @RequestParam Double maxLat,
            @RequestParam Double minLng,
            @RequestParam Double maxLng
    ) {
        log.info("🗺️ GET /api/traffic/map/bounds");

        try {
            List<TrafficIncident> incidents = trafficService.getIncidentsInBounds(
                    minLat, maxLat, minLng, maxLng
            );
            TrafficMapResponse response = trafficMapper.toTrafficMapResponse(incidents);

            log.info("✅ Found {} incidents in bounds", incidents.size());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Error fetching bounded incidents", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 📍 GRAPH VISUALIZATION ENDPOINTS
    // ═══════════════════════════════════════════════════════════

    /**
     * ✅ GET /api/traffic/graph-edges
     * Get all edges for gray line visualization
     *
     * Frontend usage:
     * - Draw all edges as thin gray lines
     * - Show network connectivity
     * - Display before route animation
     */
    @GetMapping("/graph-edges")
    public ResponseEntity<List<EdgeDTO>> getGraphEdges() {
        log.info("📊 GET /api/traffic/graph-edges");

        try {
            List<TrafficEdge> edges = edgeRepository.findAll();

            List<EdgeDTO> edgeDTOs = edges.stream()
                    .map(edge -> EdgeDTO.builder()
                            .from(NodeInfo.builder()
                                    .id(edge.getFromNode().getId())
                                    .lat(edge.getFromNode().getLat())
                                    .lng(edge.getFromNode().getLng())
                                    .name(edge.getFromNode().getNodeName())
                                    .build())
                            .to(NodeInfo.builder()
                                    .id(edge.getToNode().getId())
                                    .lat(edge.getToNode().getLat())
                                    .lng(edge.getToNode().getLng())
                                    .name(edge.getToNode().getNodeName())
                                    .build())
                            .distance(edge.getDistance())
                            .travelTime(edge.getTravelTime())
                            .roadName(edge.getRoadName())
                            .build())
                    .collect(Collectors.toList());

            log.info("✅ Returning {} edges", edgeDTOs.size());
            return ResponseEntity.ok(edgeDTOs);

        } catch (Exception e) {
            log.error("❌ Error fetching graph edges", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * ✅ GET /api/traffic/graph-nodes
     * Get all nodes for visualization
     *
     * Frontend usage:
     * - Draw all nodes as small gray circles
     * - Show complete graph structure
     */
    @GetMapping("/graph-nodes")
    public ResponseEntity<List<NodeDTO>> getGraphNodes() {
        log.info("📊 GET /api/traffic/graph-nodes");

        try {
            List<TrafficNode> nodes = nodeRepository.findAll();

            List<NodeDTO> nodeDTOs = nodes.stream()
                    .map(node -> NodeDTO.builder()
                            .id(node.getId())
                            .name(node.getNodeName())
                            .location(node.getLocationName())
                            .lat(node.getLat())
                            .lng(node.getLng())
                            .congestionLevel(node.getCongestionLevel())
                            .isBlocked(node.getIsBlocked())
                            .build())
                    .collect(Collectors.toList());

            log.info("✅ Returning {} nodes", nodeDTOs.size());
            return ResponseEntity.ok(nodeDTOs);

        } catch (Exception e) {
            log.error("❌ Error fetching graph nodes", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 🎲 DATA SEEDING ENDPOINTS
    // ═══════════════════════════════════════════════════════════

    /**
     * ✅ IMPROVED: Seed enhanced graph with configurable size
     * POST /api/traffic/seed-enhanced-graph?nodes=300
     */
    @PostMapping("/seed-enhanced-graph")
    public ResponseEntity<?> seedEnhancedGraph(
            @RequestParam(defaultValue = "500") int nodes
    ) {
        log.info("🕸️ POST /api/traffic/seed-enhanced-graph (nodes: {})", nodes);

        // ✅ Validate node count
        if (nodes < 10) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Node count must be at least 10",
                    "requested", nodes
            ));
        }

        if (nodes > 10000) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Node count too large (max 500)",
                    "requested", nodes,
                    "suggestion", "Use 300 for good performance"
            ));
        }

        try {
            EnhancedDataSeeder.SeedResult result = enhancedDataSeeder.seedEnhancedGraph(nodes);

            double avgDegree = (double) result.getEdgeCount() / result.getNodeCount();

            log.info("✅ Seeded {} nodes, {} edges (avg degree: {})",
                    result.getNodeCount(), result.getEdgeCount(),
                    String.format("%.2f", avgDegree));

            // ✅ Verify connectivity
            if (avgDegree < 2.0) {
                log.warn("⚠️ Low connectivity! Average degree: {}", avgDegree);
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "nodes", result.getNodeCount(),
                    "edges", result.getEdgeCount(),
                    "averageDegree", String.format("%.2f", avgDegree),
                    "message", result.getMessage()
            ));

        } catch (Exception e) {
            log.error("❌ Error seeding enhanced graph", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", e.getMessage(),
                            "type", e.getClass().getSimpleName()
                    ));
        }
    }

    /**
     * ✅ NEW: Quick seed presets
     * POST /api/traffic/seed-preset?size=small|medium|large
     */
    @PostMapping("/seed-preset")
    public ResponseEntity<?> seedPreset(
            @RequestParam(defaultValue = "small") String size
    ) {
        int nodeCount = switch (size.toLowerCase()) {
            case "small" -> 50;
            case "medium" -> 100;
            case "large" -> 300;
            case "xlarge" -> 500;
            default -> 100;
        };

        log.info("🎛️ Seeding {} graph ({} nodes)", size, nodeCount);

        return seedEnhancedGraph(nodeCount);
    }

    /**
     * ✅ DELETE /api/traffic/clear-all
     * Clear all graph data (for re-seeding)
     */
    @DeleteMapping("/clear-all")
    public ResponseEntity<?> clearAllData() {
        log.info("🗑️ DELETE /api/traffic/clear-all");

        try {
            edgeRepository.deleteAll();
            nodeRepository.deleteAll();

            log.info("✅ Cleared all graph data");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "All graph data cleared"
            ));

        } catch (Exception e) {
            log.error("❌ Error clearing data", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 🔍 BLACKSPOT DETECTION
    // ═══════════════════════════════════════════════════════════

    /**
     * GET /api/traffic/blackspots
     * Detect accident blackspots using spatial hashing
     */
    @GetMapping("/blackspots")
    public ResponseEntity<?> getBlackspots(
            @RequestParam(defaultValue = "0.005") Double radius,
            @RequestParam(defaultValue = "3") @Min(2) @Max(10) Integer threshold
    ) {
        log.info("🔴 GET /api/traffic/blackspots (radius={}, threshold={})", radius, threshold);

        try {
            List<TrafficIncident> allIncidents = trafficService.getAllValidatedIncidents();

            BlackspotDetector detector = new BlackspotDetector();
            var blackspots = detector.detectBlackspots(allIncidents, radius, threshold);

            log.info("✅ Found {} blackspots", blackspots.size());

            return ResponseEntity.ok(Map.of(
                    "blackspots", blackspots,
                    "total", blackspots.size(),
                    "parameters", Map.of(
                            "radius", radius,
                            "threshold", threshold
                    )
            ));

        } catch (Exception e) {
            log.error("❌ Error detecting blackspots", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/traffic/nearest
     * Find nearest incidents using K-D tree
     * Returns incidents with distance information
     */
    @GetMapping("/nearest")
    public ResponseEntity<?> getNearestIncidents(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "5") @Min(1) @Max(20) Integer k
    ) {
        log.info("📍 GET /api/traffic/nearest (lat={}, lng={}, k={})", lat, lng, k);

        try {
            List<TrafficIncident> allIncidents = trafficService.getAllValidatedIncidents();

            NearestIncidentFinder finder = new NearestIncidentFinder();
            var nearestIncidents = finder.findKNearest(allIncidents, lat, lng, k);

            // ✅ FIX: nearestIncidents is List<IncidentDistance>
            // Map to DTO with distance info
            List<NearestIncidentDTO> results = nearestIncidents.stream()
                    .map(incidentDistance -> NearestIncidentDTO.builder()
                            .incident(trafficMapper.toIncidentDTO(incidentDistance.getIncident()))
                            .distance(incidentDistance.getDistance())
                            .build())
                    .collect(Collectors.toList());

            log.info("✅ Found {} nearest incidents", results.size());

            return ResponseEntity.ok(Map.of(
                    "results", results,
                    "query", Map.of(
                            "lat", lat,
                            "lng", lng,
                            "k", k
                    )
            ));

        } catch (Exception e) {
            log.error("❌ Error finding nearest incidents", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 📈 STATISTICS & MONITORING
    // ═══════════════════════════════════════════════════════════

    /**
     * GET /api/traffic/stats
     * Comprehensive system statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        log.info("📊 GET /api/traffic/stats");

        try {
            var incidentStats = trafficService.getStatistics();
            var graphStats = trafficGraphService.getGraphStats();
            var cacheStats = routeCache.getStats();

            int createdToday = statisticsObserver.getCreatedCount();
            int resolvedToday = statisticsObserver.getResolvedCount();

            Map<String, Object> response = new HashMap<>();
            response.put("incidents", incidentStats);
            response.put("graph", graphStats);
            response.put("cache", cacheStats);
            response.put("observerStats", Map.of(
                    "createdToday", createdToday,
                    "resolvedToday", resolvedToday
            ));
            response.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Error fetching statistics", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/traffic/health
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        log.debug("🏥 GET /api/traffic/health");

        try {
            var graphStats = trafficGraphService.getGraphStats();
            boolean graphHealthy = (boolean) graphStats.get("graphInitialized");

            long incidentCount = trafficService.getStatistics().getTotalIncidents();

            Map<String, Object> health = new HashMap<>();
            health.put("status", graphHealthy ? "UP" : "DOWN");
            health.put("graphInitialized", graphHealthy);
            health.put("incidentCount", incidentCount);
            health.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(health);

        } catch (Exception e) {
            log.error("❌ Health check failed", e);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of(
                            "status", "DOWN",
                            "error", e.getMessage()
                    ));
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 📦 DTO CLASSES
    // ═══════════════════════════════════════════════════════════

    /**
     * Edge DTO for visualization
     */
    @Data
    @Builder
    public static class EdgeDTO {
        private NodeInfo from;
        private NodeInfo to;
        private Integer distance;
        private Integer travelTime;
        private String roadName;
    }

    /**
     * Node info for edge endpoints
     */
    @Data
    @Builder
    public static class NodeInfo {
        private Long id;
        private String name;
        private Double lat;
        private Double lng;
    }

    /**
     * Node DTO for graph visualization
     */
    @Data
    @Builder
    public static class NodeDTO {
        private Long id;
        private String name;
        private String location;
        private Double lat;
        private Double lng;
        private Integer congestionLevel;
        private Boolean isBlocked;
    }

    /**
     * ✅ DTO for nearest incidents with distance
     */
    @Data
    @Builder
    public static class NearestIncidentDTO {
        private IncidentDTO incident;
        private Double distance; // km
    }

    /**
     * ✅ Alias endpoint for frontend compatibility
     */
    @PostMapping("/seed")
    public ResponseEntity<?> seedData(
            @RequestParam(defaultValue = "700") int nodes
    ) {
        log.info("🌱 POST /api/traffic/seed (nodes: {})", nodes);
        return seedEnhancedGraph(nodes);
    }
}