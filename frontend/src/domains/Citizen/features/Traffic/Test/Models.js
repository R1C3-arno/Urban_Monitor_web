/**
 * Traffic Models/Entities
 * OOP: Encapsulation Pattern
 * Mirror các DTO từ backend
 */

// ==================== BASE CLASSES ====================

export class Coordinate {
    constructor(lat, lng) {
        this.lat = lat;
        this.lng = lng;
    }

    distanceTo(other) {
        const R = 6371; // Earth radius in km
        const dLat = (other.lat - this.lat) * (Math.PI / 180);
        const dLng = (other.lng - this.lng) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.lat * (Math.PI / 180)) * Math.cos(other.lat * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toGeoJSON() {
        return [this.lng, this.lat];
    }
}

// ==================== INCIDENT/TRAFFIC ====================

export class TrafficIncident {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.severity = data.severity; // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
        this.type = data.type; // 'ACCIDENT', 'CONGESTION', 'CONSTRUCTION', 'HAZARD'
        this.coords = new Coordinate(data.coords.lat, data.coords.lng);
        this.radius = data.radius || 100;
        this.createdAt = new Date(data.createdAt);
        this.reportId = data.reportId;
        this.verified = data.verified || false;
    }

    get severityColor() {
        const colors = {
            LOW: '#10B981',
            MEDIUM: '#F59E0B',
            HIGH: '#EF4444',
            CRITICAL: '#7C3AED',
        };
        return colors[this.severity] || '#6B7280';
    }

    get typeIcon() {
        const icons = {
            ACCIDENT: '🚗',
            CONGESTION: '🚦',
            CONSTRUCTION: '🚧',
            HAZARD: '⚠️',
        };
        return icons[this.type] || '📍';
    }

    toGeoJSON() {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: this.coords.toGeoJSON(),
            },
            properties: {
                id: this.id,
                title: this.title,
                severity: this.severity,
                type: this.type,
            },
        };
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            severity: this.severity,
            type: this.type,
            coords: { lat: this.coords.lat, lng: this.coords.lng },
            radius: this.radius,
            createdAt: this.createdAt.toISOString(),
            reportId: this.reportId,
            verified: this.verified,
        };
    }
}

// ==================== TRAFFIC NODES (Graph) ====================

export class TrafficNode {
    constructor(data) {
        this.id = data.id;
        this.coords = new Coordinate(data.coords.lat, data.coords.lng);
        this.name = data.name || `Node-${this.id}`;
        this.type = data.type; // 'INTERSECTION', 'ENDPOINT'
        this.adjacentEdges = [];
    }

    addEdge(edge) {
        if (!this.adjacentEdges.find(e => e.id === edge.id)) {
            this.adjacentEdges.push(edge);
        }
    }

    getAdjacentNodes(allNodes) {
        return this.adjacentEdges.map(edge => {
            const otherNodeId = edge.fromNodeId === this.id ? edge.toNodeId : edge.fromNodeId;
            return allNodes.find(n => n.id === otherNodeId);
        }).filter(Boolean);
    }

    toJSON() {
        return {
            id: this.id,
            coords: { lat: this.coords.lat, lng: this.coords.lng },
            name: this.name,
            type: this.type,
            adjacentEdgesCount: this.adjacentEdges.length,
        };
    }
}

// ==================== TRAFFIC EDGES (Graph) ====================

export class TrafficEdge {
    constructor(data) {
        this.id = data.id;
        this.fromNodeId = data.fromNodeId;
        this.toNodeId = data.toNodeId;
        this.weight = data.weight; // Distance in km
        this.bidirectional = data.bidirectional !== false;
        this.speedLimit = data.speedLimit || 50; // km/h
        this.roadType = data.roadType; // 'HIGHWAY', 'MAIN', 'SECONDARY', 'LOCAL'
        this.geometry = data.geometry; // Array of coordinates for polyline
        this.hasIncidents = data.hasIncidents || false;
    }

    get estimatedTravelTime() {
        return (this.weight / this.speedLimit) * 60; // minutes
    }

    get color() {
        if (this.hasIncidents) return '#EF4444';
        const speedColors = {
            HIGHWAY: '#3B82F6',
            MAIN: '#10B981',
            SECONDARY: '#F59E0B',
            LOCAL: '#6B7280',
        };
        return speedColors[this.roadType] || '#9CA3AF';
    }

    toGeoJSON() {
        return {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: this.geometry.map(coord => coord.toGeoJSON()),
            },
            properties: {
                id: this.id,
                weight: this.weight,
                speedLimit: this.speedLimit,
                roadType: this.roadType,
                hasIncidents: this.hasIncidents,
            },
        };
    }

    toJSON() {
        return {
            id: this.id,
            fromNodeId: this.fromNodeId,
            toNodeId: this.toNodeId,
            weight: this.weight,
            bidirectional: this.bidirectional,
            speedLimit: this.speedLimit,
            roadType: this.roadType,
            estimatedTravelTime: this.estimatedTravelTime,
        };
    }
}

// ==================== TRAFFIC REPORT ====================

export class TrafficReport {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.reporterEmail = data.reporterEmail;
        this.location = new Coordinate(data.location.lat, data.location.lng);
        this.incidentType = data.incidentType;
        this.severity = data.severity;
        this.imageUrl = data.imageUrl;
        this.state = data.state; // 'PENDING', 'APPROVED', 'REJECTED'
        this.createdAt = new Date(data.createdAt);
        this.validationErrors = data.validationErrors || [];
    }

    get isPending() {
        return this.state === 'PENDING';
    }

    get isApproved() {
        return this.state === 'APPROVED';
    }

    get isRejected() {
        return this.state === 'REJECTED';
    }

    get stateColor() {
        const colors = {
            PENDING: '#F59E0B',
            APPROVED: '#10B981',
            REJECTED: '#EF4444',
        };
        return colors[this.state] || '#6B7280';
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            reporterEmail: this.reporterEmail,
            location: { lat: this.location.lat, lng: this.location.lng },
            incidentType: this.incidentType,
            severity: this.severity,
            imageUrl: this.imageUrl,
            state: this.state,
            createdAt: this.createdAt.toISOString(),
            validationErrors: this.validationErrors,
        };
    }
}

