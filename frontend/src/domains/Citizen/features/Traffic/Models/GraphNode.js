/**
 * GraphNode Model
 * Represents a single node in the traffic graph
 */
export class GraphNode {
    constructor(data = {}) {
        this.id = data.id || null;
        this.nodeId = data.nodeId || data.id; // Alias for API compatibility
        this.lat = data.lat || 0;
        this.lng = data.lng || 0;
        this.name = data.name || data.nodeName || `Node ${this.id}`;
        this.nodeName = data.nodeName || this.name;
        this.locationName = data.locationName || null;
        this.congestionLevel = data.congestionLevel || 0;
        this.isBlocked = data.isBlocked || false;
    }

    /**
     * Get display name
     */
    getDisplayName() {
        return this.name || this.nodeName || `Node ${this.id}`;
    }

    /**
     * Get location display
     */
    getLocation() {
        return this.locationName || this.getDisplayName();
    }

    /**
     * Get coordinates as [lng, lat]
     */
    getCoordinates() {
        return [this.lng, this.lat];
    }

    /**
     * Calculate distance to another node (Haversine)
     */
    distanceTo(other) {
        if (!other) return 0;

        const R = 6371; // Earth radius in km
        const dLat = this._toRad(other.lat - this.lat);
        const dLng = this._toRad(other.lng - this.lng);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._toRad(this.lat)) *
            Math.cos(this._toRad(other.lat)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    /**
     * Convert degrees to radians
     */
    _toRad(deg) {
        return (deg * Math.PI) / 180;
    }

    /**
     * Check if node is blocked
     */
    isPassable() {
        return !this.isBlocked;
    }

    /**
     * Get congestion status
     */
    getCongestionStatus() {
        if (this.congestionLevel < 30) return 'LOW';
        if (this.congestionLevel < 70) return 'MEDIUM';
        return 'HIGH';
    }

    /**
     * Summary for logging
     */
    getSummary() {
        return `${this.getDisplayName()} (${this.lat.toFixed(4)}, ${this.lng.toFixed(4)})`;
    }
}

export default GraphNode;