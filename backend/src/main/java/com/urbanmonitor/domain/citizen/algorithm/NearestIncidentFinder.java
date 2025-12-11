package com.urbanmonitor.domain.citizen.algorithm;

import com.urbanmonitor.domain.citizen.entity.TrafficIncident;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.PriorityQueue;

/**
 * K-NEAREST NEIGHBORS ALGORITHM
 *
 * DSA Concepts Applied:
 * ====================
 * 1. Priority Queue (Max Heap): Efficient top-K selection
 * 2. Distance Calculation: Euclidean distance
 * 3. Top-K Algorithm: Heap-based solution
 *
 * Algorithm:
 * =========
 * 1. Use Max Heap of size K
 * 2. For each incident:
 *    - Calculate distance
 *    - If heap size < K: add to heap
 *    - Else if distance < max in heap:
 *      → Remove max
 *      → Add current incident
 * 3. Return heap contents (K nearest)
 *
 * Time Complexity: O(n log k)
 *   - n = total incidents
 *   - k = number of nearest to find
 *
 * Space Complexity: O(k)
 */
@Slf4j
public class NearestIncidentFinder {

    /**
     * Find K nearest incidents to given location
     */
    public static List<IncidentDistance> findKNearest(
            List<TrafficIncident> incidents,
            double targetLat,
            double targetLng,
            int k
    ) {
        log.info("📍 Finding {} nearest incidents to ({}, {})", k, targetLat, targetLng);

        if (incidents == null || incidents.isEmpty()) {
            return Collections.emptyList();
        }

        if (k <= 0) {
            throw new IllegalArgumentException("k must be positive");
        }

        // DSA: Max Heap - keeps top K closest incidents
        PriorityQueue<IncidentDistance> maxHeap = new PriorityQueue<>(
                (a, b) -> Double.compare(b.distance, a.distance) // Max heap
        );

        // O(n log k) - process each incident
        for (TrafficIncident incident : incidents) {
            double dist = calculateDistance(
                    targetLat, targetLng,
                    incident.getLat(), incident.getLng()
            );

            IncidentDistance data = new IncidentDistance(incident, dist);

            if (maxHeap.size() < k) {
                maxHeap.offer(data);
            } else if (dist < maxHeap.peek().distance) {
                maxHeap.poll();
                maxHeap.offer(data);
            }
        }

        // Convert heap to list and reverse
        List<IncidentDistance> result = new ArrayList<>();
        while (!maxHeap.isEmpty()) {
            result.add(maxHeap.poll());
        }
        Collections.reverse(result);

        log.info("✅ Found {} nearest incidents", result.size());
        return result;
    }

    /**
     * Calculate Euclidean distance between two points
     */
    private static double calculateDistance(
            double lat1, double lng1,
            double lat2, double lng2
    ) {
        double dLat = lat1 - lat2;
        double dLng = lng1 - lng2;
        return Math.sqrt(dLat * dLat + dLng * dLng);
    }

    /**
     * DTO: Incident with calculated distance
     */
    @Data
    @AllArgsConstructor
    public static class IncidentDistance {
        private TrafficIncident incident;
        private double distance;

        public String getFormattedDistance() {
            if (distance < 0.01) {
                return String.format("%.0fm", distance * 111000);
            } else {
                return String.format("%.2f km", distance * 111);
            }
        }
    }
}