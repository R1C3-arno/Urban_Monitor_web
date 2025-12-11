import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as maptilersdk from "@maptiler/sdk";
import DSAService from "@/domains/Citizen/features/Traffic/Services/DSAService.js";
import DesignPatternsShowcase from "@/domains/Citizen/features/Traffic/Components/Test/DesignPatternsShowcase.jsx";

/**
 * 🗺️ DESIGN PATTERNS MAP VISUALIZATION
 *
 * Thể hiện TẤT CẢ design patterns trên bản đồ:
 *
 * 1. 🎯 STRATEGY PATTERN - Dijkstra vs A* paths (màu khác nhau)
 * 2. 🌳 KD-TREE - Nearest incidents (vòng tròn)
 * 3. 🔥 BLACKSPOT - Accident clusters (marker đỏ)
 * 4. 📊 GRAPH - Nodes & edges (network visualization)
 * 5. 🔄 STATE - Report markers (màu theo state)
 * 6. ⚡ CACHE - Cached routes (highlight)
 */

const DesignPatternsMapDemo = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [loading, setLoading] = useState(false);
    const [activePattern, setActivePattern] = useState(null);
    const [stats, setStats] = useState(null);

    maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    // Initialize map
    useEffect(() => {
        if (map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://api.maptiler.com/maps/0196d23d-6773-76c9-9909-12b393279a7b/style.json?key=Ak2018xBFFEm6Mi85vDZ',
            center: [106.70, 10.77], // HCMC
            zoom: 13
        });

        map.current.on('load', () => {
            console.log('✅ Map loaded');
        });

        return () => {
            if (map.current) {
                map.current.remove();
            }
        };
    }, []);

    // ═══════════════════════════════════════════════════════════
    // 1. STRATEGY PATTERN - Show Dijkstra vs A* paths
    // ═══════════════════════════════════════════════════════════

    const showStrategyPattern = async () => {
        setLoading(true);
        setActivePattern('strategy');

        try {
            // Clear previous layers
            clearAllLayers();

            // 1. Seed graph
            const response = await fetch('http://localhost:8080/api/traffic/seed-enhanced-graph', {
                method: 'POST'
            });
            const seedResult = await response.json();

            // 2. Get nodes
            const nodesResp = await fetch('http://localhost:8080/api/traffic/graph-nodes');
            const nodes = await nodesResp.json();

            if (nodes.length < 2) {
                alert('Not enough nodes');
                return;
            }

            // 3. Draw all nodes
            nodes.forEach(node => {
                new maplibregl.Marker({ color: '#94A3B8' })
                    .setLngLat([node.lng, node.lat])
                    .setPopup(new maplibregl.Popup().setHTML(`
                        <strong>Node ${node.id}</strong><br>
                        ${node.nodeName}
                    `))
                    .addTo(map.current);
            });

            // 4. Find routes with both algorithms
            const startId = nodes[0].id;
            const endId = nodes[nodes.length - 1].id;

            // Dijkstra route
            const dijkstraResp = await fetch(
                `http://localhost:8080/citizen/routes/find?start=${startId}&end=${endId}&algorithm=dijkstra`
            );
            const dijkstraRoute = await dijkstraResp.json();

            // A* route
            const astarResp = await fetch(
                `http://localhost:8080/citizen/routes/find?start=${startId}&end=${endId}&algorithm=astar`
            );
            const astarRoute = await astarResp.json();

            // 5. Draw Dijkstra path (BLUE)
            if (dijkstraRoute.success && dijkstraRoute.nodeDetails) {
                const dijkstraCoords = dijkstraRoute.nodeDetails.map(n => [n.lng, n.lat]);

                map.current.addSource('dijkstra-route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: dijkstraCoords
                        }
                    }
                });

                map.current.addLayer({
                    id: 'dijkstra-route-layer',
                    type: 'line',
                    source: 'dijkstra-route',
                    paint: {
                        'line-color': '#3B82F6',
                        'line-width': 4,
                        'line-opacity': 0.8
                    }
                });

                // Start marker
                new maplibregl.Marker({ color: '#3B82F6' })
                    .setLngLat(dijkstraCoords[0])
                    .setPopup(new maplibregl.Popup().setHTML('<strong>🔵 Dijkstra Start</strong>'))
                    .addTo(map.current);

                // End marker
                new maplibregl.Marker({ color: '#3B82F6' })
                    .setLngLat(dijkstraCoords[dijkstraCoords.length - 1])
                    .setPopup(new maplibregl.Popup().setHTML('<strong>🔵 Dijkstra End</strong>'))
                    .addTo(map.current);
            }

            // 6. Draw A* path (GREEN)
            if (astarRoute.success && astarRoute.nodeDetails) {
                const astarCoords = astarRoute.nodeDetails.map(n => [n.lng, n.lat]);

                map.current.addSource('astar-route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: astarCoords
                        }
                    }
                });

                map.current.addLayer({
                    id: 'astar-route-layer',
                    type: 'line',
                    source: 'astar-route',
                    paint: {
                        'line-color': '#10B981',
                        'line-width': 4,
                        'line-opacity': 0.6
                    }
                });
            }

            // 7. Fit bounds
            const bounds = new maplibregl.LngLatBounds();
            nodes.forEach(n => bounds.extend([n.lng, n.lat]));
            map.current.fitBounds(bounds, { padding: 50 });

            setStats({
                pattern: 'Strategy Pattern',
                nodes: nodes.length,
                dijkstra: {
                    iterations: dijkstraRoute.algorithmIterations,
                    distance: dijkstraRoute.totalDistance,
                    color: '🔵 Blue'
                },
                astar: {
                    iterations: astarRoute.algorithmIterations,
                    distance: astarRoute.totalDistance,
                    color: '🟢 Green'
                }
            });

        } catch (err) {
            console.error('❌ Error:', err);
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // ═══════════════════════════════════════════════════════════
    // 2. KD-TREE - Show nearest incidents
    // ═══════════════════════════════════════════════════════════

    const showKDTree = async () => {
        setLoading(true);
        setActivePattern('kdtree');

        try {
            clearAllLayers();

            // 1. Get all incidents
            const incidentsResp = await fetch('http://localhost:8080/api/traffic/incidents');
            const incidents = await incidentsResp.json();

            // Draw all incidents (gray)
            incidents.forEach(incident => {
                new maplibregl.Marker({ color: '#94A3B8' })
                    .setLngLat([incident.lng, incident.lat])
                    .setPopup(new maplibregl.Popup().setHTML(`
                        <strong>${incident.type}</strong><br>
                        ${incident.description}
                    `))
                    .addTo(map.current);
            });

            // 2. Query point (center of map)
            const center = map.current.getCenter();
            const queryLat = center.lat;
            const queryLng = center.lng;

            // Query marker (purple)
            new maplibregl.Marker({ color: '#8B5CF6' })
                .setLngLat([queryLng, queryLat])
                .setPopup(new maplibregl.Popup().setHTML('<strong>📍 Query Point</strong>'))
                .addTo(map.current);

            // 3. Find K nearest using KD-Tree
            const nearestResp = await fetch(
                `http://localhost:8080/api/traffic/incidents/nearest?lat=${queryLat}&lng=${queryLng}&k=5`
            );
            const nearest = await nearestResp.json();

            // 4. Draw nearest incidents (red) and circles
            nearest.forEach((item, index) => {
                const incident = item.incident;

                // Red marker
                new maplibregl.Marker({ color: '#EF4444' })
                    .setLngLat([incident.lng, incident.lat])
                    .setPopup(new maplibregl.Popup().setHTML(`
                        <strong>#${index + 1} Nearest</strong><br>
                        Distance: ${item.distance.toFixed(2)} km<br>
                        ${incident.description}
                    `))
                    .addTo(map.current);

                // Circle around query point
                const radiusInMeters = item.distance * 1000;
                map.current.addSource(`circle-${index}`, {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [queryLng, queryLat]
                        }
                    }
                });

                map.current.addLayer({
                    id: `circle-layer-${index}`,
                    type: 'circle',
                    source: `circle-${index}`,
                    paint: {
                        'circle-radius': {
                            stops: [
                                [0, 0],
                                [20, radiusInMeters / 10]
                            ],
                            base: 2
                        },
                        'circle-color': '#EF4444',
                        'circle-opacity': 0.1,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#EF4444',
                        'circle-stroke-opacity': 0.5
                    }
                });
            });

            setStats({
                pattern: 'KD-Tree Spatial Index',
                totalIncidents: incidents.length,
                queryPoint: `(${queryLat.toFixed(4)}, ${queryLng.toFixed(4)})`,
                nearest: nearest.length,
                complexity: 'O(log n) search time',
                distances: nearest.map(n => `${n.distance.toFixed(2)} km`)
            });

        } catch (err) {
            console.error('❌ Error:', err);
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // ═══════════════════════════════════════════════════════════
    // 3. BLACKSPOT DETECTION - Show clusters
    // ═══════════════════════════════════════════════════════════

    const showBlackspots = async () => {
        setLoading(true);
        setActivePattern('blackspot');

        try {
            clearAllLayers();

            // 1. Get blackspots
            const blackspotsResp = await fetch('http://localhost:8080/api/traffic/blackspots?top=10');
            const blackspots = await blackspotsResp.json();

            // 2. Draw each blackspot
            blackspots.forEach((spot, index) => {
                // Marker size based on severity
                const size = Math.min(spot.severityScore / 10, 5);

                // Big red marker
                const el = document.createElement('div');
                el.className = 'blackspot-marker';
                el.style.width = `${30 + size * 10}px`;
                el.style.height = `${30 + size * 10}px`;
                el.style.borderRadius = '50%';
                el.style.background = `rgba(239, 68, 68, ${0.3 + size * 0.1})`;
                el.style.border = '3px solid #EF4444';
                el.innerHTML = `<div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-weight: bold;
                    font-size: 16px;
                ">${spot.incidentCount}</div>`;

                new maplibregl.Marker({ element: el })
                    .setLngLat([spot.centerLng, spot.centerLat])
                    .setPopup(new maplibregl.Popup().setHTML(`
                        <strong>🔥 Blackspot #${index + 1}</strong><br>
                        <strong>Incidents:</strong> ${spot.incidentCount}<br>
                        <strong>Severity:</strong> ${spot.severityScore.toFixed(1)}<br>
                        <strong>Radius:</strong> ${spot.radiusKm} km
                    `))
                    .addTo(map.current);

                // Draw circle around blackspot
                const radiusInMeters = spot.radiusKm * 1000;
                map.current.addSource(`blackspot-${index}`, {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [spot.centerLng, spot.centerLat]
                        }
                    }
                });

                map.current.addLayer({
                    id: `blackspot-layer-${index}`,
                    type: 'circle',
                    source: `blackspot-${index}`,
                    paint: {
                        'circle-radius': {
                            stops: [
                                [0, 0],
                                [20, radiusInMeters / 5]
                            ],
                            base: 2
                        },
                        'circle-color': '#DC2626',
                        'circle-opacity': 0.2,
                        'circle-stroke-width': 3,
                        'circle-stroke-color': '#DC2626',
                        'circle-stroke-opacity': 0.8
                    }
                });
            });

            // 3. Fit to blackspots
            if (blackspots.length > 0) {
                const bounds = new maplibregl.LngLatBounds();
                blackspots.forEach(s => bounds.extend([s.centerLng, s.centerLat]));
                map.current.fitBounds(bounds, { padding: 100 });
            }

            setStats({
                pattern: 'Blackspot Detection',
                algorithm: 'Grid-based clustering',
                found: blackspots.length,
                topBlackspot: blackspots[0] ? {
                    incidents: blackspots[0].incidentCount,
                    severity: blackspots[0].severityScore.toFixed(1)
                } : null
            });

        } catch (err) {
            console.error('❌ Error:', err);
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // ═══════════════════════════════════════════════════════════
    // 4. GRAPH STRUCTURE - Show nodes & edges
    // ═══════════════════════════════════════════════════════════

    const showGraphStructure = async () => {
        setLoading(true);
        setActivePattern('graph');

        try {
            clearAllLayers();

            // 1. Seed graph
            await fetch('http://localhost:8080/api/traffic/seed-enhanced-graph', {
                method: 'POST'
            });

            // 2. Get nodes
            const nodesResp = await fetch('http://localhost:8080/api/traffic/graph-nodes');
            const nodes = await nodesResp.json();

            // 3. Get edges
            const edgesResp = await fetch('http://localhost:8080/api/traffic/graph-edges');
            const edges = await edgesResp.json();

            // 4. Draw edges (gray lines)
            const edgeFeatures = edges.map(edge => ({
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [edge.fromNode.lng, edge.fromNode.lat],
                        [edge.toNode.lng, edge.toNode.lat]
                    ]
                },
                properties: {
                    distance: edge.distance,
                    roadName: edge.roadName
                }
            }));

            map.current.addSource('edges', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: edgeFeatures
                }
            });

            map.current.addLayer({
                id: 'edges-layer',
                type: 'line',
                source: 'edges',
                paint: {
                    'line-color': '#CBD5E1',
                    'line-width': 2,
                    'line-opacity': 0.6
                }
            });

            // 5. Draw nodes (blue circles)
            nodes.forEach(node => {
                new maplibregl.Marker({ color: '#3B82F6' })
                    .setLngLat([node.lng, node.lat])
                    .setPopup(new maplibregl.Popup().setHTML(`
                        <strong>Node ${node.id}</strong><br>
                        ${node.nodeName}<br>
                        Congestion: ${node.congestionLevel}%
                    `))
                    .addTo(map.current);
            });

            // 6. Fit bounds
            const bounds = new maplibregl.LngLatBounds();
            nodes.forEach(n => bounds.extend([n.lng, n.lat]));
            map.current.fitBounds(bounds, { padding: 50 });

            setStats({
                pattern: 'Graph Data Structure',
                nodes: nodes.length,
                edges: edges.length,
                avgDegree: (edges.length / nodes.length).toFixed(2),
                structure: 'Adjacency List'
            });

        } catch (err) {
            console.error('❌ Error:', err);
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // ═══════════════════════════════════════════════════════════
    // 5. STATE PATTERN - Show reports by state
    // ═══════════════════════════════════════════════════════════

    const showStatePattern = async () => {
        setLoading(true);
        setActivePattern('state');

        try {
            clearAllLayers();

            // 1. Get all reports
            const reportsResp = await fetch('http://localhost:8080/api/traffic/reports');
            const reports = await reportsResp.json();

            // 2. Draw reports with color based on state
            const stateColors = {
                'PENDING': '#F59E0B',    // Yellow
                'APPROVED': '#10B981',   // Green
                'REJECTED': '#EF4444'    // Red
            };

            reports.forEach(report => {
                const color = stateColors[report.status] || '#94A3B8';

                new maplibregl.Marker({ color })
                    .setLngLat([report.lng, report.lat])
                    .setPopup(new maplibregl.Popup().setHTML(`
                        <strong>Report #${report.id}</strong><br>
                        <strong>State:</strong> ${report.status}<br>
                        <strong>Location:</strong> ${report.location}<br>
                        ${report.description}
                    `))
                    .addTo(map.current);
            });

            // 3. Count by state
            const pending = reports.filter(r => r.status === 'PENDING').length;
            const approved = reports.filter(r => r.status === 'APPROVED').length;
            const rejected = reports.filter(r => r.status === 'REJECTED').length;

            setStats({
                pattern: 'State Pattern',
                total: reports.length,
                pending: `🟡 ${pending} (can approve/reject)`,
                approved: `🟢 ${approved} (final state)`,
                rejected: `🔴 ${rejected} (final state)`,
                workflow: 'PENDING → APPROVED/REJECTED'
            });

        } catch (err) {
            console.error('❌ Error:', err);
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper: Clear all layers and markers
    const clearAllLayers = () => {
        // Remove all layers
        const layers = map.current.getStyle().layers;
        layers.forEach(layer => {
            if (layer.id.includes('route') ||
                layer.id.includes('circle') ||
                layer.id.includes('blackspot') ||
                layer.id.includes('edges')) {
                map.current.removeLayer(layer.id);
            }
        });

        // Remove all sources
        const sources = Object.keys(map.current.getStyle().sources);
        sources.forEach(source => {
            if (source.includes('route') ||
                source.includes('circle') ||
                source.includes('blackspot') ||
                source.includes('edges')) {
                map.current.removeSource(source);
            }
        });

        // Remove markers (this is tricky, need to track them)
        document.querySelectorAll('.maplibregl-marker').forEach(marker => {
            marker.remove();
        });
    };

    // ═══════════════════════════════════════════════════════════
    // UI RENDERING
    // ═══════════════════════════════════════════════════════════

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Control Panel */}
            <div style={{
                background: 'white',
                padding: '15px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 1000
            }}>
                <h2 style={{ margin: '0 0 15px 0' }}>🗺️ Design Patterns Visualization</h2>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                        onClick={showStrategyPattern}
                        disabled={loading}
                        style={{
                            padding: '10px 15px',
                            background: activePattern === 'strategy' ? '#3B82F6' : '#E5E7EB',
                            color: activePattern === 'strategy' ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        🎯 Strategy Pattern
                    </button>

                    <button
                        onClick={showKDTree}
                        disabled={loading}
                        style={{
                            padding: '10px 15px',
                            background: activePattern === 'kdtree' ? '#8B5CF6' : '#E5E7EB',
                            color: activePattern === 'kdtree' ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        🌳 KD-Tree
                    </button>

                    <button
                        onClick={showBlackspots}
                        disabled={loading}
                        style={{
                            padding: '10px 15px',
                            background: activePattern === 'blackspot' ? '#DC2626' : '#E5E7EB',
                            color: activePattern === 'blackspot' ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        🔥 Blackspots
                    </button>

                    <button
                        onClick={showGraphStructure}
                        disabled={loading}
                        style={{
                            padding: '10px 15px',
                            background: activePattern === 'graph' ? '#10B981' : '#E5E7EB',
                            color: activePattern === 'graph' ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        📊 Graph Structure
                    </button>

                    <button
                        onClick={showStatePattern}
                        disabled={loading}
                        style={{
                            padding: '10px 15px',
                            background: activePattern === 'state' ? '#F59E0B' : '#E5E7EB',
                            color: activePattern === 'state' ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        🔄 State Pattern
                    </button>
                </div>

                {/* Stats Display */}
                {stats && (
                    <div style={{
                        marginTop: '15px',
                        padding: '15px',
                        background: '#F9FAFB',
                        borderRadius: '8px',
                        fontSize: '14px'
                    }}>
                        <strong>{stats.pattern}</strong>
                        <pre style={{
                            marginTop: '10px',
                            fontSize: '13px',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {JSON.stringify(stats, null, 2)}
                        </pre>
                    </div>
                )}

                {loading && (
                    <div style={{ marginTop: '10px', color: '#3B82F6' }}>
                        ⏳ Loading...
                    </div>
                )}
            </div>

            {/* Map Container */}
            <div ref={mapContainer} style={{ flex: 1 }} />
            <DesignPatternsShowcase map={map} />
        </div>
    );
};

export default DesignPatternsMapDemo;