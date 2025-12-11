package com.urbanmonitor.domain.citizen.spatial;

import com.urbanmonitor.domain.citizen.entity.TrafficIncident;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                         KD-TREE IMPLEMENTATION                       ║
 * ║              Advanced Spatial Data Structure for O(log n)           ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * 🧠 DATA STRUCTURE: K-Dimensional Tree (K=2 for 2D coordinates)
 * ═══════════════════════════════════════════════════════════════════════
 *
 * PURPOSE:
 * - Efficient spatial queries (nearest neighbor, range search)
 * - Better than linear scan O(n) for large datasets
 * - Ideal for location-based services
 *
 * TIME COMPLEXITY:
 * ════════════════
 * - Build tree: O(n log n)
 * - Nearest neighbor: O(log n) average, O(n) worst case
 * - Range query: O(n^(1-1/k) + m) where m = results
 * - Insert: O(log n) average
 *
 * SPACE COMPLEXITY: O(n)
 *
 * REAL-WORLD APPLICATIONS:
 * ═══════════════════════
 * - Find nearest traffic incident to user location
 * - Get all incidents within radius
 * - Optimize incident clustering
 * - Spatial indexing for map rendering
 *
 * ALGORITHM EXPLANATION:
 * ═════════════════════
 * 1. Recursively partition space by alternating x/y coordinates
 * 2. Each level splits on different dimension (x → y → x → y...)
 * 3. Creates balanced binary search tree
 * 4. Efficient pruning during search
 *
 * DESIGN PATTERNS:
 * ═══════════════
 * - Composite Pattern: Tree structure
 * - Strategy Pattern: Different distance metrics
 * - Builder Pattern: Tree construction
 *
 * @author Urban Monitor Team
 */
@Slf4j
public class KDTree {

    private KDNode root;
    private int size;

    /**
     * Build KD-Tree from list of incidents
     *
     * TIME: O(n log n) - sorting + recursive build
     * SPACE: O(n)
     */
    public void build(List<TrafficIncident> incidents) {
        log.info("🌳 Building KD-Tree from {} incidents", incidents.size());

        long startTime = System.currentTimeMillis();

        List<Point2D> points = new ArrayList<>();
        for (TrafficIncident incident : incidents) {
            points.add(new Point2D(incident.getLat(), incident.getLng(), incident));
        }

        this.root = buildTree(points, 0);
        this.size = points.size();

        long duration = System.currentTimeMillis() - startTime;
        log.info("✅ KD-Tree built in {}ms: {} nodes", duration, size);
    }

    /**
     * Recursive tree construction
     *
     * ALGORITHM:
     * 1. Choose splitting dimension (alternate x/y)
     * 2. Sort points by that dimension
     * 3. Take median as split point
     * 4. Recursively build left and right subtrees
     */
    private KDNode buildTree(List<Point2D> points, int depth) {
        if (points.isEmpty()) return null;

        // Choose axis: 0 = x (lat), 1 = y (lng)
        int axis = depth % 2;

        // Sort by current axis
        points.sort((a, b) -> {
            double valA = axis == 0 ? a.getLat() : a.getLng();
            double valB = axis == 0 ? b.getLat() : b.getLng();
            return Double.compare(valA, valB);
        });

        // Choose median
        int medianIndex = points.size() / 2;
        Point2D median = points.get(medianIndex);

        // Create node
        KDNode node = new KDNode(median, axis);

        // Recursively build subtrees
        node.left = buildTree(points.subList(0, medianIndex), depth + 1);
        node.right = buildTree(points.subList(medianIndex + 1, points.size()), depth + 1);

        return node;
    }

    /**
     * Find K nearest neighbors
     *
     * TIME: O(log n) average, O(n) worst case
     *
     * ALGORITHM:
     * 1. Use priority queue (max heap) to maintain K nearest
     * 2. Recursively traverse tree
     * 3. Prune branches that can't contain closer points
     * 4. Result: K closest points
     */
    public List<TrafficIncident> findKNearest(double lat, double lng, int k) {
        log.debug("🔍 Finding {} nearest to ({}, {})", k, lat, lng);

        Point2D target = new Point2D(lat, lng, null);
        PriorityQueue<PointDistance> maxHeap = new PriorityQueue<>(
                (a, b) -> Double.compare(b.distance, a.distance) // Max heap
        );

        findKNearestRecursive(root, target, k, maxHeap);

        // Extract results
        List<TrafficIncident> results = new ArrayList<>();
        while (!maxHeap.isEmpty()) {
            results.add(0, maxHeap.poll().point.getIncident()); // Reverse order
        }

        log.debug("✅ Found {} nearest incidents", results.size());
        return results;
    }

    /**
     * Recursive K-NN search with pruning
     */
    private void findKNearestRecursive(
            KDNode node,
            Point2D target,
            int k,
            PriorityQueue<PointDistance> maxHeap
    ) {
        if (node == null) return;

        // Calculate distance to current point
        double dist = distance(node.point, target);

        // Add to heap if:
        // 1. Heap not full (size < k)
        // 2. OR current point is closer than farthest in heap
        if (maxHeap.size() < k) {
            maxHeap.offer(new PointDistance(node.point, dist));
        } else if (dist < maxHeap.peek().distance) {
            maxHeap.poll();
            maxHeap.offer(new PointDistance(node.point, dist));
        }

        // Determine which subtree to search first
        int axis = node.axis;
        double targetVal = axis == 0 ? target.getLat() : target.getLng();
        double nodeVal = axis == 0 ? node.point.getLat() : node.point.getLng();

        KDNode nearSubtree = targetVal < nodeVal ? node.left : node.right;
        KDNode farSubtree = targetVal < nodeVal ? node.right : node.left;

        // Search near subtree first
        findKNearestRecursive(nearSubtree, target, k, maxHeap);

        // PRUNING: Only search far subtree if it might contain closer points
        // Check if circle around target intersects splitting plane
        double axisDistance = Math.abs(targetVal - nodeVal);
        if (maxHeap.size() < k || axisDistance < maxHeap.peek().distance) {
            findKNearestRecursive(farSubtree, target, k, maxHeap);
        }
    }

