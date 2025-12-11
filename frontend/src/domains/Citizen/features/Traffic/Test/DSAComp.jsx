/**
 * React Components for DSA Features
 */

import React, { useState, useEffect } from 'react';
import {
    useTrafficData,
    useRouteFinding,
    useNearestIncidents,
    useBlackspots,
    useTrafficReports,
    useValidationReport,
    useAdminStats
} from "@/domains/Citizen/features/Traffic/Test/useTrafficHook.js";
// ==================== BLACKSPOT VISUALIZATION ====================

export const BlackspotsVisualization = ({ map, incidents }) => {
    const [selectedBlackspot, setSelectedBlackspot] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const { blackspots, findBlackspots } = useBlackspots(null, incidents);

    const handleLocationUpdate = (location) => {
        setUserLocation(location);
        findBlackspots(location, 5);
    };

    return (
        <div style={{
            position: 'absolute',
            top: '120px',
            right: '20px',
            background: '#fff',
            padding: '15px',
            borderRadius: '8px',
            maxWidth: '350px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
        }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' }}>
                🔥 Danger Zones (Blackspots)
            </h3>

            <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                {blackspots.length} blackspots detected
            </div>

            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {blackspots.map((spot, idx) => (
                    <div
                        key={spot.id}
                        onClick={() => setSelectedBlackspot(spot)}
                        style={{
                            padding: '8px',
                            marginBottom: '8px',
                            background: '#F3F4F6',
                            borderLeft: `4px solid ${spot.color}`,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#E5E7EB'}
                        onMouseLeave={(e) => e.target.style.background = '#F3F4F6'}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>
                            Zone {spot.id + 1}
                        </div>
                        <div style={{ fontSize: '11px' }}>
                            📍 {spot.center.lat.toFixed(4)}, {spot.center.lng.toFixed(4)}
                        </div>
                        <div style={{ fontSize: '11px' }}>
                            ⚠️ Risk: {spot.riskScore.toFixed(0)}/100
                        </div>
                        <div style={{ fontSize: '11px' }}>
                            🚗 Incidents: {spot.incidentCount}
                        </div>
                    </div>
                ))}
            </div>

            {selectedBlackspot && (
                <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    background: '#FEF3C7',
                    borderRadius: '4px',
                    fontSize: '12px',
                }}>
                    <strong>Selected Zone:</strong>
                    <div>Severity: {'⭐'.repeat(selectedBlackspot.severity)}</div>
                    <div>Risk Score: {selectedBlackspot.riskScore.toFixed(1)}</div>
                </div>
            )}
        </div>
    );
};

// ==================== ALGORITHM COMPARISON ====================

export const AlgorithmComparisonPanel = ({ graph }) => {
    const [startCoord, setStartCoord] = useState(null);
    const [endCoord, setEndCoord] = useState(null);
    const { comparison, loading, compareAlgorithms } = useRouteFinding(graph);

    const handleCompare = async () => {
        if (startCoord && endCoord) {
            await compareAlgorithms(startCoord, endCoord);
        }
    };

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            background: '#fff',
            padding: '15px',
            borderRadius: '8px',
            maxWidth: '400px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
        }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' }}>
                🔬 Algorithm Comparison
            </h3>

            {comparison && (
                <div>
                    <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <th style={{ textAlign: 'left', padding: '5px' }}>Algorithm</th>
                            <th style={{ textAlign: 'right', padding: '5px' }}>Time (ms)</th>
                            <th style={{ textAlign: 'right', padding: '5px' }}>Nodes</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(comparison.algorithms).map(([name, result]) => (
                            <tr
                                key={name}
                                style={{
                                    background: name === comparison.bestAlgorithm ? '#ECFDF5' : '#F9FAFB',
                                    borderBottom: '1px solid #E5E7EB',
                                }}
                            >
                                <td style={{ padding: '5px' }}>
                                    {name === comparison.bestAlgorithm && '⚡ '}
                                    {name}
                                </td>
                                <td style={{ textAlign: 'right', padding: '5px' }}>
                                    {result.executionTime.toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'right', padding: '5px' }}>
                                    {result.nodesExplored}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={{
                        marginTop: '10px',
                        padding: '8px',
                        background: '#F0FDF4',
                        borderRadius: '4px',
                        fontSize: '12px',
                    }}>
                        🏆 Best: <strong>{comparison.bestAlgorithm}</strong>
                    </div>
                </div>
            )}

            <button
                onClick={handleCompare}
                disabled={loading || !startCoord || !endCoord}
                style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '10px',
                    background: loading ? '#D1D5DB' : '#3B82F6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'default' : 'pointer',
                }}
            >
                {loading ? 'Comparing...' : 'Compare Algorithms'}
            </button>
        </div>
    );
};

// ==================== ROUTE EXPLORER (Visualization) ====================

