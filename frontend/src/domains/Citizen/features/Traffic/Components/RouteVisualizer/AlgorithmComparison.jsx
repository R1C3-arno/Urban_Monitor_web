import React, { useState } from 'react';
import { useRouteFinder } from "@/domains/Citizen/features/Traffic/Hooks/useRouteFinder.js";

/**
 * AlgorithmComparison Component
 * Shows side-by-side comparison of Dijkstra vs A*
 *
 * ✅ Shows exploration differences
 * ✅ Performance metrics
 * ✅ Visual comparison
 */
export const AlgorithmComparison = ({ map, nodes }) => {
    const [dijkstraRoute, setDijkstraRoute] = useState(null);
    const [astarRoute, setAstarRoute] = useState(null);
    const [comparing, setComparing] = useState(false);

    const { findRoute, loading } = useRouteFinder();

    /**
     * Run both algorithms and compare
     */
    const handleCompare = async () => {
        if (nodes.length < 2) {
            alert('Please seed graph first');
            return;
        }

        setComparing(true);
        setDijkstraRoute(null);
        setAstarRoute(null);

        try {
            const recentNodes = nodes.slice(-20);
            const startId = recentNodes[0]?.id;
            const endId = recentNodes[recentNodes.length - 1]?.id;

            console.log('🔬 Running algorithm comparison...');

            // Run Dijkstra
            console.log('🔵 Running Dijkstra...');
            const dijkstra = await findRoute(startId, endId, 'dijkstra');
            setDijkstraRoute(dijkstra);

            // Wait a bit for visual clarity
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Run A*
            console.log('🟢 Running A*...');
            const astar = await findRoute(startId, endId, 'astar');
            setAstarRoute(astar);

            console.log('✅ Comparison complete');

        } catch (err) {
            console.error('❌ Comparison error:', err);
            alert('Comparison failed: ' + err.message);
        } finally {
            setComparing(false);
        }
    };

    /**
     * Calculate efficiency gain
     */
    const calculateEfficiency = () => {
        if (!dijkstraRoute || !astarRoute) return null;

        const dijkstraSteps = dijkstraRoute.explorationSteps?.length || 0;
        const astarSteps = astarRoute.explorationSteps?.length || 0;

        if (dijkstraSteps === 0) return null;

        const reduction = ((dijkstraSteps - astarSteps) / dijkstraSteps * 100).toFixed(1);

        return {
            dijkstraSteps,
            astarSteps,
            reduction: parseFloat(reduction),
            faster: reduction > 0 ? 'A*' : 'Dijkstra'
        };
    };

    const efficiency = calculateEfficiency();

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: '#fff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '320px',
            maxWidth: '400px',
            zIndex: 1000
        }}>
            <h3 style={{
                margin: '0 0 15px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827'
            }}>
                🔬 Algorithm Comparison
            </h3>

            <p style={{
                fontSize: '13px',
                color: '#6B7280',
                marginBottom: '15px',
                lineHeight: '1.5'
            }}>
                Compare Dijkstra (explores all paths) vs A* (uses heuristic for faster search)
            </p>

            {/* Compare Button */}
            <button
                onClick={handleCompare}
                disabled={comparing || loading || nodes.length < 2}
                style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '15px',
                    background: comparing ? '#9CA3AF' : 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: comparing ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                }}
            >
                {comparing ? '⏳ Comparing...' : '▶️ Compare Algorithms'}
            </button>

            {/* Results */}
            {(dijkstraRoute || astarRoute) && (
                <div style={{
                    background: '#F9FAFB',
                    padding: '15px',
                    borderRadius: '8px'
                }}>
                    {/* Dijkstra Results */}
                    {dijkstraRoute && (
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '8px'
                            }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    background: '#3B82F6',
                                    borderRadius: '2px'
                                }}/>
                                <span style={{ fontWeight: '700', fontSize: '14px' }}>
                                    Dijkstra
                                </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>
                                • Distance: {dijkstraRoute.formattedDistance}<br/>
                                • Time: {dijkstraRoute.formattedTime}<br/>
                                • Exploration steps: <strong>{dijkstraRoute.explorationSteps?.length || 0}</strong><br/>
                                • Iterations: {dijkstraRoute.iterations}
                            </div>
                        </div>
                    )}

                    {/* A* Results */}
                    {astarRoute && (
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '8px'
                            }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    background: '#10B981',
                                    borderRadius: '2px'
                                }}/>
                                <span style={{ fontWeight: '700', fontSize: '14px' }}>
                                    A* Search
                                </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>
                                • Distance: {astarRoute.formattedDistance}<br/>
                                • Time: {astarRoute.formattedTime}<br/>
                                • Exploration steps: <strong>{astarRoute.explorationSteps?.length || 0}</strong><br/>
                                • Iterations: {astarRoute.iterations}
                            </div>
                        </div>
                    )}

                    {/* Efficiency */}
                    {efficiency && (
                        <div style={{
                            marginTop: '12px',
                            padding: '10px',
                            background: efficiency.reduction > 0 ? '#ECFDF5' : '#FEF3C7',
                            borderRadius: '6px',
                            border: `2px solid ${efficiency.reduction > 0 ? '#10B981' : '#F59E0B'}`
                        }}>
                            <div style={{
                                fontSize: '13px',
                                fontWeight: '700',
                                color: efficiency.reduction > 0 ? '#065F46' : '#92400E',
                                marginBottom: '4px'
                            }}>
                                {efficiency.faster === 'A*' ? '🚀' : '⚡'} Performance
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: efficiency.reduction > 0 ? '#065F46' : '#92400E'
                            }}>
                                A* explored <strong>{Math.abs(efficiency.reduction)}%</strong> {efficiency.reduction > 0 ? 'fewer' : 'more'} nodes
                                <br/>
                                ({efficiency.dijkstraSteps} vs {efficiency.astarSteps} steps)
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Legend */}
            <div style={{
                marginTop: '15px',
                padding: '12px',
                background: '#F3F4F6',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#6B7280',
                lineHeight: '1.5'
            }}>
                <strong>How to read:</strong><br/>
                • Blue/Green edges = Algorithm exploring<br/>
                • Yellow path = Optimal route found<br/>
                • Fewer exploration steps = More efficient
            </div>
        </div>
    );
};

export default AlgorithmComparison;