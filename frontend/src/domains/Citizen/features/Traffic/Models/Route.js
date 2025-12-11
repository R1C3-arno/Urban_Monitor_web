/**
 * Route Model
 * Encapsulates route data with helper methods for visualization
 */
export class Route {
    constructor(data = {}) {
        this.algorithm = data.algorithm || 'dijkstra';
        this.explorationSteps = data.explorationSteps || [];
        this.nodeDetails = data.nodeDetails || [];
        this.totalDistance = data.totalDistance || 0;
        this.totalTime = data.totalTime || 0;
        this.formattedDistance = data.formattedDistance || this.formatDistance(this.totalDistance);
        this.formattedTime = data.formattedTime || this.formatTime(this.totalTime);
        this.iterations = data.iterations || 0;
        this.pathGeometry = data.pathGeometry || null;
    }

    /**
     * Get path coordinates for drawing
     */
    getPathCoordinates() {
        if (this.pathGeometry?.coordinates) {
            return this.pathGeometry.coordinates;
        }

        // Fallback: generate from nodeDetails
        return this.nodeDetails.map(node => [node.lng, node.lat]);
    }

    /**
     * Get path as node IDs
     */
    getPath() {
        return this.nodeDetails.map(node => node.nodeId || node.id);
    }

    /**
     * Format distance (meters â†' km or m)
     */
    formatDistance(meters) {
        if (!meters) return '0 m';
        if (meters >= 1000) {
            return (meters / 1000).toFixed(2) + ' km';
        }
        return Math.round(meters) + ' m';
    }

    /**
     * Format time (seconds â†' mins or seconds)
     */
    formatTime(seconds) {
        if (!seconds) return '0 s';
        if (seconds >= 60) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return mins + 'm ' + Math.round(secs) + 's';
        }
        return Math.round(seconds) + ' s';
    }

    /**
     * Get number of nodes in path
     */
    getNodeCount() {
        return this.nodeDetails.length;
    }

    /**
     * Get exploration efficiency (exploration steps vs path length)
     */
    getEfficiency() {
        if (this.nodeDetails.length === 0) return 0;
        return (this.nodeDetails.length / (this.explorationSteps.length || 1)) * 100;
    }

    /**
     * Check if route is valid
     */
    isValid() {
        return this.nodeDetails.length >= 2 && this.totalDistance > 0;
    }

    /**
     * Get algorithm name (formatted)
     */
    getAlgorithmName() {
        return this.algorithm === 'dijkstra' ? 'Dijkstra' : 'A*';
    }

    /**
     * Get algorithm color for visualization
     */
    getAlgorithmColor() {
        return this.algorithm === 'dijkstra' ? '#3B82F6' : '#10B981';
    }

    /**
     * Summary for display
     */
    getSummary() {
        return {
            algorithm: this.getAlgorithmName(),
            distance: this.formattedDistance,
            time: this.formattedTime,
            nodes: this.getNodeCount(),
            explorationSteps: this.explorationSteps.length,
            iterations: this.iterations,
            efficiency: this.getEfficiency().toFixed(1) + '%'
        };
    }
}

export default Route;