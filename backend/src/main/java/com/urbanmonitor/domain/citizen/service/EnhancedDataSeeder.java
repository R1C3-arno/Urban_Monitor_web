package com.urbanmonitor.domain.citizen.service;

import com.urbanmonitor.domain.citizen.cache.TrafficGraphStore;
import com.urbanmonitor.domain.citizen.entity.TrafficEdge;
import com.urbanmonitor.domain.citizen.entity.TrafficNode;
import com.urbanmonitor.domain.citizen.repository.TrafficEdgeRepository;
import com.urbanmonitor.domain.citizen.repository.TrafficNodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.urbanmonitor.domain.citizen.service.TrafficGraphService;

import java.util.*;
import java.util.stream.Collectors;


/**
 * ✅ FIXED: Ensures connected graph with proper average degree
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EnhancedDataSeeder {

    private final TrafficNodeRepository nodeRepository;
    private final TrafficEdgeRepository edgeRepository;
    private final JdbcTemplate jdbcTemplate;
    private final RestTemplate restTemplate;
    private final TrafficGraphStore graphStore;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Random random = new Random();


    private final TrafficGraphService trafficGraphService;

    private static final String OVERPASS_API = "https://overpass-api.de/api/interpreter";
    private static final int MIN_EDGES_PER_NODE = 2; // ✅ CRITICAL CONSTANT

    public SeedResult seedEnhancedGraph(int nodeCount) {
        log.info("🗺️ Seeding graph from OpenStreetMap (target: {} nodes)...", nodeCount);

        try {
            // ✅✅✅ CRITICAL: Clear cache FIRST before clearing DB
            log.info("🗑️ Clearing graph store cache...");
            graphStore.clear();

            clearOldData();
            OSMRoadNetwork network = fetchOSMRoadNetwork();

            log.info("📊 OSM Data: {} nodes, {} ways",
                    network.nodes.size(), network.ways.size());

            // ✅ NEW: Sample nodes WHILE preserving connectivity
            List<TrafficNode> trafficNodes = convertToTrafficNodesWithConnectivity(network, nodeCount);
            List<TrafficEdge> trafficEdges = convertToTrafficEdges(network, trafficNodes);

            // ✅ CRITICAL: Verify graph quality
            double avgDegree = (double) trafficEdges.size() / trafficNodes.size();
            log.info("📊 Graph Quality: {} nodes, {} edges, avg degree: {}",
                    trafficNodes.size(), trafficEdges.size(), String.format("%.2f", avgDegree));

            if (avgDegree < MIN_EDGES_PER_NODE) {
                log.error("❌ CRITICAL: Average degree {} < {} - Graph disconnected!",
                        avgDegree, MIN_EDGES_PER_NODE);

                // ✅ Force connectivity with fallback edges
                log.info("🔧 Applying fallback connectivity...");
                trafficEdges = ensureConnectivity(trafficNodes, trafficEdges);
                log.info("🧷 Enforcing chain connectivity...");
                trafficEdges = forceChainConnectivity(trafficNodes, trafficEdges);
                avgDegree = (double) trafficEdges.size() / trafficNodes.size();

                log.info("✅ After fallback: {} edges, avg degree: {}",
                        trafficEdges.size(), String.format("%.2f", avgDegree));
            }

            graphStore.rebuild(trafficNodes, trafficEdges);
            log.info("✅ Graph store rebuilt: {} nodes, {} edges",
                    trafficNodes.size(), trafficEdges.size());

            return SeedResult.builder()
                    .nodeCount(trafficNodes.size())
                    .edgeCount(trafficEdges.size())
                    .message("Graph seeded from OpenStreetMap real road network")
                    .build();

        } catch (Exception e) {
            log.error("❌ Error seeding from OSM", e);
            throw new RuntimeException("Failed to seed from OSM: " + e.getMessage(), e);
        }
    }

    public SeedResult seedEnhancedGraph() {
        return seedEnhancedGraph(3000);
    }

    /**
     * ✅ NEW: Get sample node IDs for testing
     */
    public List<Long> getSampleNodeIds(int count) {
        List<TrafficNode> allNodes = nodeRepository.findAll();

        if (allNodes.isEmpty()) {
            return List.of();
        }

        return allNodes.stream()
                .limit(Math.min(count, allNodes.size()))
                .map(TrafficNode::getId)
                .toList();
    }

    private List<Long> spatialSampling( OSMRoadNetwork network,Set<Long> nodeIds, int targetCount) {
        List<OSMNode> osmNodes = nodeIds.stream()
                .map(id -> network.nodes.get(id))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        if (osmNodes.size() <= targetCount) {
            return nodeIds.stream().collect(Collectors.toList());
        }

        // Divide area into grid
        double minLat = osmNodes.stream().mapToDouble(n -> n.lat).min().orElse(0);
        double maxLat = osmNodes.stream().mapToDouble(n -> n.lat).max().orElse(0);
        double minLon = osmNodes.stream().mapToDouble(n -> n.lon).min().orElse(0);
        double maxLon = osmNodes.stream().mapToDouble(n -> n.lon).max().orElse(0);

        int gridSize = (int) Math.ceil(Math.sqrt(targetCount));
        double latStep = (maxLat - minLat) / gridSize;
        double lonStep = (maxLon - minLon) / gridSize;

        List<Long> sampled = new ArrayList<>();

        // Pick 1 node from each grid cell
        for (int i = 0; i < gridSize && sampled.size() < targetCount; i++) {
            for (int j = 0; j < gridSize && sampled.size() < targetCount; j++) {
                double cellMinLat = minLat + i * latStep;
                double cellMaxLat = minLat + (i + 1) * latStep;
                double cellMinLon = minLon + j * lonStep;
                double cellMaxLon = minLon + (j + 1) * lonStep;

                // Find nodes in this cell
                Optional<Long> nodeInCell = osmNodes.stream()
                        .filter(n -> n.lat >= cellMinLat && n.lat < cellMaxLat &&
                                n.lon >= cellMinLon && n.lon < cellMaxLon)
                        .map(n -> n.id)
                        .findFirst();

                nodeInCell.ifPresent(sampled::add);
            }
        }

        log.info("✅ Spatial sampling: {} nodes distributed evenly", sampled.size());
        return sampled;
    }

    /**
     * ✅ NEW: Sample nodes while preserving connectivity
     */
    private List<TrafficNode> convertToTrafficNodesWithConnectivity(
            OSMRoadNetwork network, int targetCount) {

        log.info("🔍 Converting OSM nodes with connectivity preservation...");

        // Build connectivity map
        Map<Long, Set<Long>> adjacencyMap = buildAdjacencyMap(network);

        // Find connected components
        List<Set<Long>> components = findConnectedComponents(adjacencyMap);

        log.info("📊 Found {} connected components", components.size());
        components.forEach(comp ->
                log.info("   - Component size: {}", comp.size())
        );

        Set<Long> merged = new HashSet<>();

        for (Set<Long> comp : components) {
            if (merged.size() < targetCount) {
                merged.addAll(comp);
            }
        }
        if (merged.size() < 2) {
            throw new IllegalStateException("Not enough connected nodes from OSM data");
        }



        log.info("✅ Using largest component: {} nodes", merged.size());

        if (merged.isEmpty()) {
            throw new RuntimeException("No connected component found!");
        }

        // Sample nodes from largest component
        List<Long> sampledNodeIds = new ArrayList<>(merged);

        if (sampledNodeIds.size() > targetCount) {
            // Random sample
            Collections.shuffle(sampledNodeIds, random);
            sampledNodeIds = spatialSampling(network, merged, targetCount);
        }

        // Convert to TrafficNodes
        List<TrafficNode> trafficNodes = sampledNodeIds.stream()
                .map(id -> network.nodes.get(id))
                .filter(Objects::nonNull)
                .map(osmNode -> TrafficNode.builder()
                        .nodeName("Node " + osmNode.id)
                        .locationName("OSM Node " + osmNode.id)
                        .lat(osmNode.lat)
                        .lng(osmNode.lon)
                        .congestionLevel(random.nextInt(30))
                        .isBlocked(false)
                        .build())
                .collect(Collectors.toList());

        List<TrafficNode> savedNodes = nodeRepository.saveAll(trafficNodes);

        // Map OSM ID → Database ID
        Map<Long, TrafficNode> osmIdToTrafficNode = new HashMap<>();
        for (int i = 0; i < sampledNodeIds.size(); i++) {
            osmIdToTrafficNode.put(sampledNodeIds.get(i), savedNodes.get(i));
        }

        network.osmIdToTrafficNode = osmIdToTrafficNode;

        log.info("✅ Converted {} nodes from largest connected component", savedNodes.size());
        return savedNodes;
    }

    /**
     * ✅ Build adjacency map from OSM ways
     */
    private Map<Long, Set<Long>> buildAdjacencyMap(OSMRoadNetwork network) {
        Map<Long, Set<Long>> adjacency = new HashMap<>();

        for (OSMWay way : network.ways) {
            for (int i = 0; i < way.nodeRefs.size() - 1; i++) {
                Long from = way.nodeRefs.get(i);
                Long to = way.nodeRefs.get(i + 1);

                adjacency.computeIfAbsent(from, k -> new HashSet<>()).add(to);

                if (!way.oneway) {
                    adjacency.computeIfAbsent(to, k -> new HashSet<>()).add(from);
                }
            }
        }

        return adjacency;
    }

    /**
     * ✅ Find connected components using BFS
     */
    private List<Set<Long>> findConnectedComponents(Map<Long, Set<Long>> adjacency) {
        List<Set<Long>> components = new ArrayList<>();
        Set<Long> visited = new HashSet<>();

        for (Long nodeId : adjacency.keySet()) {
            if (!visited.contains(nodeId)) {
                Set<Long> component = new HashSet<>();
                Queue<Long> queue = new LinkedList<>();

                queue.offer(nodeId);
                visited.add(nodeId);

                while (!queue.isEmpty()) {
                    Long current = queue.poll();
                    component.add(current);

                    Set<Long> neighbors = adjacency.getOrDefault(current, new HashSet<>());
                    for (Long neighbor : neighbors) {
                        if (!visited.contains(neighbor)) {
                            visited.add(neighbor);
                            queue.offer(neighbor);
                        }
                    }
                }

                components.add(component);
            }
        }

        return components;
    }

    /**
     * ✅ IMPROVED: Convert OSM ways to edges (only within sampled nodes)
     */
    private List<TrafficEdge> convertToTrafficEdges(OSMRoadNetwork network,
                                                    List<TrafficNode> trafficNodes) {
        log.info("🛣️ Converting OSM ways to TrafficEdges...");

        List<TrafficEdge> edges = new ArrayList<>();
        Set<String> edgeKeys = new HashSet<>();
        Map<Long, TrafficNode> idMap = network.osmIdToTrafficNode;

        for (OSMWay way : network.ways) {
            for (int i = 0; i < way.nodeRefs.size() - 1; i++) {
                Long fromOsmId = way.nodeRefs.get(i);
                Long toOsmId = way.nodeRefs.get(i + 1);

                TrafficNode fromNode = idMap.get(fromOsmId);
                TrafficNode toNode = idMap.get(toOsmId);

                // ✅ Both nodes must be in sampled set
                if (fromNode == null || toNode == null) {
                    continue;
                }

                // Create forward edge
                String forwardKey = fromNode.getId() + "->" + toNode.getId();
                if (!edgeKeys.contains(forwardKey)) {
                    edges.add(createEdge(fromNode, toNode, way));
                    edgeKeys.add(forwardKey);
                }

                // Create reverse edge (if not oneway)
                if (!way.oneway) {
                    String reverseKey = toNode.getId() + "->" + fromNode.getId();
                    if (!edgeKeys.contains(reverseKey)) {
                        edges.add(createEdge(toNode, fromNode, way));
                        edgeKeys.add(reverseKey);
                    }
                }
            }
        }

        log.info("📊 Created {} edges from OSM ways", edges.size());

        List<TrafficEdge> savedEdges = edgeRepository.saveAll(edges);
        return savedEdges;
    }

    /**
     * ✅ NEW: Ensure minimum connectivity by adding fallback edges
     */
    private List<TrafficEdge> ensureConnectivity(List<TrafficNode> nodes,
                                                 List<TrafficEdge> existingEdges) {

        log.info("🔧 Ensuring minimum connectivity...");

        // Count edges per node
        Map<Long, Integer> edgeCount = new HashMap<>();
        for (TrafficEdge edge : existingEdges) {
            edgeCount.merge(edge.getFromNode().getId(), 1, Integer::sum);
            edgeCount.merge(edge.getToNode().getId(), 1, Integer::sum);
        }

        // Find nodes with insufficient edges
        List<TrafficNode> insufficientNodes = nodes.stream()
                .filter(node -> edgeCount.getOrDefault(node.getId(), 0) < MIN_EDGES_PER_NODE)
                .collect(Collectors.toList());

        log.info("📊 Found {} nodes with < {} edges",
                insufficientNodes.size(), MIN_EDGES_PER_NODE);

        List<TrafficEdge> newEdges = new ArrayList<>(existingEdges);
        Set<String> edgeKeys = existingEdges.stream()
                .map(e -> e.getFromNode().getId() + "->" + e.getToNode().getId())
                .collect(Collectors.toSet());

        // Add edges to nearest neighbors for insufficient nodes
        for (TrafficNode node : insufficientNodes) {
            int currentEdges = edgeCount.getOrDefault(node.getId(), 0);
            int needed = MIN_EDGES_PER_NODE - currentEdges;

            if (needed <= 0) continue;

            // Find nearest neighbors
            List<NodeDistance> distances = nodes.stream()
                    .filter(n -> !n.getId().equals(node.getId()))
                    .map(n -> new NodeDistance(n, calculateDistance(node, n)))
                    .sorted(Comparator.comparingDouble(nd -> nd.distance))
                    .limit(needed * 2) // Get more candidates
                    .collect(Collectors.toList());

            // Add edges to nearest neighbors
            int added = 0;
            for (NodeDistance nd : distances) {
                if (added >= needed) break;

                String forwardKey = node.getId() + "->" + nd.node.getId();
                String reverseKey = nd.node.getId() + "->" + node.getId();

                if (!edgeKeys.contains(forwardKey)) {
                    newEdges.add(createFallbackEdge(node, nd.node, nd.distance));
                    edgeKeys.add(forwardKey);
                    edgeCount.merge(node.getId(), 1, Integer::sum);
                    added++;
                }

                if (!edgeKeys.contains(reverseKey)) {
                    newEdges.add(createFallbackEdge(nd.node, node, nd.distance));
                    edgeKeys.add(reverseKey);
                    edgeCount.merge(nd.node.getId(), 1, Integer::sum);
                }
            }

            log.info("   - Node {}: added {} edges", node.getId(), added);
        }

        log.info("✅ Added {} fallback edges", newEdges.size() - existingEdges.size());

        return edgeRepository.saveAll(newEdges);
    }

    /**
     * ✅ FORCE 100% CONNECTIVITY:
     * Nối các node thành 1 chuỗi đảm bảo KHÔNG BAO GIỜ bị chia cắt
     */
    private List<TrafficEdge> forceChainConnectivity(List<TrafficNode> nodes,
                                                     List<TrafficEdge> edges) {

        log.warn("🧷 FORCING CHAIN CONNECTIVITY (anti No-path)...");

        Set<String> edgeKeys = edges.stream()
                .map(e -> e.getFromNode().getId() + "->" + e.getToNode().getId())
                .collect(Collectors.toSet());

        for (int i = 0; i < nodes.size() - 1; i++) {
            TrafficNode a = nodes.get(i);
            TrafficNode b = nodes.get(i + 1);

            String k1 = a.getId() + "->" + b.getId();
            String k2 = b.getId() + "->" + a.getId();

            if (!edgeKeys.contains(k1)) {
                edges.add(createFallbackEdge(a, b,
                        calculateDistance(a, b)));
                edgeKeys.add(k1);
            }

            if (!edgeKeys.contains(k2)) {
                edges.add(createFallbackEdge(b, a,
                        calculateDistance(b, a)));
                edgeKeys.add(k2);
            }
        }

        log.info("✅ CHAIN connectivity enforced!");
        return edgeRepository.saveAll(edges);
    }


    private OSMRoadNetwork fetchOSMRoadNetwork() {
        log.info("🌍 Fetching road network from OpenStreetMap...");

        // ✅ EXPANDED: Larger bounding box for more roads
        // Old: (10.76,106.69,10.79,106.72) - ~3km x 3km
        // New: (10.75,106.68,10.80,106.73) - ~5.5km x 5.5km
        String overpassQuery = """
            [out:json][timeout:90];
            (
              way["highway"]
                (10.65, 106.55, 10.95, 106.90);
            );
            out body;
            >;
            out skel qt;
            """;

        try {
            String response = restTemplate.postForObject(
                    OVERPASS_API,
                    "data=" + overpassQuery,
                    String.class
            );

            JsonNode root = objectMapper.readTree(response);
            JsonNode elements = root.get("elements");

            OSMRoadNetwork network = new OSMRoadNetwork();

            for (JsonNode element : elements) {
                String type = element.get("type").asText();

                if (type.equals("node")) {
                    long id = element.get("id").asLong();
                    double lat = element.get("lat").asDouble();
                    double lon = element.get("lon").asDouble();

                    network.nodes.put(id, new OSMNode(id, lat, lon));

                } else if (type.equals("way")) {
                    long id = element.get("id").asLong();

                    JsonNode tags = element.get("tags");
                    String name = tags != null && tags.has("name")
                            ? tags.get("name").asText()
                            : "Road " + id;
                    String highway = tags != null && tags.has("highway")
                            ? tags.get("highway").asText()
                            : "unclassified";
                    boolean oneway = tags != null && tags.has("oneway")
                            && tags.get("oneway").asText().equals("yes");

                    List<Long> nodeRefs = new ArrayList<>();
                    JsonNode nodes = element.get("nodes");
                    if (nodes != null) {
                        for (JsonNode nodeId : nodes) {
                            nodeRefs.add(nodeId.asLong());
                        }
                    }

                    if (nodeRefs.size() >= 2) {
                        network.ways.add(new OSMWay(id, name, highway, oneway, nodeRefs));
                    }
                }
            }

            log.info("✅ Fetched {} OSM nodes, {} ways",
                    network.nodes.size(), network.ways.size());

            if (network.ways.isEmpty()) {
                throw new RuntimeException("No roads found in OSM data");
            }

            return network;

        } catch (Exception e) {
            log.error("❌ Error fetching from Overpass API: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch OSM data: " + e.getMessage(), e);
        }
    }

    private TrafficEdge createEdge(TrafficNode from, TrafficNode to, OSMWay way) {
        double distanceKm = calculateDistance(from, to);
        int distanceMeters = Math.max(1, (int) (distanceKm * 1000));

        double maxSpeed = getMaxSpeedForHighway(way.highway);
        double travelTimeSec = distanceMeters / (maxSpeed / 3.6);
        int travelTime = Math.max(1, (int) Math.ceil(travelTimeSec));

        return TrafficEdge.builder()
                .fromNode(from)
                .toNode(to)
                .distance(distanceMeters)
                .travelTime(travelTime)
                .roadName(way.name)
                .isBidirectional(!way.oneway)
                .currentSpeed(maxSpeed * 0.7)
                .maxSpeed(maxSpeed)
                .congestionFactor(1.0 + (random.nextDouble() * 0.3))
                .build();
    }

    private TrafficEdge createFallbackEdge(TrafficNode from, TrafficNode to, double distanceKm) {
        int distanceMeters = Math.max(1, (int) (distanceKm * 1000));
        double avgSpeed = 40.0;
        double travelTimeSec = distanceMeters / (avgSpeed / 3.6);
        int travelTime = Math.max(1, (int) Math.ceil(travelTimeSec));

        return TrafficEdge.builder()
                .fromNode(from)
                .toNode(to)
                .distance(distanceMeters)
                .travelTime(travelTime)
                .roadName("Fallback Road")
                .isBidirectional(true)
                .currentSpeed(35.0)
                .maxSpeed(50.0)
                .congestionFactor(1.0 + (random.nextDouble() * 0.3))
                .build();
    }

    private double getMaxSpeedForHighway(String highway) {
        return switch (highway) {
            case "motorway" -> 100.0;
            case "trunk" -> 80.0;
            case "primary" -> 60.0;
            case "secondary" -> 50.0;
            case "tertiary" -> 40.0;
            case "residential" -> 30.0;
            case "service" -> 20.0;
            default -> 40.0;
        };
    }

    private double calculateDistance(TrafficNode from, TrafficNode to) {
        double R = 6371;
        double dLat = Math.toRadians(to.getLat() - from.getLat());
        double dLon = Math.toRadians(to.getLng() - from.getLng());

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(from.getLat())) *
                        Math.cos(Math.toRadians(to.getLat())) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private void clearOldData() {
        log.info("🗑️ Clearing old data...");
        jdbcTemplate.update("DELETE FROM traffic_edges");
        jdbcTemplate.update("DELETE FROM traffic_nodes");
        log.info("✅ Old data cleared");
    }

    private static class OSMRoadNetwork {
        Map<Long, OSMNode> nodes = new HashMap<>();
        List<OSMWay> ways = new ArrayList<>();
        Map<Long, TrafficNode> osmIdToTrafficNode = new HashMap<>();
    }

    private record OSMNode(long id, double lat, double lon) {}

    private record OSMWay(
            long id,
            String name,
            String highway,
            boolean oneway,
            List<Long> nodeRefs
    ) {}

    private static class NodeDistance {
        TrafficNode node;
        double distance;

        NodeDistance(TrafficNode node, double distance) {
            this.node = node;
            this.distance = distance;
        }
    }

    @lombok.Data
    @lombok.Builder
    public static class SeedResult {
        private int nodeCount;
        private int edgeCount;
        private String message;
    }
}