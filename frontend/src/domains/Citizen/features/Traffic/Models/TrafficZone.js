// Domain model
/**
 * TrafficZone Domain Model
 * Represents a danger zone around traffic incidents
 * Encapsulates circle polygon logic
 */

import { CIRCLE_CONFIG, TRAFFIC_COLORS } from "../Config/trafficConfig.js";
import { createCirclePolygonArray} from "../../../../../shared/Utils/geo/circle.js";

export class TrafficZone {
    constructor({ id, center, radius, level, opacity = CIRCLE_CONFIG.OPACITY }) {
        this._validate({ id, center, radius, level });

        this._id = id;
        this._center = center; // [lng, lat]
        this._radius = radius;
        this._level = level;
        this._opacity = opacity;

        // Generate polygon coordinates
        this._coords = createCirclePolygonArray(
            center[0], // lng
            center[1], // lat
            radius,
            CIRCLE_CONFIG.SEGMENTS
        );

        Object.freeze(this);
    }

    // ==================== GETTERS ====================
    get id() {
        return this._id;
    }

    get center() {
        return this._center;
    }

    get radius() {
        return this._radius;
    }

    get level() {
        return this._level;
    }

    get coords() {
        return this._coords;
    }

    get opacity() {
        return this._opacity;
    }

    get color() {
        return TRAFFIC_COLORS[this._level] || "#3B82F6";
    }

    // ==================== BUSINESS LOGIC ====================
    containsPoint([lng, lat]) {
        const [centerLng, centerLat] = this._center;
        const distance = this._calculateDistance(lng, lat, centerLng, centerLat);
        return distance <= this._radius;
    }

    _calculateDistance(lng1, lat1, lng2, lat2) {
        const R = 6371e3; // Earth radius in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lng2 - lng1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }

    // ==================== VALIDATION ====================
    _validate({ id, center, radius, level }) {
        const errors = [];

        if (!id) {
            errors.push("Zone ID is required");
        }

        if (
            !Array.isArray(center) ||
            center.length !== 2 ||
            !Number.isFinite(center[0]) ||
            !Number.isFinite(center[1])
        ) {
            errors.push("Center must be valid [lng, lat] numbers");
        }


        if (!Number.isFinite(radius) || radius <= 0) {
            errors.push("Radius must be a positive number");
        }

        if (!level) {
            errors.push("Level is required");
        }

        if (errors.length > 0) {
            throw new Error(`TrafficZone validation failed: ${errors.join(", ")}`);
        }
    }

    // ==================== UTILITIES ====================
    toJSON() {
        return {
            id: this._id,
            center: this._center,
            radius: this._radius,
            level: this._level,
            coords: this._coords,
            color: this.color,
            opacity: this._opacity,
        };
    }

    toGeoJSON() {
        return {
            type: "Feature",
            id: this._id,
            geometry: {
                type: "Polygon",
                coordinates: [this._coords],
            },
            properties: {
                level: this._level,
                radius: this._radius,
                color: this.color,
                opacity: this._opacity,
            },
        };
    }

    // ==================== FACTORY METHODS ====================
    static fromIncident(incident, radiusByLevel = CIRCLE_CONFIG.RADIUS_BY_LEVEL) {
        const radius = radiusByLevel[incident.level] || 150;

        return new TrafficZone({
            id: `zone-${incident.id}`,
            center: incident.coords,
            radius,
            level: incident.level,
        });
    }
}