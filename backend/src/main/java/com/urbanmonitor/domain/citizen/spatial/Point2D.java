package com.urbanmonitor.domain.citizen.spatial;

import com.urbanmonitor.domain.citizen.entity.TrafficIncident;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 2D POINT WITH INCIDENT DATA
 *
 * Represents a point in 2D space with associated traffic incident
 *
 * DESIGN PATTERN: Value Object
 * - Immutable coordinates
 * - Associated data (incident)
 */
@Data
@AllArgsConstructor
public class Point2D {
    private double lat;  // Latitude (x-coordinate)
    private double lng;  // Longitude (y-coordinate)
    private TrafficIncident incident; // Associated incident data

    /**
     * Calculate Euclidean distance to another point
     * Returns approximate distance in kilometers
     */
    public double distanceTo(Point2D other) {
        double dLat = this.lat - other.lat;
        double dLng = this.lng - other.lng;
        return Math.sqrt(dLat * dLat + dLng * dLng) * 111; // ~111km per degree
    }

    @Override
    public String toString() {
        return String.format("Point(%.4f, %.4f)", lat, lng);
    }
}