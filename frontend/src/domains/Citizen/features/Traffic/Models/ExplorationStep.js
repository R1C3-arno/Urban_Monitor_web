/**
 * ExplorationStep Model
 * Represents a single step in the pathfinding algorithm's exploration
 */
export class ExplorationStep {
    constructor(data = {}) {
        this.stepNumber = data.stepNumber || 0;
        this.action = data.action || 'VISIT'; // START, VISIT, PROCESS, SKIP
        this.node = data.node || null;
        this.distance = data.distance || 0;
        this.timestamp = data.timestamp || Date.now();
    }

    /**
     * Get action display name
     */
    getActionName() {
        const names = {
            'START': 'Start Node',
            'VISIT': 'Visited',
            'PROCESS': 'Processing',
            'SKIP': 'Skipped'
        };
        return names[this.action] || this.action;
    }

    /**
     * Get action color for visualization
     */
    getActionColor() {
        const colors = {
            'START': '#EF4444',    // Red
            'VISIT': '#3B82F6',    // Blue (Dijkstra)
            'PROCESS': '#FBBF24',  // Amber
            'SKIP': '#6B7280'      // Gray
        };
        return colors[this.action] || '#9CA3AF';
    }

    /**
     * Check if this is the start node
     */
    isStart() {
        return this.action === 'START';
    }

    /**
     * Check if this is a visited node
     */
    isVisited() {
        return this.action === 'VISIT';
    }

    /**
     * Summary for logging
     */
    getSummary() {
        return `Step ${this.stepNumber}: ${this.getActionName()} Node ${this.node?.id}`;
    }
}

export default ExplorationStep;