    /**
     * Range query: Find all points within radius
     *
     * TIME: O(√n + m) where m = results
     *
     * @param lat Center latitude
     * @param lng Center longitude
     * @param radiusKm Radius in kilometers
     * @return List of incidents within radius
     */
    public List<TrafficIncident> rangeQuery(double lat, double lng, double radiusKm) {
        log.debug("📍 Range query: ({}, {}) radius {}km", lat, lng, radiusKm);

        Point2D target = new Point2D(lat, lng, null);
        List<TrafficIncident> results = new ArrayList<>();

        rangeQueryRecursive(root, target, radiusKm, results);

        log.debug("✅ Found {} incidents in range", results.size());
        return results;
    }

    /**
     * Recursive range query with pruning
     */
    private void rangeQueryRecursive(
            KDNode node,
            Point2D target,
            double radiusKm,
            List<TrafficIncident> results
    ) {
        if (node == null) return;

        // Check if current point is in range
        double dist = distance(node.point, target);
        if (dist <= radiusKm) {
            results.add(node.point.getIncident());
        }

        // Check if we need to search subtrees
        int axis = node.axis;
        double targetVal = axis == 0 ? target.getLat() : target.getLng();
        double nodeVal = axis == 0 ? node.point.getLat() : node.point.getLng();
        double axisDistance = Math.abs(targetVal - nodeVal) * 111; // Convert to km

        // Always search near side
        if (targetVal < nodeVal) {
            rangeQueryRecursive(node.left, target, radiusKm, results);
            // Only search far side if circle intersects plane
            if (axisDistance <= radiusKm) {
                rangeQueryRecursive(node.right, target, radiusKm, results);
            }
        } else {
            rangeQueryRecursive(node.right, target, radiusKm, results);
            if (axisDistance <= radiusKm) {
                rangeQueryRecursive(node.left, target, radiusKm, results);
            }
        }
    }

    /**
     * Insert new point (for dynamic updates)
     *
     * TIME: O(log n) average
     */
    public void insert(TrafficIncident incident) {
        Point2D point = new Point2D(incident.getLat(), incident.getLng(), incident);
        root = insertRecursive(root, point, 0);
        size++;
        log.debug("➕ Inserted incident {} at ({}, {})",
                incident.getId(), incident.getLat(), incident.getLng());
    }

    private KDNode insertRecursive(KDNode node, Point2D point, int depth) {
        if (node == null) {
            return new KDNode(point, depth % 2);
        }

        int axis = depth % 2;
        double pointVal = axis == 0 ? point.getLat() : point.getLng();
        double nodeVal = axis == 0 ? node.point.getLat() : node.point.getLng();

        if (pointVal < nodeVal) {
            node.left = insertRecursive(node.left, point, depth + 1);
        } else {
            node.right = insertRecursive(node.right, point, depth + 1);
        }

        return node;
    }

    /**
     * Calculate Euclidean distance (simplified for lat/lng)
     * Returns distance in kilometers
     */
    private double distance(Point2D p1, Point2D p2) {
        double dLat = p1.getLat() - p2.getLat();
        double dLng = p1.getLng() - p2.getLng();
        return Math.sqrt(dLat * dLat + dLng * dLng) * 111; // Rough km conversion
    }

    /**
     * Get tree size
     */
    public int size() {
        return size;
    }

    /**
     * Check if tree is empty
     */
    public boolean isEmpty() {
        return root == null;
    }

    /**
     * Get tree height (for debugging)
     */
    public int height() {
        return heightRecursive(root);
    }

    private int heightRecursive(KDNode node) {
        if (node == null) return 0;
        return 1 + Math.max(heightRecursive(node.left), heightRecursive(node.right));
    }

    /**
     * Helper class for K-NN search
     */
    @Data
    @AllArgsConstructor
    private static class PointDistance {
        Point2D point;
        double distance;
    }

    /**
     * Print tree structure (for debugging)
     */
    public void printTree() {
        log.info("🌳 KD-Tree structure:");
        printTreeRecursive(root, "", true);
    }

    private void printTreeRecursive(KDNode node, String prefix, boolean isTail) {
        if (node == null) return;

        log.info(prefix + (isTail ? "└── " : "├── ") +
                String.format("(%.4f, %.4f) [%s]",
                        node.point.getLat(),
                        node.point.getLng(),
                        node.axis == 0 ? "X" : "Y"));

        if (node.left != null || node.right != null) {
            if (node.left != null) {
                printTreeRecursive(node.left, prefix + (isTail ? "    " : "│   "), false);
            }
            if (node.right != null) {
                printTreeRecursive(node.right, prefix + (isTail ? "    " : "│   "), true);
            }
        }
    }
}