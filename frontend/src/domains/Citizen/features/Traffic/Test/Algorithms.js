/**
 * Algorithm Services
 * OOP: Strategy Pattern
 * Triển khai các routing algorithms từ backend
 */

import { PriorityQueue} from "@/domains/Citizen/features/Traffic/Test/DSAStructure.js";
import { Route, Coordinate } from './Models.js';

// ==================== BASE STRATEGY ====================

export class PathFindingStrategy {
    /**
     * @abstract
     */
    findPath(graph, startNodeId, endNodeId) {
        throw new Error('Method not implemented');
    }

    /**
     * Reconstruct path from parent map
     */
    _reconstructPath(parents, startId, endId) {
        const path = [];
        let current = endId;

        while (current !== null && current !== undefined) {
            path.unshift(current);
            current = parents.get(current);
        }

        return path.length > 1 && path[0] === startId ? path : [];
    }

    /**
     * Calculate heuristic for A* variants
     */
    _heuristic(nodeCoords, endCoords) {
        return nodeCoords.distanceTo(endCoords);
    }
}

// ==================== DIJKSTRA ALGORITHM ====================

export class DijkstraAlgorithm extends PathFindingStrategy {
    findPath(graph, startNodeId, endNodeId, options = {}) {
        const startTime = performance.now();
        const distances = new Map();
        const parents = new Map();
        const visited = new Set();
        const pq = new PriorityQueue();
        const explorationSteps = [];
        let stepCount = 0;

        // Initialize
        for (const [nodeId] of graph.nodes) {
            distances.set(nodeId, nodeId === startNodeId ? 0 : Infinity);
            parents.set(nodeId, null);
        }

        pq.push(startNodeId, 0);

        while (!pq.isEmpty()) {
            const current = pq.pop();
            if (visited.has(current)) continue;
            visited.add(current);

            explorationSteps.push({
                step: stepCount++,
                nodeId: current,
                distance: distances.get(current),
                isClosed: true,
                visitOrder: visited.size,
            });

            if (current === endNodeId) break;

            const adjacent = graph.getAdjacent(current);
            for (const neighbor of adjacent) {
                const edge = this._getEdge(graph, current, neighbor.id);
                if (!edge) continue;

                const newDistance = distances.get(current) + edge.weight;

                if (newDistance < distances.get(neighbor.id)) {
                    distances.set(neighbor.id, newDistance);
                    parents.set(neighbor.id, current);
                    pq.push(neighbor.id, newDistance);
                }
            }
        }

        const path = this._reconstructPath(parents, startNodeId, endNodeId);
        const executionTime = performance.now() - startTime;

        return {
            path,
            distance: distances.get(endNodeId),
            executionTime,
            nodesExplored: visited.size,
            algorithm: 'DIJKSTRA',
            explorationSteps,
        };
    }

    _getEdge(graph, fromId, toId) {
        for (const edge of graph.edges.values()) {
            if (edge.fromNodeId === fromId && edge.toNodeId === toId) return edge;
            if (edge.bidirectional && edge.fromNodeId === toId && edge.toNodeId === fromId) return edge;
        }
        return null;
    }
}

// ==================== A* ALGORITHM ====================