// ==================== ROUTE ====================

export class Route {
    constructor(data) {
        this.id = data.id || Math.random().toString(36);
        this.startCoord = new Coordinate(data.startCoord.lat, data.startCoord.lng);
        this.endCoord = new Coordinate(data.endCoord.lat, data.endCoord.lng);
        this.distance = data.distance; // km
        this.estimatedTime = data.estimatedTime; // minutes
        this.nodeIds = data.nodeIds || [];
        this.edges = data.edges || [];
        this.geometry = data.geometry || []; // Array of coordinates
        this.algorithm = data.algorithm || 'DIJKSTRA';
        this.decorator = data.decorator || 'NONE';
    }

    get totalDistance() {
        return this.distance;
    }

    get totalTime() {
        return this.estimatedTime;
    }

    get averageSpeed() {
        return this.totalTime > 0 ? (this.totalDistance / this.totalTime) * 60 : 0;
    }

    toGeoJSON() {
        return {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: this.geometry.map(coord => coord.toGeoJSON()),
            },
            properties: {
                distance: this.distance,
                time: this.estimatedTime,
                algorithm: this.algorithm,
            },
        };
    }

    toJSON() {
        return {
            id: this.id,
            startCoord: { lat: this.startCoord.lat, lng: this.startCoord.lng },
            endCoord: { lat: this.endCoord.lat, lng: this.endCoord.lng },
            distance: this.distance,
            estimatedTime: this.estimatedTime,
            nodeIds: this.nodeIds,
            algorithm: this.algorithm,
            decorator: this.decorator,
        };
    }
}

// ==================== BLACKSPOT ====================

export class Blackspot {
    constructor(data) {
        this.id = data.id;
        this.center = new Coordinate(data.center.lat, data.center.lng);
        this.radius = data.radius; // meters
        this.severity = data.severity; // 1-5
        this.incidentCount = data.incidentCount;
        this.riskScore = data.riskScore; // 0-100
    }

    get color() {
        const alpha = Math.min(this.severity / 5, 1);
        const baseColor = [255, 0, 0]; // Red
        return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${alpha * 0.6})`;
    }

    toGeoJSON() {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: this.center.toGeoJSON(),
            },
            properties: {
                id: this.id,
                severity: this.severity,
                incidentCount: this.incidentCount,
                riskScore: this.riskScore,
            },
        };
    }
}

// ==================== EXPLORATION STEP (For Algorithm Visualization) ====================

export class ExplorationStep {
    constructor(data) {
        this.step = data.step;
        this.nodeId = data.nodeId;
        this.distance = data.distance;
        this.heuristic = data.heuristic;
        this.isClosed = data.isClosed;
        this.visitOrder = data.visitOrder;
    }

    toJSON() {
        return {
            step: this.step,
            nodeId: this.nodeId,
            distance: this.distance,
            heuristic: this.heuristic,
            isClosed: this.isClosed,
            visitOrder: this.visitOrder,
        };
    }
}

// ==================== ALGORITHM COMPARISON ====================

export class AlgorithmComparison {
    constructor(data) {
        this.algorithms = data.algorithms || {}; // { 'DIJKSTRA': {...}, 'ASTAR': {...} }
        this.startNode = data.startNode;
        this.endNode = data.endNode;
        this.timestamp = new Date();
    }

    getWinnerAlgorithm() {
        let winner = null;
        let minTime = Infinity;

        for (const [algo, result] of Object.entries(this.algorithms)) {
            if (result.executionTime < minTime) {
                minTime = result.executionTime;
                winner = algo;
            }
        }

        return winner;
    }

    getAlgorithmMetrics(algorithmName) {
        return this.algorithms[algorithmName] || null;
    }

    toJSON() {
        return {
            algorithms: this.algorithms,
            startNode: this.startNode,
            endNode: this.endNode,
            winner: this.getWinnerAlgorithm(),
            timestamp: this.timestamp.toISOString(),
        };
    }
}

// ==================== VALIDATION REPORT ====================

export class ValidationReport {
    constructor(data) {
        this.totalReports = data.totalReports || 0;
        this.approvedCount = data.approvedCount || 0;
        this.rejectedCount = data.rejectedCount || 0;
        this.pendingCount = data.pendingCount || 0;
        this.validationChainResults = data.validationChainResults || [];
        this.spamDetectionRate = data.spamDetectionRate || 0;
        this.duplicateDetectionRate = data.duplicateDetectionRate || 0;
    }

    get approvalRate() {
        return this.totalReports > 0 ? (this.approvedCount / this.totalReports) * 100 : 0;
    }

    get rejectionRate() {
        return this.totalReports > 0 ? (this.rejectedCount / this.totalReports) * 100 : 0;
    }

    toJSON() {
        return {
            totalReports: this.totalReports,
            approvedCount: this.approvedCount,
            rejectedCount: this.rejectedCount,
            pendingCount: this.pendingCount,
            approvalRate: this.approvalRate,
            rejectionRate: this.rejectionRate,
            validationChainResults: this.validationChainResults,
            spamDetectionRate: this.spamDetectionRate,
            duplicateDetectionRate: this.duplicateDetectionRate,
        };
    }
}