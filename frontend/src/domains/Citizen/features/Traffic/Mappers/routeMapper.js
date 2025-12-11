import { Route } from "@/domains/Citizen/features/Traffic/Models/Route.js";
import { ExplorationStep } from "@/domains/Citizen/features/Traffic/Models/ExplorationStep.js";
import { GraphNode } from "@/domains/Citizen/features/Traffic/Models/GraphNode.js";

/**
 * Route Mapper
 * Transforms API response → Domain models
 *
 * ✅ Handles various API response formats
 * ✅ Validates data integrity
 * ✅ Provides helpful error messages
 */
export const routeMapper = {
    /**
     * Main mapping function: API data → Route domain model
     */
    toDomain(apiData) {
        console.log('🔄 Mapping API response to domain model...');
        console.log('   API Data:', apiData);

        // ✅ STEP 1: Validate input
        if (!apiData) {
            throw new Error('Route API data is null or undefined');
        }

        // ✅ STEP 2: Check success flag
        if (apiData.success === false) {
            const errorMsg = apiData.error || 'Unknown error';
            console.error('❌ Backend returned error:', errorMsg);
            throw new Error(errorMsg);
        }

        // ✅ STEP 3: Validate node details
        if (!apiData.nodeDetails || apiData.nodeDetails.length < 2) {
            const nodeCount = apiData.nodeDetails?.length || 0;
            console.error(`❌ Invalid route: ${nodeCount} nodes (need at least 2)`);
            throw new Error(`Invalid route: ${nodeCount} nodes (need at least 2)`);
        }

        // ✅ STEP 4: Validate path exists
        if (!apiData.path || apiData.path.length < 2) {
            const pathLength = apiData.path?.length || 0;
            console.error(`❌ Invalid path: ${pathLength} nodes (need at least 2)`);
            throw new Error(`Invalid path: ${pathLength} nodes (need at least 2)`);
        }

        // ✅ STEP 5: Map exploration steps
        const explorationSteps = this._mapExplorationSteps(
            apiData.explorationSteps || []
        );

        // ✅ STEP 6: Map node details
        const nodeDetails = this._mapNodeDetails(apiData.nodeDetails || []);

        // ✅ STEP 7: Create path geometry
        const pathGeometry = this._createPathGeometry(nodeDetails);

        // ✅ STEP 8: Format distances and times
        const formattedDistance = apiData.formattedDistance ||
            this._formatDistance(apiData.totalDistance);

        const formattedTime = apiData.formattedTime ||
            this._formatTime(apiData.totalTime);

        console.log('✅ Mapping successful');

        // ✅ STEP 9: Create and return Route object
        return new Route({
            algorithm: apiData.algorithm || 'dijkstra',
            explorationSteps: explorationSteps,
            nodeDetails: nodeDetails,
            totalDistance: apiData.totalDistance || 0,
            totalTime: apiData.totalTime || 0,
            formattedDistance: formattedDistance,
            formattedTime: formattedTime,
            iterations: apiData.algorithmIterations || apiData.iterations || 0,
            pathGeometry: pathGeometry
        });
    },

    /**
     * Map exploration steps from API
     */
    _mapExplorationSteps(steps) {
        if (!Array.isArray(steps)) {
            console.warn('⚠️ explorationSteps is not an array');
            return [];
        }

        return steps.map((step, index) => {
            const nodeData = step.node || {};

            return new ExplorationStep({
                stepNumber: step.step !== undefined ? step.step : index,
                action: step.action || 'VISIT',
                node: new GraphNode({
                    id: nodeData.nodeId || nodeData.id,
                    lat: nodeData.lat || 0,
                    lng: nodeData.lng || 0,
                    nodeName: nodeData.nodeName || nodeData.name ||
                        `Node ${nodeData.nodeId || nodeData.id}`,
                    locationName: nodeData.locationName
                }),
                distance: step.distance || 0,
                timestamp: step.timestamp || Date.now()
            });
        });
    },

    /**
     * Map node details from API
     */
    _mapNodeDetails(nodes) {
        if (!Array.isArray(nodes)) {
            console.warn('⚠️ nodeDetails is not an array');
            return [];
        }

        return nodes.map(node => {
            // Handle different field name formats from API
            const nodeId = node.nodeId || node.id;
            const nodeName = node.nodeName || node.name || node.locationName;
            const lat = node.lat;
            const lng = node.lng;

            if (lat === undefined || lng === undefined) {
                console.warn('⚠️ Node missing coordinates:', node);
            }

            return new GraphNode({
                id: nodeId,
                nodeId: nodeId,
                lat: lat || 0,
                lng: lng || 0,
                nodeName: nodeName || `Node ${nodeId}`,
                name: nodeName || `Node ${nodeId}`,
                locationName: node.locationName,
                congestionLevel: node.congestionLevel || 0,
                isBlocked: node.isBlocked || false
            });
        });
    },

    /**
     * Create path geometry (GeoJSON LineString)
     */
    _createPathGeometry(nodeDetails) {
        if (!nodeDetails || nodeDetails.length < 2) {
            return null;
        }

        const coordinates = nodeDetails.map(node => [node.lng, node.lat]);

        return {
            type: 'LineString',
            coordinates: coordinates
        };
    },

    /**
     * Format distance (meters → km or m)
     */
    _formatDistance(meters) {
        if (!meters || meters <= 0) {
            return '0 m';
        }

        if (meters >= 1000) {
            return (meters / 1000).toFixed(2) + ' km';
        }

        return Math.round(meters) + ' m';
    },

    /**
     * Format time (seconds → mins:secs or just secs)
     */
    _formatTime(seconds) {
        if (!seconds || seconds <= 0) {
            return '0 s';
        }

        if (seconds >= 60) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.round(seconds % 60);

            if (secs === 0) {
                return mins + ' min';
            }

            return mins + 'm ' + secs + 's';
        }

        return Math.round(seconds) + ' s';
    },

    /**
     * Validate entire route object (for QA)
     */
    validateRoute(route) {
        const issues = [];

        // Check basic structure
        if (!route) {
            issues.push('Route object is null');
            return { valid: false, issues };
        }

        // Check nodes
        if (!route.nodeDetails || route.nodeDetails.length < 2) {
            issues.push(`Invalid node count: ${route.nodeDetails?.length || 0}`);
        }

        // Check coordinates
        route.nodeDetails?.forEach((node, idx) => {
            if (typeof node.lat !== 'number' || typeof node.lng !== 'number') {
                issues.push(`Node ${idx} has invalid coordinates`);
            }

            if (node.lat < -90 || node.lat > 90) {
                issues.push(`Node ${idx} has invalid latitude: ${node.lat}`);
            }

            if (node.lng < -180 || node.lng > 180) {
                issues.push(`Node ${idx} has invalid longitude: ${node.lng}`);
            }
        });

        // Check distance
        if (route.totalDistance < 0) {
            issues.push(`Invalid distance: ${route.totalDistance}`);
        }

        // Check algorithm
        if (!['dijkstra', 'astar'].includes(route.algorithm?.toLowerCase())) {
            issues.push(`Unknown algorithm: ${route.algorithm}`);
        }

        return {
            valid: issues.length === 0,
            issues: issues
        };
    }
};

export default routeMapper;