export class AStarAlgorithm extends PathFindingStrategy {
    findPath(graph, startNodeId, endNodeId, options = {}) {
        const startTime = performance.now();
        const gScore = new Map();
        const fScore = new Map();
        const parents = new Map();
        const openSet = new Set();
        const closedSet = new Set();
        const pq = new PriorityQueue();
        const explorationSteps = [];
        let stepCount = 0;

        const startNode = graph.getNode(startNodeId);
        const endNode = graph.getNode(endNodeId);

        // Initialize
        for (const [nodeId] of graph.nodes) {
            gScore.set(nodeId, Infinity);
            fScore.set(nodeId, Infinity);
            parents.set(nodeId, null);
        }

        gScore.set(startNodeId, 0);
        const hStart = this._heuristic(startNode.coords, endNode.coords);
        fScore.set(startNodeId, hStart);
        openSet.add(startNodeId);
        pq.push(startNodeId, hStart);

        while (!pq.isEmpty()) {
            const current = pq.pop();
            if (!openSet.has(current)) continue;

            openSet.delete(current);
            closedSet.add(current);

            const currentNode = graph.getNode(current);
            const h = this._heuristic(currentNode.coords, endNode.coords);

            explorationSteps.push({
                step: stepCount++,
                nodeId: current,
                distance: gScore.get(current),
                heuristic: h,
                isClosed: true,
                visitOrder: closedSet.size,
            });

            if (current === endNodeId) break;

            const adjacent = graph.getAdjacent(current);
            for (const neighbor of adjacent) {
                if (closedSet.has(neighbor.id)) continue;

                const edge = this._getEdge(graph, current, neighbor.id);
                if (!edge) continue;

                const tentativeG = gScore.get(current) + edge.weight;

                if (!openSet.has(neighbor.id)) {
                    openSet.add(neighbor.id);
                } else if (tentativeG >= gScore.get(neighbor.id)) {
                    continue;
                }

                parents.set(neighbor.id, current);
                gScore.set(neighbor.id, tentativeG);

                const h = this._heuristic(neighbor.coords, endNode.coords);
                const f = tentativeG + h;
                fScore.set(neighbor.id, f);
                pq.push(neighbor.id, f);
            }
        }

        const path = this._reconstructPath(parents, startNodeId, endNodeId);
        const executionTime = performance.now() - startTime;

        return {
            path,
            distance: gScore.get(endNodeId),
            executionTime,
            nodesExplored: closedSet.size,
            algorithm: 'ASTAR',
            explorationSteps,
        };
    }

    _getEdge(graph, fromId, toId) {
        for (const edge of graph.edges.values()) {
            if (edge.fromNodeId === fromId && edge.toNodeId === toId) return edge;
            if (edge.bidirectional && edge.fromNodeId === toId && edge.toNodeId === fromId) return edge;
        }
        return null;
    }
}

// ==================== BIDIRECTIONAL DIJKSTRA ====================

