/**
 * React Custom Hooks
 * Quản lý state, API calls và DSA logic
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import APIService from "@/domains/Citizen/features/Traffic/Test/APIService.js";
import {
    TrafficIncident,
    TrafficNode,
    TrafficEdge,
    TrafficReport,
    Route,
    Blackspot,
    AlgorithmComparison,
    ValidationReport,
} from './Models';
import {
    TrafficGraph,
    KDTree,
    LRUCache
} from "@/domains/Citizen/features/Traffic/Test/DSAStructure.js";
import {
    RoutingStrategyService,
    BlackspotDetector,
    NearestIncidentFinder
} from "@/domains/Citizen/features/Traffic/Test/Algorithms.js";

// ==================== useTrafficData Hook ====================

export const useTrafficData = (options = {}) => {
    const { useMock = false, autoFetch = true, onIncidentClick = null } = options;
    const [incidents, setIncidents] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [blackspots, setBlackspots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [dataSourceName, setDataSourceName] = useState('Unknown');
    const graphRef = useRef(null);
    const kdTreeRef = useRef(null);

    useEffect(() => {
        if (!autoFetch) return;

        const fetchTrafficData = async () => {
            try {
                setLoading(true);
                const data = await APIService.getTrafficMap();

                // Convert DTOs to Models
                const incidentModels = (data.incidents || []).map(inc => new TrafficIncident(inc));
                const nodeModels = (data.nodes || []).map(node => new TrafficNode(node));
                const edgeModels = (data.edges || []).map(edge => new TrafficEdge(edge));

                setIncidents(incidentModels);
                setNodes(nodeModels);
                setEdges(edgeModels);

                // Build graph
                const graph = new TrafficGraph(nodeModels, edgeModels);
                graphRef.current = graph;

                // Build KD-Tree for spatial queries
                const kdTree = new KDTree(incidentModels);
                kdTreeRef.current = kdTree;

                // Detect blackspots
                const detector = new BlackspotDetector();
                const spots = detector.detectBlackspots(incidentModels);
                setBlackspots(spots);

                setDataSourceName(data.dataSourceName || 'API');
                setIsReady(true);
                setError(null);
            } catch (err) {
                console.error('Error fetching traffic data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrafficData();
    }, [autoFetch]);

    return {
        incidents,
        nodes,
        edges,
        blackspots,
        graph: graphRef.current,
        kdTree: kdTreeRef.current,
        loading,
        error,
        isReady,
        dataSourceName,
    };
};

// ==================== useRouteFinding Hook ====================

export const useRouteFinding = (graph) => {
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [comparison, setComparison] = useState(null);
    const [explorationSteps, setExplorationSteps] = useState([]);
    const routeCacheRef = useRef(new LRUCache(50));
    const strategyServiceRef = useRef(new RoutingStrategyService());

    const findRoute = useCallback(
        async (startCoord, endCoord, algorithm = 'DIJKSTRA', decorator = 'NONE') => {
            if (!graph) {
                setError('Graph not ready');
                return;
            }

            try {
                setLoading(true);

                // Check cache
                const cacheKey = `${startCoord.lat},${startCoord.lng}-${endCoord.lat},${endCoord.lng}-${algorithm}`;
                const cached = routeCacheRef.current.get(cacheKey);
                if (cached) {
                    setRoute(cached);
                    setError(null);
                    setLoading(false);
                    return cached;
                }

                // Find nearest nodes
                const startNode = graph.findNearestNode(startCoord);
                const endNode = graph.findNearestNode(endCoord);

                if (!startNode || !endNode) {
                    throw new Error('Could not find suitable nodes for route');
                }

                // Find route using selected algorithm
                const result = strategyServiceRef.current.findRoute(
                    graph,
                    startNode.id,
                    endNode.id,
                    algorithm
                );

                // Get node coordinates for geometry
                const geometry = result.path.map(nodeId => graph.getNode(nodeId)?.coords);
                const routeModel = new Route({
                    startCoord,
                    endCoord,
                    distance: result.distance,
                    estimatedTime: (result.distance / 50) * 60,
                    nodeIds: result.path,
                    geometry,
                    algorithm,
                    decorator,
                });

                // Cache result
                routeCacheRef.current.set(cacheKey, routeModel);
                setRoute(routeModel);
                setExplorationSteps(result.explorationSteps || []);
                setError(null);

                return routeModel;
            } catch (err) {
                console.error('Route finding error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        },
        [graph]
    );

    const compareAlgorithms = useCallback(
        async (startCoord, endCoord) => {
            if (!graph) {
                setError('Graph not ready');
                return;
            }

            try {
                setLoading(true);

                const startNode = graph.findNearestNode(startCoord);
                const endNode = graph.findNearestNode(endCoord);

                if (!startNode || !endNode) {
                    throw new Error('Could not find suitable nodes');
                }

                const result = strategyServiceRef.current.compareAlgorithms(
                    graph,
                    startNode.id,
                    endNode.id
                );

                const comparisonModel = new AlgorithmComparison({
                    algorithms: result.algorithms,
                    startNode: startNode.id,
                    endNode: endNode.id,
                });

                setComparison(comparisonModel);
                setError(null);

                return comparisonModel;
            } catch (err) {
                console.error('Algorithm comparison error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        },
        [graph]
    );

    return {
        route,
        comparison,
        explorationSteps,
        loading,
        error,
        findRoute,
        compareAlgorithms,
        cacheStats: routeCacheRef.current.getStats(),
    };
};

// ==================== useNearestIncidents Hook ====================

export const useNearestIncidents = (kdTree, incidents) => {
    const [nearest, setNearest] = useState([]);
    const [loading, setLoading] = useState(false);

    const findNearest = useCallback(
        (coordinate, k = 10) => {
            if (!kdTree) {
                console.warn('KD-Tree not ready');
                return;
            }

            setLoading(true);
            try {
                const nearestNodes = kdTree.findKNearest(coordinate, k);
                const nearestIncidents = nearestNodes.map(node =>
                    incidents.find(inc => inc.id === node.id)
                ).filter(Boolean);

                setNearest(nearestIncidents);
            } finally {
                setLoading(false);
            }
        },
        [kdTree, incidents]
    );

    return { nearest, loading, findNearest };
};

// ==================== useBlackspots Hook ====================

export const useBlackspots = (kdTree, incidents) => {
    const [blackspots, setBlackspots] = useState([]);
    const [loading, setLoading] = useState(false);

    const findBlackspots = useCallback(
        (coordinate, radiusKm = 5) => {
            if (!kdTree) return;

            setLoading(true);
            try {
                const nearby = kdTree.rangeSearch(coordinate, radiusKm);
                const detector = new BlackspotDetector();
                const detectedSpots = detector.detectBlackspots(
                    nearby.map(node => incidents.find(inc => inc.id === node.id)).filter(Boolean),
                    radiusKm / 5
                );

                setBlackspots(detectedSpots);
            } finally {
                setLoading(false);
            }
        },
        [kdTree, incidents]
    );

    return { blackspots, loading, findBlackspots };
};

// ==================== useTrafficReports Hook ====================

export const useTrafficReports = () => {
    const [reports, setReports] = useState([]);
    const [pendingReports, setPendingReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReports = useCallback(async (page = 0, size = 20) => {
        try {
            setLoading(true);
            const data = await APIService.getReports(page, size);
            const reportModels = data.map(report => new TrafficReport(report));
            setReports(reportModels);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPendingReports = useCallback(async () => {
        try {
            setLoading(true);
            const data = await APIService.getPendingReports();
            const reportModels = data.map(report => new TrafficReport(report));
            setPendingReports(reportModels);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const createReport = useCallback(async (reportData) => {
        try {
            const response = await APIService.createReport(reportData);
            return new TrafficReport(response);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const approveReport = useCallback(async (reportId) => {
        try {
            const response = await APIService.approveReport(reportId);
            return new TrafficReport(response);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const rejectReport = useCallback(async (reportId, reason) => {
        try {
            const response = await APIService.rejectReport(reportId, reason);
            return new TrafficReport(response);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    return {
        reports,
        pendingReports,
        loading,
        error,
        fetchReports,
        fetchPendingReports,
        createReport,
        approveReport,
        rejectReport,
    };
};

// ==================== useValidationReport Hook ====================

export const useValidationReport = () => {
    const [validationReport, setValidationReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchValidationReport = useCallback(async () => {
        try {
            setLoading(true);
            const data = await APIService.getValidationReport();
            setValidationReport(new ValidationReport(data));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        validationReport,
        loading,
        error,
        fetchValidationReport,
    };
};

// ==================== useAdminStats Hook ====================

export const useAdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const data = await APIService.getAdminStats();
            setStats(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        stats,
        loading,
        error,
        fetchStats,
    };
};