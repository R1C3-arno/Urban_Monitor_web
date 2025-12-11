/**
 * RouteControls.jsx - Using Shared Components + Separate CSS
 *
 * Tận dụng:
 * ✅ Card component (for status, results)
 * ✅ Separate CSS file (RouteControls.css)
 * ✅ BEM naming convention
 * ✅ Professional structure
 */

import React, { useState } from 'react';
import Card from '@/shared/Components/UI/Card/Card';
import './RouteControls.css';

export const RouteControls = ({
                                  nodes,
                                  availableNodeIds = { start: null, end: null },
                                  onSeedGraph,
                                  onSeedEnhanced,
                                  onFindRoute,
                                  loading,
                                  error,
                                  routeData
                              }) => {
    const [algorithm, setAlgorithm] = useState('dijkstra');

    const mid = Math.floor(nodes.length / 2);
    const startId = availableNodeIds.start || nodes[mid]?.id;
    const endId = availableNodeIds.end || nodes[mid + 1]?.id;

    return (
        <div className="route-controls">
            {/* ============================================
                TITLE
                ============================================ */}

            <h3 className="route-controls__title">
                Route Finder
            </h3>


            {/* ============================================
                STATUS - GRAPH READY (Using Card)
                ============================================ */}
            {availableNodeIds.start && (
                <Card>
                    <div className="route-controls__status route-controls__status--ready">
                        <div className="status-title">✅ Graph Ready</div>
                        <div className="status-content">{nodes.length} nodes loaded</div>
                        <div className="status-route">
                            <strong>Route:</strong> Node {startId} → Node {endId}
                        </div>
                    </div>
                </Card>
            )}

            {/* ============================================
                STATUS - SIMPLE (No Card)
                ============================================ */}
            {nodes.length > 0 && !availableNodeIds.start && (
                <div className="route-controls__status route-controls__status--simple">
                    Graph ready: {nodes.length} nodes
                </div>
            )}

            {/* ============================================
                ERROR MESSAGE (Using Card)
                ============================================ */}
            {error && (
                <Card>
                    <div className="route-controls__error">
                         {error}
                    </div>
                </Card>
            )}

            {/* ============================================
                STEP 1: CREATE GRAPH (2 OPTIONS)
                ============================================ */}
            {nodes.length === 0 ? (
                <div className="route-controls__button-group">
                    <button
                        onClick={onSeedGraph}
                        disabled={loading}
                        className="route-controls__button route-controls__button--primary"
                    >
                        {loading ? '⏳' : ''} Simple (5)
                    </button>
                    <button
                        onClick={onSeedEnhanced}
                        disabled={loading}
                        className="route-controls__button route-controls__button--success"
                    >
                        {loading ? 'Wait' : 'Domain Expandsion'} Spider (100)
                    </button>
                </div>
            ) : (
                <>
                    {/* ============================================
                        ALGORITHM SELECTION
                        ============================================ */}
                    <div className="route-controls__section">
                        <label className="route-controls__label">
                            Algorithm:
                        </label>
                        <div className="route-controls__algorithm-group">
                            <button
                                onClick={() => setAlgorithm('dijkstra')}
                                className={`route-controls__algorithm-btn route-controls__algorithm-btn--dijkstra ${
                                    algorithm === 'dijkstra' ? 'active' : ''
                                }`}
                            >
                                 Dijkstra
                            </button>
                            <button
                                onClick={() => setAlgorithm('astar')}
                                className={`route-controls__algorithm-btn route-controls__algorithm-btn--astar ${
                                    algorithm === 'astar' ? 'active' : ''
                                }`}
                            >
                                 A*
                            </button>
                        </div>
                    </div>

                    {/* ============================================
                        FIND ROUTE BUTTON
                        ============================================ */}
                    <button
                        onClick={() => onFindRoute(algorithm)}
                        disabled={loading || !startId || !endId}
                        className={`route-controls__find-btn ${
                            algorithm === 'dijkstra'
                                ? 'route-controls__find-btn--dijkstra'
                                : 'route-controls__find-btn--astar'
                        }`}
                    >
                        {loading ? ' Finding...' :
                            !startId || !endId ? 'Warning: No nodes' :
                                ` Find Route (${startId} → ${endId})`}
                    </button>
                </>
            )}

            {/* ============================================
                RESULTS (Using Card)
                ============================================ */}
            {routeData && (
                <Card>
                    <div className="route-controls__results">
                        <div className="route-controls__results-title">
                             Results:
                        </div>
                        <div className="route-controls__results-content">
                            • <strong>Distance:</strong> {routeData.formattedDistance || `${routeData.totalDistance}m`}<br />
                            • <strong>Time:</strong> {routeData.formattedTime || `${routeData.totalTime}s`}<br />
                            • <strong>Iterations:</strong> {routeData.algorithmIterations}<br />
                            • <strong>Steps:</strong> {routeData.explorationSteps?.length || 0}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default RouteControls;