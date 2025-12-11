import { useEffect, useCallback, useRef } from 'react';
import DSAService from "@/domains/Citizen/features/Traffic/Services/DSAService.js";

/**
 * RouteVisualizer - WITH EXPLORATION EDGE ANIMATION
 * ✅ Shows algorithm exploring process with colored edges
 * ✅ Final path in YELLOW
 */
const RouteVisualizer = ({ map, route, allNodes }) => {
    const mapRef = useRef(map);
    const animationRef = useRef(null);
    const exploredEdges = useRef(new Set()); // Track explored edges

    useEffect(() => {
        mapRef.current = map;
    }, [map]);

    /**
     * Main visualization sequence
     */
    useEffect(() => {
        if (!map || !route) return;

        console.log('🎬 Starting visualization with exploration edges...');

        const visualize = async () => {
            // Clear previous state
            exploredEdges.current.clear();

            // Phase 1: Draw gray graph structure
            await drawGraphStructure();

            // Phase 2: Animate exploration WITH EDGES
            if (route.explorationSteps?.length > 0) {
                await animateExplorationWithEdges();
            }

            // Phase 3: Draw final YELLOW path
            await drawFinalPath();
        };

        visualize();

        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
            cleanup();
        };
    }, [map, route, allNodes]);

    /**
     * Phase 1: Draw all edges and nodes (GRAY)
     */
    const drawGraphStructure = useCallback(async () => {
        if (!mapRef.current) return;

        console.log('🕸️ Drawing gray graph structure...');

        try {
            const edges = await DSAService.getGraphEdges();
            console.log('✅ Loaded', edges.length, 'edges');

            // Draw edges as GRAY lines
            drawAllEdges(edges, '#CCCCCC', 1, 0.3);

            // Draw nodes as GRAY circles
            drawAllNodes(allNodes || []);

        } catch (error) {
            console.warn('⚠️ Could not load edges:', error);
            drawAllNodes(allNodes || []);
        }
    }, [allNodes]);

    /**
     * Draw edges with custom style
     */
    const drawAllEdges = useCallback((edges, color, width, opacity) => {
        if (!mapRef.current || !edges || edges.length === 0) return;

        const sourceId = `edges-${color}`;
        const layerId = `edges-layer-${color}`;

        // Remove old layer
        if (mapRef.current.getLayer(layerId)) {
            mapRef.current.removeLayer(layerId);
        }
        if (mapRef.current.getSource(sourceId)) {
            mapRef.current.removeSource(sourceId);
        }

        const features = edges.map(edge => ({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [
                    [edge.from.lng, edge.from.lat],
                    [edge.to.lng, edge.to.lat]
                ]
            },
            properties: {
                distance: edge.distance
            }
        }));

        mapRef.current.addSource(sourceId, {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: features
            }
        });

        mapRef.current.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            paint: {
                'line-color': color,
                'line-width': width,
                'line-opacity': opacity
            }
        });

        console.log(`✅ Drew ${edges.length} edges in ${color}`);
    }, []);

    /**
     * Draw all nodes (GRAY)
     */
    const drawAllNodes = useCallback((nodeList) => {
        if (!mapRef.current || !nodeList || nodeList.length === 0) return;

        if (mapRef.current.getLayer('all-nodes-layer')) {
            mapRef.current.removeLayer('all-nodes-layer');
        }
        if (mapRef.current.getSource('all-nodes')) {
            mapRef.current.removeSource('all-nodes');
        }

        const features = nodeList.map(node => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [node.lng, node.lat]
            },
            properties: {
                id: node.id,
                name: node.nodeName || node.name
            }
        }));

        mapRef.current.addSource('all-nodes', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: features
            }
        });

        mapRef.current.addLayer({
            id: 'all-nodes-layer',
            type: 'circle',
            source: 'all-nodes',
            paint: {
                'circle-radius': 4,
                'circle-color': '#CCCCCC',
                'circle-opacity': 0.6,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#888888'
            }
        });

        console.log('✅ Drew', nodeList.length, 'gray nodes');
    }, []);

    /**
     * Phase 2: Animate exploration WITH EDGES
     * ✅ Draw edge from previous → current when exploring
     */
    const animateExplorationWithEdges = useCallback(() => {
        return new Promise((resolve) => {
            if (!mapRef.current || !route.explorationSteps) {
                resolve();
                return;
            }

            const steps = route.explorationSteps;
            const algorithmColor = route.algorithm === 'Dijkstra' ? '#3B82F6' : '#10B981';

            let currentStep = 0;
            let previousNode = null;

            const animate = () => {
                if (currentStep >= steps.length) {
                    console.log('✅ Exploration animation complete');
                    resolve();
                    return;
                }

                const step = steps[currentStep];
                const currentNode = step.node;

                // Draw exploration edge from previous → current
                if (previousNode && currentNode) {
                    const edgeKey = `${previousNode.id}-${currentNode.id}`;

                    // Don't redraw same edge
                    if (!exploredEdges.current.has(edgeKey)) {
                        drawExplorationEdge(previousNode, currentNode, algorithmColor);
                        exploredEdges.current.add(edgeKey);
                    }
                }

                // Draw exploration node
                const radius = step.action === 'START' ? 14 :
                    step.action === 'VISIT' ? 8 : 6;
                drawExplorationNode(currentNode, algorithmColor, radius);

                // Update previous node
                if (step.action !== 'SKIP') {
                    previousNode = currentNode;
                }

                currentStep++;
                animationRef.current = setTimeout(animate, 80);
            };

            console.log('🎬 Starting edge exploration animation:', steps.length, 'steps');
            animate();
        });
    }, [route]);

    /**
     * Draw exploration edge (BLUE/GREEN during search)
     */
    const drawExplorationEdge = useCallback((fromNode, toNode, color) => {
        if (!mapRef.current || !fromNode || !toNode) return;

        const sourceId = `exploration-edge-${fromNode.id}-${toNode.id}`;
        const layerId = `exploration-edge-layer-${fromNode.id}-${toNode.id}`;

        // Remove if exists
        if (mapRef.current.getLayer(layerId)) {
            mapRef.current.removeLayer(layerId);
        }
        if (mapRef.current.getSource(sourceId)) {
            mapRef.current.removeSource(sourceId);
        }

        mapRef.current.addSource(sourceId, {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [fromNode.lng, fromNode.lat],
                        [toNode.lng, toNode.lat]
                    ]
                }
            }
        });

        mapRef.current.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            paint: {
                'line-color': color,
                'line-width': 3,
                'line-opacity': 0.6
            }
        });
    }, []);

    /**
     * Draw exploration node (BLUE/GREEN circle)
     */
    const drawExplorationNode = useCallback((node, color, radius) => {
        if (!mapRef.current || !node) return;

        const sourceId = `exploration-${node.id}`;
        const layerId = `exploration-layer-${node.id}`;

        if (mapRef.current.getLayer(layerId)) {
            mapRef.current.removeLayer(layerId);
        }
        if (mapRef.current.getSource(sourceId)) {
            mapRef.current.removeSource(sourceId);
        }

        mapRef.current.addSource(sourceId, {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [node.lng, node.lat]
                }
            }
        });

        mapRef.current.addLayer({
            id: layerId,
            type: 'circle',
            source: sourceId,
            paint: {
                'circle-radius': radius,
                'circle-color': color,
                'circle-opacity': 0.8,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#FFFFFF'
            }
        });
    }, []);

    /**
     * Phase 3: Draw final path (YELLOW)
     */
    const drawFinalPath = useCallback(() => {
        return new Promise((resolve) => {
            if (!mapRef.current || !route) {
                resolve();
                return;
            }

            const coordinates = route.getPathCoordinates();
            const YELLOW = '#FACC15'; // ✅ YELLOW for final path

            // Remove old layer
            if (mapRef.current.getLayer('final-path-glow')) {
                mapRef.current.removeLayer('final-path-glow');
            }
            if (mapRef.current.getLayer('final-path-layer')) {
                mapRef.current.removeLayer('final-path-layer');
            }
            if (mapRef.current.getSource('final-path')) {
                mapRef.current.removeSource('final-path');
            }

            mapRef.current.addSource('final-path', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates
                    }
                }
            });

            // Glow layer
            mapRef.current.addLayer({
                id: 'final-path-glow',
                type: 'line',
                source: 'final-path',
                paint: {
                    'line-color': YELLOW,
                    'line-width': 12,
                    'line-opacity': 0.3,
                    'line-blur': 4
                }
            });

            // Main path
            mapRef.current.addLayer({
                id: 'final-path-layer',
                type: 'line',
                source: 'final-path',
                paint: {
                    'line-color': YELLOW,
                    'line-width': 6,
                    'line-opacity': 1
                }
            });

            // Start/End markers
            drawStartEndMarkers();

            console.log('✅ Final YELLOW path drawn');
            resolve();
        });
    }, [route]);

    /**
     * Draw start (GREEN) and end (RED) markers
     */
    const drawStartEndMarkers = useCallback(() => {
        if (!mapRef.current || !route?.nodeDetails) return;

        const startNode = route.nodeDetails[0];
        const endNode = route.nodeDetails[route.nodeDetails.length - 1];

        // Start marker (GREEN)
        drawMarker(startNode, 'start-marker', '#22C55E', '🟢');

        // End marker (RED)
        drawMarker(endNode, 'end-marker', '#EF4444', '🔴');
    }, [route]);

    /**
     * Draw marker with icon
     */
    const drawMarker = useCallback((node, id, color, icon) => {
        if (!mapRef.current || !node) return;

        const sourceId = `${id}-source`;
        const layerId = `${id}-layer`;

        if (mapRef.current.getLayer(layerId)) {
            mapRef.current.removeLayer(layerId);
        }
        if (mapRef.current.getSource(sourceId)) {
            mapRef.current.removeSource(sourceId);
        }

        mapRef.current.addSource(sourceId, {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [node.lng, node.lat]
                }
            }
        });

        mapRef.current.addLayer({
            id: layerId,
            type: 'circle',
            source: sourceId,
            paint: {
                'circle-radius': 16,
                'circle-color': color,
                'circle-opacity': 0.9,
                'circle-stroke-width': 3,
                'circle-stroke-color': '#FFFFFF'
            }
        });
    }, []);

    /**
     * Cleanup all layers
     */
    const cleanup = useCallback(() => {
        if (!mapRef.current) return;

        const layersToRemove = [
            'all-edges-layer',
            'all-nodes-layer',
            'final-path-glow',
            'final-path-layer',
            'start-marker-layer',
            'end-marker-layer'
        ];

        const sourcesToRemove = [
            'all-edges',
            'all-nodes',
            'final-path',
            'start-marker-source',
            'end-marker-source'
        ];

        layersToRemove.forEach(layerId => {
            if (mapRef.current.getLayer(layerId)) {
                mapRef.current.removeLayer(layerId);
            }
        });

        sourcesToRemove.forEach(sourceId => {
            if (mapRef.current.getSource(sourceId)) {
                mapRef.current.removeSource(sourceId);
            }
        });

        // Clean exploration edges
        exploredEdges.current.forEach(edgeKey => {
            const [fromId, toId] = edgeKey.split('-');
            const layerId = `exploration-edge-layer-${fromId}-${toId}`;
            const sourceId = `exploration-edge-${fromId}-${toId}`;

            if (mapRef.current.getLayer(layerId)) {
                mapRef.current.removeLayer(layerId);
            }
            if (mapRef.current.getSource(sourceId)) {
                mapRef.current.removeSource(sourceId);
            }
        });

        // Clean exploration nodes
        if (route?.explorationSteps) {
            route.explorationSteps.forEach(step => {
                const layerId = `exploration-layer-${step.node.id}`;
                const sourceId = `exploration-${step.node.id}`;

                if (mapRef.current.getLayer(layerId)) {
                    mapRef.current.removeLayer(layerId);
                }
                if (mapRef.current.getSource(sourceId)) {
                    mapRef.current.removeSource(sourceId);
                }
            });
        }
    }, [route]);

    return null;
};

export default RouteVisualizer;