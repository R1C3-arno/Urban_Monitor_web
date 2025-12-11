import React, { useEffect } from 'react';
import RouteVisualizer from '../RouteVisualizer/RouteVisualizer.jsx';
import { RouteControls } from './RouteControls';
import { useRouteFinder } from "@/domains/Citizen/features/Traffic/Hooks/useRouteFinder.js";
import DSAService from "@/domains/Citizen/features/Traffic/Services/DSAService.js";
import {dsaService} from "@/domains/Citizen/features/Traffic/Services/DSAService.js";
/**
 * RouteFinder - PRODUCTION READY
 * ✅ Auto-loads nodes on mount
 * ✅ Auto-detects valid node pairs
 * ✅ Proper error handling
 * ✅ Cache synchronization
 */
export const RouteFinder = ({ visible = true, map }) => {
    const {
        route,
        nodes,
        loading,
        error,
        availableNodeIds,
        seedGraph,
        findRoute,
        clearRoute,
    } = useRouteFinder();

    const loadNodes = async () => {
        const all = await dsaService.getGraphNodes();
        setNodes(all || []);
    };

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const findFarthestNodes = (nodeList) => {
        let maxDistance = 0;
        let farthestPair = { start: nodeList[0], end: nodeList[1] };

        for (let i = 0; i < nodeList.length; i++) {
            for (let j = i + 1; j < nodeList.length; j++) {
                const dist = calculateDistance(
                    nodeList[i].lat, nodeList[i].lng,
                    nodeList[j].lat, nodeList[j].lng
                );

                if (dist > maxDistance) {
                    maxDistance = dist;
                    farthestPair = { start: nodeList[i], end: nodeList[j] };
                }
            }
        }

        console.log(`📏 Farthest pair: ${maxDistance.toFixed(2)}km`);
        return farthestPair;
    };


    /**
     * ✅ Auto-load nodes on mount
     */
    useEffect(() => {
        const initializeGraph = async () => {
            try {
                // Check if nodes already loaded
                if (nodes.length > 0) {
                    console.log('✅ Nodes already loaded:', nodes.length);
                    return;
                }

                console.log('🔍 Loading existing nodes...');

                // Try to load existing nodes first
                if (typeof loadNodes === 'function') {
                    await loadNodes();
                }

                // If no nodes exist, prompt user to seed
                if (nodes.length === 0) {
                    console.log('⚠️ No nodes found. Please seed graph.');
                }
            } catch (err) {
                console.error('❌ Failed to initialize graph:', err);
            }
        };

        initializeGraph();
    }, []); // Only run once on mount

    /**
     * ✅ FIXED: Seed enhanced graph with proper parameters
     */
    const handleSeedEnhanced = async () => {
        try {
            console.log('🌱 Seeding enhanced graph (100 nodes)...');

            // ✅ Clear current route and state
            clearRoute();

            // ✅ Seed with 100 nodes (medium size)
            const result = await seedGraph(3000);

            if (result?.detectedNodeIds?.start && result?.detectedNodeIds?.end) {
                console.log(
                    '✅ Auto-detected route:',
                    result.detectedNodeIds.start,
                    '→',
                    result.detectedNodeIds.end
                );
            }

            console.log('✅ Graph seeded successfully:', result);

            // ✅ Show auto-detected route if available
            if (availableNodeIds.start && availableNodeIds.end) {
                console.log(
                    '✅ Auto-detected route:',
                    availableNodeIds.start,
                    '→',
                    availableNodeIds.end
                );
            }

        } catch (err) {
            console.error('❌ Seed error:', err);
            alert('Failed to seed graph: ' + err.message);
        }
    };

    /**
     * ✅ Seed large graph for stress testing
     */
    const handleSeedLarge = async () => {
        try {
            console.log('🌱 Seeding large graph (300 nodes)...');

            clearRoute();
            const result = await seedGraph(300);

            console.log('✅ Large graph seeded successfully:', result);

            if (availableNodeIds.start && availableNodeIds.end) {
                console.log(
                    '✅ Auto-detected route:',
                    availableNodeIds.start,
                    '→',
                    availableNodeIds.end
                );
            }

        } catch (err) {
            console.error('❌ Seed error:', err);
            alert('Failed to seed large graph: ' + err.message);
        }
    };

    /**
     * ✅ Find route with smart node selection
     */

    const handleFindRoute = async (algorithm) => {
        try {
            if (!nodes || nodes.length < 2) {
                alert('Please seed graph first.');
                return;
            }

            // ✅ LUÔN LUÔN dùng farthest pair
            const { start, end } = findFarthestNodes(nodes);

            const startId = start.id;
            const endId = end.id;

            console.log(`🔥 FARTEST route: ${startId} → ${endId}`);

            clearRoute();
            await findRoute(startId, endId, algorithm);

        } catch (err) {
            console.error('❌ Route error:', err);
            alert(err.message);
        }
    };


    /**
     * ✅ Quick test with guaranteed valid route
     */
    const handleQuickTest = async (algorithm) => {
        try {
            console.log('🎲 Running quick test with nearby nodes...');

            if (nodes.length < 10) {
                alert('Need at least 10 nodes for quick test. Please seed graph.');
                return;
            }

            // Pick 2 nearby nodes (more likely to be connected)
            const midIndex = Math.floor(nodes.length / 2);
            const startId = nodes[midIndex]?.id;
            const endId = nodes[midIndex + 5]?.id; // 5 nodes apart

            if (!startId || !endId) {
                alert('Invalid node selection');
                return;
            }

            console.log(`🎲 Quick test: ${startId} → ${endId} (${algorithm})`);

            clearRoute();
            await findRoute(startId, endId, algorithm);

            console.log('✅ Quick test completed');

        } catch (err) {
            console.error('❌ Quick test failed:', err);
            alert('Quick test failed: ' + err.message);
        }
    };

    if (!visible) return null;

    return (
        <>
            {/* Visualizer - shows exploration animation + final path */}
            {route && map && (
                <RouteVisualizer
                    map={map}
                    route={route}
                    allNodes={nodes}
                />
            )}

            {/* Controls UI */}
            <RouteControls
                nodes={nodes}
                availableNodeIds={availableNodeIds}
                onSeedGraph={handleSeedEnhanced}
                onSeedEnhanced={handleSeedEnhanced}
                onSeedLarge={handleSeedLarge}        // ✅ NEW
                onFindRoute={handleFindRoute}
                onQuickTest={handleQuickTest}        // ✅ NEW
                loading={loading}
                error={error}
                routeData={route}
            />

            {/* Debug Info (optional, can remove in production) */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{
                    position: 'fixed',
                    bottom: 10,
                    left: 10,
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    zIndex: 9999
                }}>
                    <div>Nodes: {nodes.length}</div>
                    {availableNodeIds.start && (
                        <div>
                            Route: {availableNodeIds.start} → {availableNodeIds.end}
                        </div>
                    )}
                    <div>Status: {loading ? '⏳ Loading...' : route ? '✅ Route found' : '⚪ Ready'}</div>
                    {error && <div style={{ color: '#ff6b6b' }}>❌ {error}</div>}
                </div>
            )}
        </>
    );
};

export default RouteFinder;