export class BidirectionalDijkstraAlgorithm extends PathFindingStrategy {
    findPath(graph, startNodeId, endNodeId, options = {}) {
        const startTime = performance.now();

        const forwardDist = new Map();
        const backwardDist = new Map();
        const forwardParent = new Map();
        const backwardParent = new Map();
        const forwardVisited = new Set();
        const backwardVisited = new Set();
        const forwardPQ = new PriorityQueue();
        const backwardPQ = new PriorityQueue();
        const explorationSteps = [];
        let stepCount = 0;

        // Initialize
        for (const [nodeId] of graph.nodes) {
            forwardDist.set(nodeId, Infinity);
            backwardDist.set(nodeId, Infinity);
            forwardParent.set(nodeId, null);
            backwardParent.set(nodeId, null);
        }

        forwardDist.set(startNodeId, 0);
        backwardDist.set(endNodeId, 0);
        forwardPQ.push(startNodeId, 0);
        backwardPQ.push(endNodeId, 0);

        let meetingPoint = null;
        let bestDistance = Infinity;

        while (!forwardPQ.isEmpty() || !backwardPQ.isEmpty()) {
            // Forward step
            if (!forwardPQ.isEmpty()) {
                const current = forwardPQ.pop();
                if (!forwardVisited.has(current)) {
                    forwardVisited.add(current);

                    explorationSteps.push({
                        step: stepCount++,
                        nodeId: current,
                        distance: forwardDist.get(current),
                        direction: 'FORWARD',
                        isClosed: true,
                    });

                    if (backwardVisited.has(current)) {
                        const totalDist = forwardDist.get(current) + backwardDist.get(current);
                        if (totalDist < bestDistance) {
                            bestDistance = totalDist;
                            meetingPoint = current;
                        }
                    }

                    const adjacent = graph.getAdjacent(current);
                    for (const neighbor of adjacent) {
                        const edge = this._getEdge(graph, current, neighbor.id);
                        if (edge) {
                            const newDist = forwardDist.get(current) + edge.weight;
                            if (newDist < forwardDist.get(neighbor.id)) {
                                forwardDist.set(neighbor.id, newDist);
                                forwardParent.set(neighbor.id, current);
                                forwardPQ.push(neighbor.id, newDist);
                            }
                        }
                    }
                }
            }

            // Backward step
            if (!backwardPQ.isEmpty()) {
                const current = backwardPQ.pop();
                if (!backwardVisited.has(current)) {
                    backwardVisited.add(current);

                    explorationSteps.push({
                        step: stepCount++,
                        nodeId: current,
                        distance: backwardDist.get(current),
                        direction: 'BACKWARD',
                        isClosed: true,
                    });

                    if (forwardVisited.has(current)) {
                        const totalDist = forwardDist.get(current) + backwardDist.get(current);
                        if (totalDist < bestDistance) {
                            bestDistance = totalDist;
                            meetingPoint = current;
                        }
                    }

                    const adjacent = graph.getAdjacent(current);
                    for (const neighbor of adjacent) {
                        const edge = this._getEdge(graph, current, neighbor.id);
                        if (edge) {
                            const newDist = backwardDist.get(current) + edge.weight;
                            if (newDist < backwardDist.get(neighbor.id)) {
                                backwardDist.set(neighbor.id, newDist);
                                backwardParent.set(neighbor.id, current);
                                backwardPQ.push(neighbor.id, newDist);
                            }
                        }
                    }
                }
            }
        }

        let path = [];
        if (meetingPoint !== null) {
            const forwardPath = this._reconstructPath(forwardParent, startNodeId, meetingPoint);
            const backwardPath = this._reconstructPath(backwardParent, endNodeId, meetingPoint);
            path = [...forwardPath, ...backwardPath.reverse().slice(1)];
        }

        const executionTime = performance.now() - startTime;

        return {
            path,
            distance: bestDistance,
            executionTime,
            nodesExplored: forwardVisited.size + backwardVisited.size,
            algorithm: 'BIDIRECTIONAL_DIJKSTRA',
            explorationSteps,
        };
    }

    _getEdge(graph, fromId, toId) {
        for (const edge of graph.edges.values()) {
            if (edge.fromNodeId === fromId && edge.toNodeId === toId) return edge;
            if (edge.bidirectional && edge.fromNodeId === toId && edge.toNodeId === fromId) return edge;
        }
        return null;
    }
}

// ==================== ROUTING STRATEGY SERVICE ====================

export class RoutingStrategyService {
    constructor() {
        this.strategies = new Map();
        this.strategies.set('DIJKSTRA', new DijkstraAlgorithm());
        this.strategies.set('ASTAR', new AStarAlgorithm());
        this.strategies.set('BIDIRECTIONAL', new BidirectionalDijkstraAlgorithm());
    }

    findRoute(graph, startNodeId, endNodeId, algorithmName = 'DIJKSTRA') {
        const strategy = this.strategies.get(algorithmName);
        if (!strategy) {
            throw new Error(`Unknown algorithm: ${algorithmName}`);
        }

        const result = strategy.findPath(graph, startNodeId, endNodeId);
        return result;
    }

    compareAlgorithms(graph, startNodeId, endNodeId) {
        const results = {};

        for (const [name, strategy] of this.strategies) {
            results[name] = strategy.findPath(graph, startNodeId, endNodeId);
        }

        return {
            startNodeId,
            endNodeId,
            algorithms: results,
            bestAlgorithm: Object.entries(results).reduce((prev, [name, result]) =>
                result.executionTime < (prev.executionTime || Infinity) ? result : prev
            ).algorithm,
        };
    }
}

// ==================== DECORATOR PATTERN (Route Modifiers) ====================

export class RouteDecorator {
    constructor(baseRoute) {
        this.baseRoute = baseRoute;
    }

    decorate() {
        throw new Error('Method not implemented');
    }
}

