package com.urbanmonitor.domain.citizen.algorithm;

import com.urbanmonitor.domain.citizen.entity.TrafficIncident;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * BLACKSPOT DETECTION ALGORITHM - IMPROVED
 *
 * ✅ NEW: Configurable radius for flexible analysis
 */
@Slf4j
public class BlackspotDetector {

    private static final double DEFAULT_GRID_SIZE = 0.01; // ~1.1km per grid cell

    /**
     * ✅ IMPROVED: Detect blackspots with configurable radius
     *
     * @param incidents List of all incidents
     * @param radius Grid size in degrees (~111km per degree)
     * @param topK Number of top blackspots to return
     * @return List of blackspots sorted by severity
     */
    public static List<Blackspot> detectBlackspots(
            List<TrafficIncident> incidents,
            double radius,
            int topK
    ) {
        log.info("🔍 Analyzing {} incidents for blackspots (radius={}, topK={})",
                incidents.size(), radius, topK);

        if (incidents == null || incidents.isEmpty()) {
            return Collections.emptyList();
        }

        // DSA: HashMap for frequency counting - O(n)
        Map<String, BlackspotData> gridCounts = new HashMap<>();

        for (TrafficIncident incident : incidents) {
            String gridKey = getGridKey(incident.getLat(), incident.getLng(), radius);

            gridCounts.computeIfAbsent(gridKey, k -> {
                double[] center = parseGridKey(k, radius);
                return new BlackspotData(center[0], center[1]);
            }).addIncident(incident);
        }

        // DSA: Convert to list and sort - O(k log k)
        List<Blackspot> blackspots = gridCounts.values().stream()
                .map(data -> Blackspot.builder()
                        .lat(data.lat)
                        .lng(data.lng)
                        .incidentCount(data.incidentCount)
                        .severityScore(data.calculateSeverityScore())
                        .recentIncidents(data.recentCount)
                        .highSeverityCount(data.highSeverityCount)
                        .radius(radius)
                        .build())
                .sorted((a, b) -> Integer.compare(b.severityScore, a.severityScore))
                .limit(topK)
                .collect(Collectors.toList());

        log.info("✅ Found {} blackspots", blackspots.size());
        return blackspots;
    }

    /**
     * ✅ OVERLOAD: Keep backward compatibility with default radius
     */
    public static List<Blackspot> detectBlackspots(
            List<TrafficIncident> incidents,
            int topK
    ) {
        return detectBlackspots(incidents, DEFAULT_GRID_SIZE, topK);
    }

    /**
     * DSA: Spatial hashing with configurable grid size
     */
    private static String getGridKey(double lat, double lng, double gridSize) {
        long gridLat = Math.round(lat / gridSize);
        long gridLng = Math.round(lng / gridSize);
        return gridLat + "," + gridLng;
    }

    /**
     * Parse grid key back to lat/lng coordinates
     */
    private static double[] parseGridKey(String key, double gridSize) {
        String[] parts = key.split(",");
        double lat = Long.parseLong(parts[0]) * gridSize;
        double lng = Long.parseLong(parts[1]) * gridSize;
        return new double[]{lat, lng};
    }

    /**
     * Internal data structure for counting
     */
    private static class BlackspotData {
        double lat;
        double lng;
        int incidentCount = 0;
        int highSeverityCount = 0;
        int recentCount = 0;

        BlackspotData(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }

        void addIncident(TrafficIncident incident) {
            incidentCount++;

            if (incident.isHighPriority()) {
                highSeverityCount++;
            }

            if (incident.getCreatedAt() != null &&
                    incident.getCreatedAt().isAfter(LocalDateTime.now().minusDays(7))) {
                recentCount++;
            }
        }

        int calculateSeverityScore() {
            return incidentCount + (highSeverityCount * 2);
        }
    }

    /**
     * ✅ IMPROVED: Blackspot DTO with radius info
     */
    @Data
    @Builder
    @AllArgsConstructor
    public static class Blackspot {
        private double lat;
        private double lng;
        private int incidentCount;
        private int severityScore;
        private int recentIncidents;
        private int highSeverityCount;
        private double radius; // ✅ NEW: Include radius used

        /**
         * Calculate risk level
         */
        public String getRiskLevel() {
            if (severityScore >= 20) return "VERY_HIGH";
            if (severityScore >= 10) return "HIGH";
            if (severityScore >= 5) return "MEDIUM";
            return "LOW";
        }

        /**
         * ✅ NEW: Get formatted radius
         */
        public String getFormattedRadius() {
            double km = radius * 111; // Convert degrees to km
            return String.format("%.1f km", km);
        }
    }
}