export const RouteExplorer = ({ map, graph }) => {
    const [explorationSteps, setExplorationSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const { route, explorationSteps: steps, findRoute } = useRouteFinding(graph);

    useEffect(() => {
        if (steps.length > 0) {
            setExplorationSteps(steps);
            setCurrentStep(0);
        }
    }, [steps]);

    const animateExploration = () => {
        if (explorationSteps.length === 0) return;

        setIsAnimating(true);
        let step = 0;

        const interval = setInterval(() => {
            setCurrentStep(step);
            step++;

            if (step >= explorationSteps.length) {
                clearInterval(interval);
                setIsAnimating(false);
            }
        }, 50);
    };

    return (
        <div style={{
            position: 'absolute',
            left: '20px',
            bottom: '20px',
            background: '#fff',
            padding: '15px',
            borderRadius: '8px',
            maxWidth: '300px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
        }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
                🔍 Route Exploration
            </h3>

            <div style={{ fontSize: '12px', marginBottom: '10px' }}>
                Steps: {currentStep} / {explorationSteps.length}
            </div>

            <input
                type="range"
                min="0"
                max={explorationSteps.length - 1}
                value={currentStep}
                onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                style={{ width: '100%', marginBottom: '10px' }}
            />

            {explorationSteps[currentStep] && (
                <div style={{
                    padding: '8px',
                    background: '#F0F9FF',
                    borderRadius: '4px',
                    fontSize: '11px',
                    marginBottom: '10px',
                }}>
                    <div>Node: {explorationSteps[currentStep].nodeId}</div>
                    <div>Distance: {explorationSteps[currentStep].distance?.toFixed(2)} km</div>
                    <div>Visit #: {explorationSteps[currentStep].visitOrder}</div>
                </div>
            )}

            <button
                onClick={animateExploration}
                disabled={isAnimating}
                style={{
                    width: '100%',
                    padding: '6px',
                    background: isAnimating ? '#D1D5DB' : '#8B5CF6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isAnimating ? 'default' : 'pointer',
                    fontSize: '12px',
                }}
            >
                {isAnimating ? 'Animating...' : 'Play Animation'}
            </button>
        </div>
    );
};

// ==================== VALIDATION DISPLAY ====================

export const ValidationChainDisplay = ({ visible = false }) => {
    const { validationReport, loading, fetchValidationReport } = useValidationReport();

    useEffect(() => {
        if (visible) {
            fetchValidationReport();
        }
    }, [visible, fetchValidationReport]);

    if (!visible) return null;

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: '#fff',
            padding: '15px',
            borderRadius: '8px',
            maxWidth: '400px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
        }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' }}>
                🔗 Validation Chain Report
            </h3>

            {loading ? (
                <div>Loading...</div>
            ) : validationReport ? (
                <div style={{ fontSize: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                        <div style={{ padding: '10px', background: '#F0FDF4', borderRadius: '4px' }}>
                            <div style={{ fontSize: '24px', marginBottom: '5px' }}>✅</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>Approved</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                {validationReport.approvedCount}
                            </div>
                        </div>

                        <div style={{ padding: '10px', background: '#FEF2F2', borderRadius: '4px' }}>
                            <div style={{ fontSize: '24px', marginBottom: '5px' }}>❌</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>Rejected</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                {validationReport.rejectedCount}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
                            Approval Rate
                        </div>
                        <div style={{ background: '#E5E7EB', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                                style={{
                                    background: '#10B981',
                                    height: '100%',
                                    width: `${validationReport.approvalRate}%`,
                                    transition: 'width 0.3s',
                                }}
                            />
                        </div>
                        <div style={{ fontSize: '11px', marginTop: '3px', color: '#666' }}>
                            {validationReport.approvalRate.toFixed(1)}%
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
                            Detection Rates
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                            🚨 Spam: {(validationReport.spamDetectionRate * 100).toFixed(1)}%
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                            📋 Duplicate: {(validationReport.duplicateDetectionRate * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

// ==================== ADMIN PANEL ====================

export const AdminPanelComponent = ({ visible = false }) => {
    const { reports: pendingReports, fetchPendingReports, approveReport, rejectReport } = useTrafficReports();
    const { stats, fetchStats } = useAdminStats();

    useEffect(() => {
        if (visible) {
            fetchPendingReports();
            fetchStats();
        }
    }, [visible, fetchPendingReports, fetchStats]);

    if (!visible) return null;

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: '#fff',
            padding: '15px',
            borderRadius: '8px',
            maxWidth: '450px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
        }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' }}>
                👨‍💼 Admin Panel
            </h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: '15px',
            }}>
                <div style={{ padding: '10px', background: '#DBEAFE', borderRadius: '4px', fontSize: '12px' }}>
                    <div style={{ color: '#1E40AF', fontWeight: 'bold' }}>Total Reports</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats?.totalReports || 0}</div>
                </div>

                <div style={{ padding: '10px', background: '#FEF3C7', borderRadius: '4px', fontSize: '12px' }}>
                    <div style={{ color: '#92400E', fontWeight: 'bold' }}>Pending</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{pendingReports.length}</div>
                </div>
            </div>

            <h4 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>
                📋 Pending Reports
            </h4>

            {pendingReports.map((report) => (
                <div
                    key={report.id}
                    style={{
                        padding: '10px',
                        marginBottom: '8px',
                        background: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                        borderRadius: '4px',
                        fontSize: '11px',
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        {report.title}
                    </div>
                    <div style={{ color: '#666', marginBottom: '5px' }}>
                        {report.description}
                    </div>

                    {report.validationErrors.length > 0 && (
                        <div style={{ color: '#EF4444', fontSize: '10px', marginBottom: '5px' }}>
                            ⚠️ {report.validationErrors.join(', ')}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                            onClick={() => approveReport(report.id)}
                            style={{
                                flex: 1,
                                padding: '4px',
                                background: '#10B981',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontSize: '10px',
                            }}
                        >
                            ✓ Approve
                        </button>
                        <button
                            onClick={() => rejectReport(report.id, 'Admin decision')}
                            style={{
                                flex: 1,
                                padding: '4px',
                                background: '#EF4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontSize: '10px',
                            }}
                        >
                            ✗ Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default {
    BlackspotsVisualization,
    AlgorithmComparisonPanel,
    RouteExplorer,
    ValidationChainDisplay,
    AdminPanelComponent,
};