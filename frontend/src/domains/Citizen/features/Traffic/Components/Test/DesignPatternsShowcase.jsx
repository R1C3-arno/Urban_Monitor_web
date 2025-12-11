import React, { useState } from 'react';
import RouteFinder from "@/domains/Citizen/features/Traffic/Components/RouteFinder/RouteFinder.jsx";

/**
 * 🎓 DESIGN PATTERNS SHOWCASE
 *
 * 1. ✅ ROUTE FINDER (Strategy Pattern) - Existing working component
 * 2. 🌳 KD-TREE - Nearest neighbors visualization
 * 3. 🔥 BLACKSPOT - Accident clustering
 * 4. 📊 GRAPH STRUCTURE - Network visualization
 * 5. 🔄 STATE PATTERN - Report workflow
 */
const DesignPatternsShowcase = ({ map }) => {
    const [activeView, setActiveView] = useState('routeFinder');
    const [visualizationData, setVisualizationData] = useState(null);
    const [loading, setLoading] = useState(false);

    // ═══════════════════════════════════════════════════════════
    // 2. KD-TREE VISUALIZATION
    // ═══════════════════════════════════════════════════════════

    const showKDTreeVisualization = async () => {
        setLoading(true);
        try {
            // Get all incidents
            const response = await fetch('http://localhost:8080/api/traffic/incidents');
            const incidents = await response.json();

            if (!Array.isArray(incidents)) {
                console.warn('No incidents data');
                setVisualizationData({
                    type: 'kdtree',
                    message: '⚠️ No incidents data available. Need to implement backend endpoint.',
                    sample: `
// Backend needed:
@GetMapping("/api/traffic/incidents")
public List<TrafficIncident> getAllIncidents() {
    return incidentRepository.findAll();
}

@GetMapping("/api/traffic/incidents/nearest")
public List<NearestIncident> findNearest(
    @RequestParam double lat,
    @RequestParam double lng,
    @RequestParam int k
) {
    return kdTree.findKNearest(new Point2D(lat, lng), k);
}
                    `
                });
                return;
            }

            // Query center point
            const center = map.getCenter();
            const nearestResp = await fetch(
                `http://localhost:8080/api/traffic/incidents/nearest?lat=${center.lat}&lng=${center.lng}&k=5`
            );
            const nearest = await nearestResp.json();

            setVisualizationData({
                type: 'kdtree',
                total: incidents.length,
                nearest: nearest.length,
                data: nearest,
                explanation: `
🌳 KD-TREE SPATIAL INDEX

What it does:
- Finds K nearest incidents in O(log n) time
- Binary space partitioning tree
- Much faster than O(n) linear search

Backend implementation:
- NearestIncidentFinder.java
- KDTree.java
- Point2D.java

Complexity:
- Build tree: O(n log n)
- Search: O(log n)
- vs Linear scan: O(n)

For 1000 incidents:
- Linear: 1000 comparisons
- KD-Tree: ~10 comparisons (100x faster!)
                `
            });

        } catch (err) {
            console.error('KD-Tree error:', err);
            setVisualizationData({
                type: 'kdtree',
                error: err.message,
                solution: 'Need to implement /api/traffic/incidents endpoint'
            });
        } finally {
            setLoading(false);
        }
    };

    // ═══════════════════════════════════════════════════════════
    // 3. BLACKSPOT DETECTION
    // ═══════════════════════════════════════════════════════════

    const showBlackspotVisualization = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/traffic/blackspots?top=10');
            const blackspots = await response.json();

            if (!Array.isArray(blackspots)) {
                setVisualizationData({
                    type: 'blackspot',
                    message: '⚠️ No blackspot data. Need backend endpoint.',
                    sample: `
// Backend needed:
@GetMapping("/api/traffic/blackspots")
public List<Blackspot> detectBlackspots(@RequestParam int top) {
    return blackspotDetector.detectTopK(top);
}

// Algorithm: Grid-based clustering
class BlackspotDetector {
    public List<Blackspot> detectTopK(int k) {
        // 1. Create grid
        Map<GridCell, List<Incident>> grid = new HashMap<>();
        
        // 2. Group incidents by grid cell
        for (incident : incidents) {
            GridCell cell = toGridCell(incident);
            grid.get(cell).add(incident);
        }
        
        // 3. Calculate severity
        List<Blackspot> spots = new ArrayList<>();
        for (cell : grid.keySet()) {
            double severity = calculateSeverity(grid.get(cell));
            spots.add(new Blackspot(cell, severity));
        }
        
        // 4. Sort and return top K
        spots.sort((a,b) -> compare(b.severity, a.severity));
        return spots.subList(0, k);
    }
}
                    `
                });
                return;
            }

            setVisualizationData({
                type: 'blackspot',
                found: blackspots.length,
                data: blackspots,
                explanation: `
🔥 BLACKSPOT DETECTION

What it does:
- Identifies accident hotspots
- Grid-based clustering algorithm
- Severity scoring based on incident count & type

Backend implementation:
- BlackspotDetector.java

Algorithm steps:
1. Divide area into grid cells
2. Count incidents per cell
3. Calculate severity score
4. Rank and return top K

Complexity: O(n) where n = incidents

Use case:
- Traffic safety analysis
- Police patrol route planning
- Road improvement prioritization
                `
            });

        } catch (err) {
            console.error('Blackspot error:', err);
            setVisualizationData({
                type: 'blackspot',
                error: err.message,
                solution: 'Need to implement /api/traffic/blackspots endpoint'
            });
        } finally {
            setLoading(false);
        }
    };

    // ═══════════════════════════════════════════════════════════
    // 4. GRAPH STRUCTURE
    // ═══════════════════════════════════════════════════════════

    const showGraphVisualization = async () => {
        setLoading(true);
        try {
            // Get graph stats
            const statsResp = await fetch('http://localhost:8080/citizen/routes/stats');
            const stats = await statsResp.json();

            // Get nodes
            const nodesResp = await fetch('http://localhost:8080/api/traffic/graph-nodes');
            const nodes = await nodesResp.json();

            setVisualizationData({
                type: 'graph',
                nodes: stats.totalNodes || nodes.length,
                edges: stats.totalEdges || 0,
                avgDegree: stats.averageDegree || 0,
                explanation: `
📊 GRAPH DATA STRUCTURE

What it is:
- Adjacency List representation
- Nodes = intersections/locations
- Edges = roads with distance & time

Backend implementation:
- TrafficGraphStore.java (Singleton)
- TrafficNode.java (entity)
- TrafficEdge.java (entity)

Structure:
Map<Long, TrafficNode> nodes;
Map<Long, List<TrafficEdge>> adjacencyList;

Operations:
- Add node: O(1)
- Add edge: O(1)
- Get neighbors: O(1)
- Find path: O(E + V log V) Dijkstra

Current graph:
- Nodes: ${stats.totalNodes || nodes.length}
- Edges: ${stats.totalEdges || 0}
- Avg degree: ${stats.averageDegree || 0}
- Type: Directed weighted graph
- Source: OpenStreetMap real roads

Why Adjacency List?
- Space: O(V + E) efficient
- Fast neighbor lookup for pathfinding
- Better than Matrix for sparse graphs
                `
            });

        } catch (err) {
            console.error('Graph error:', err);
            setVisualizationData({
                type: 'graph',
                error: err.message
            });
        } finally {
            setLoading(false);
        }
    };

    // ═══════════════════════════════════════════════════════════
    // 5. STATE PATTERN
    // ═══════════════════════════════════════════════════════════

    const showStatePatternVisualization = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/reports');
            const reports = await response.json();

            if (!Array.isArray(reports)) {
                setVisualizationData({
                    type: 'state',
                    message: '⚠️ No reports data. Need backend endpoint.',
                    sample: `
// Backend needed:
@GetMapping("/api/reports")
public List<TrafficReport> getAllReports() {
    return reportRepository.findAll();
}

// State Pattern Implementation
interface ReportState {
    void approve(TrafficReport report);
    void reject(TrafficReport report);
}

class PendingState implements ReportState {
    void approve(TrafficReport report) {
        report.setState(new ApprovedState());
        report.setReviewedAt(now());
    }
    
    void reject(TrafficReport report) {
        report.setState(new RejectedState());
        report.setReviewedAt(now());
    }
}

class ApprovedState implements ReportState {
    void approve(TrafficReport report) {
        throw new IllegalStateException("Already approved");
    }
    
    void reject(TrafficReport report) {
        throw new IllegalStateException("Cannot reject approved");
    }
}

class RejectedState implements ReportState {
    void approve(TrafficReport report) {
        throw new IllegalStateException("Cannot approve rejected");
    }
    
    void reject(TrafficReport report) {
        throw new IllegalStateException("Already rejected");
    }
}
                    `
                });
                return;
            }

            const pending = reports.filter(r => r.status === 'PENDING').length;
            const approved = reports.filter(r => r.status === 'APPROVED').length;
            const rejected = reports.filter(r => r.status === 'REJECTED').length;

            setVisualizationData({
                type: 'state',
                total: reports.length,
                pending,
                approved,
                rejected,
                explanation: `
🔄 STATE PATTERN

What it does:
- Report lifecycle management
- State transitions with validation
- Prevents invalid operations

Backend implementation:
- ReportState.java (interface)
- PendingState.java
- ApprovedState.java
- RejectedState.java
- ReportStateFactory.java

State transitions:
PENDING → approve() → APPROVED ✅
PENDING → reject() → REJECTED ✅
APPROVED → approve() → ERROR ❌
APPROVED → reject() → ERROR ❌
REJECTED → approve() → ERROR ❌
REJECTED → reject() → ERROR ❌

Current reports:
- Total: ${reports.length}
- 🟡 Pending: ${pending} (can transition)
- 🟢 Approved: ${approved} (final)
- 🔴 Rejected: ${rejected} (final)

Benefits:
- Clean state management
- Compile-time state validation
- Easy to add new states
- Follows Open/Closed Principle
                `
            });

        } catch (err) {
            console.error('State error:', err);
            setVisualizationData({
                type: 'state',
                error: err.message,
                solution: 'Need to implement /api/reports endpoint'
            });
        } finally {
            setLoading(false);
        }
    };

    // ═══════════════════════════════════════════════════════════
    // UI RENDERING
    // ═══════════════════════════════════════════════════════════

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            {/* Main Content */}
            {activeView === 'routeFinder' ? (
                <RouteFinder visible={true} map={map} />
            ) : (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    maxWidth: '500px',
                    maxHeight: '80vh',
                    overflow: 'auto',
                    zIndex: 1000
                }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '32px' }}>⏳</div>
                            <div>Loading...</div>
                        </div>
                    ) : visualizationData ? (
                        <>
                            <h3 style={{ marginTop: 0 }}>
                                {visualizationData.type === 'kdtree' && '🌳 KD-Tree'}
                                {visualizationData.type === 'blackspot' && '🔥 Blackspot Detection'}
                                {visualizationData.type === 'graph' && '📊 Graph Structure'}
                                {visualizationData.type === 'state' && '🔄 State Pattern'}
                            </h3>

                            {visualizationData.error && (
                                <div style={{
                                    background: '#FEE2E2',
                                    color: '#991B1B',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    marginBottom: '15px'
                                }}>
                                    <strong>❌ Error:</strong> {visualizationData.error}
                                </div>
                            )}

                            {visualizationData.message && (
                                <div style={{
                                    background: '#FEF3C7',
                                    color: '#92400E',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    marginBottom: '15px'
                                }}>
                                    {visualizationData.message}
                                </div>
                            )}

                            {visualizationData.explanation && (
                                <pre style={{
                                    background: '#F9FAFB',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: 'monospace'
                                }}>
                                    {visualizationData.explanation}
                                </pre>
                            )}

                            {visualizationData.sample && (
                                <pre style={{
                                    background: '#1F2937',
                                    color: '#F9FAFB',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    lineHeight: '1.6',
                                    overflow: 'auto',
                                    fontFamily: 'monospace'
                                }}>
                                    {visualizationData.sample}
                                </pre>
                            )}

                            {visualizationData.solution && (
                                <div style={{
                                    background: '#DBEAFE',
                                    color: '#1E40AF',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    marginTop: '15px'
                                }}>
                                    <strong>💡 Solution:</strong> {visualizationData.solution}
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎓</div>
                            <p>Select a pattern from the menu to view details</p>
                        </div>
                    )}
                </div>
            )}

            {/* Pattern Selector Menu */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'white',
                padding: '15px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                gap: '10px',
                zIndex: 1000
            }}>
                <button
                    onClick={() => {
                        setActiveView('routeFinder');
                        setVisualizationData(null);
                    }}
                    style={{
                        padding: '10px 15px',
                        background: activeView === 'routeFinder' ? '#3B82F6' : '#E5E7EB',
                        color: activeView === 'routeFinder' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}
                >
                    🎯 Strategy Pattern
                </button>

                <button
                    onClick={() => {
                        setActiveView('kdtree');
                        showKDTreeVisualization();
                    }}
                    style={{
                        padding: '10px 15px',
                        background: activeView === 'kdtree' ? '#8B5CF6' : '#E5E7EB',
                        color: activeView === 'kdtree' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}
                >
                    🌳 KD-Tree
                </button>

                <button
                    onClick={() => {
                        setActiveView('blackspot');
                        showBlackspotVisualization();
                    }}
                    style={{
                        padding: '10px 15px',
                        background: activeView === 'blackspot' ? '#DC2626' : '#E5E7EB',
                        color: activeView === 'blackspot' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}
                >
                    🔥 Blackspots
                </button>

                <button
                    onClick={() => {
                        setActiveView('graph');
                        showGraphVisualization();
                    }}
                    style={{
                        padding: '10px 15px',
                        background: activeView === 'graph' ? '#10B981' : '#E5E7EB',
                        color: activeView === 'graph' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}
                >
                    📊 Graph
                </button>

                <button
                    onClick={() => {
                        setActiveView('state');
                        showStatePatternVisualization();
                    }}
                    style={{
                        padding: '10px 15px',
                        background: activeView === 'state' ? '#F59E0B' : '#E5E7EB',
                        color: activeView === 'state' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}
                >
                    🔄 State
                </button>
            </div>
        </div>
    );
};

export default DesignPatternsShowcase;