export class AvoidTollsDecorator extends RouteDecorator {
    decorate() {
        // Filter out toll roads
        const modifiedEdges = this.baseRoute.edges.filter(edge => !edge.hasTolli);
        return {
            ...this.baseRoute,
            edges: modifiedEdges,
            decorator: 'AVOID_TOLLS',
        };
    }
}

export class AvoidHighwaysDecorator extends RouteDecorator {
    decorate() {
        // Filter out highways
        const modifiedEdges = this.baseRoute.edges.filter(edge => edge.roadType !== 'HIGHWAY');
        return {
            ...this.baseRoute,
            edges: modifiedEdges,
            decorator: 'AVOID_HIGHWAYS',
        };
    }
}

export class PreferScenicDecorator extends RouteDecorator {
    decorate() {
        // Prioritize scenic routes (secondary/local roads)
        const modifiedEdges = this.baseRoute.edges.map(edge => {
            if (edge.roadType === 'SECONDARY' || edge.roadType === 'LOCAL') {
                return { ...edge, weight: edge.weight * 0.9 };
            }
            return { ...edge, weight: edge.weight * 1.1 };
        });

        return {
            ...this.baseRoute,
            edges: modifiedEdges,
            decorator: 'PREFER_SCENIC',
        };
    }
}

// ==================== BLACKSPOT DETECTOR ====================

export class BlackspotDetector {
    /**
     * Detect blackspots using spatial clustering
     * @param {Array<TrafficIncident>} incidents
     * @param {number} radiusKm - Clustering radius
     * @returns {Array<Blackspot>}
     */
    detectBlackspots(incidents, radiusKm = 0.5) {
        const clusters = this._clusterIncidents(incidents, radiusKm);
        return clusters.map((cluster, idx) => ({
            id: idx,
            center: this._calculateCenter(cluster),
            radius: radiusKm * 1000,
            severity: Math.min(5, Math.ceil((cluster.length / incidents.length) * 5)),
            incidentCount: cluster.length,
            riskScore: this._calculateRiskScore(cluster),
        }));
    }

    _clusterIncidents(incidents, radiusKm) {
        const clusters = [];
        const used = new Set();

        for (let i = 0; i < incidents.length; i++) {
            if (used.has(i)) continue;

            const cluster = [incidents[i]];
            used.add(i);

            for (let j = i + 1; j < incidents.length; j++) {
                if (used.has(j)) continue;

                const distance = incidents[i].coords.distanceTo(incidents[j].coords);
                if (distance <= radiusKm) {
                    cluster.push(incidents[j]);
                    used.add(j);
                }
            }

            clusters.push(cluster);
        }

        return clusters;
    }

    _calculateCenter(cluster) {
        const sumLat = cluster.reduce((sum, inc) => sum + inc.coords.lat, 0);
        const sumLng = cluster.reduce((sum, inc) => sum + inc.coords.lng, 0);
        return {
            lat: sumLat / cluster.length,
            lng: sumLng / cluster.length,
        };
    }

    _calculateRiskScore(cluster) {
        const severityMap = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 5 };
        const totalSeverity = cluster.reduce((sum, inc) => sum + (severityMap[inc.severity] || 0), 0);
        const recencyScore = cluster.reduce((sum, inc) => {
            const ageHours = (Date.now() - inc.createdAt.getTime()) / (1000 * 60 * 60);
            return sum + (100 / Math.max(1, ageHours));
        }, 0);

        return Math.min(100, (totalSeverity * 10) + (recencyScore * 0.5));
    }
}

// ==================== NEAREST INCIDENT FINDER ====================

export class NearestIncidentFinder {
    /**
     * Find nearest incidents using KD-Tree
     * @param {KDTree} kdTree - Built KD-Tree
     * @param {Coordinate} location
     * @param {number} k - Number of incidents
     * @returns {Array<TrafficIncident>}
     */
    findNearest(kdTree, location, k = 10) {
        return kdTree.findKNearest(location, k);
    }
}