import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

/**
 * ✅ DSA Service - With Better Error Handling
 */
class DSAService {
    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 400000,
            headers: { 'Content-Type': 'application/json' }
        });

        // ✅ IMPROVED: Better error handling
        this.client.interceptors.response.use(
            res => res,
            err => {
                const errorMsg = this._extractErrorMessage(err);
                console.error('❌ API Error:', errorMsg);

                // ✅ Attach readable error message
                err.readableMessage = errorMsg;
                return Promise.reject(err);
            }
        );
    }

    /**
     * ✅ NEW: Extract readable error message
     */
    _extractErrorMessage(err) {
        // Priority 1: Backend error message
        if (err.response?.data?.error) {
            return err.response.data.error;
        }

        // Priority 2: Backend message
        if (err.response?.data?.message) {
            return err.response.data.message;
        }

        // Priority 3: HTTP status text
        if (err.response?.status) {
            const statusMessages = {
                400: 'Bad Request',
                401: 'Unauthorized',
                403: 'Forbidden',
                404: 'Not Found',
                500: 'Internal Server Error',
                503: 'Service Unavailable'
            };
            return statusMessages[err.response.status] || `HTTP ${err.response.status}`;
        }

        // Priority 4: Network error
        if (err.request && !err.response) {
            return 'Network Error - Server not responding';
        }

        // Priority 5: Generic error
        return err.message || 'Unknown error occurred';
    }

    // ═══════════════════════════════════════════════════════════
    // TRAFFIC API - /api/traffic/*
    // ═══════════════════════════════════════════════════════════

    /**
     * Seed enhanced graph
     * POST /api/traffic/seed-enhanced-graph
     */
    async seedEnhancedGraph(nodeCount) {
        try {
            const params = nodeCount ? { nodes: nodeCount } : {};
            const res = await this.client.post('/api/traffic/seed-enhanced-graph', null, {
                params
            });

            console.log('✅ Graph seeded:', res.data);

            // ✅ Return data including sample node IDs
            return res.data;

        } catch (err) {
            throw new Error(`Seed failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Get blackspots
     * GET /api/traffic/blackspots?top=5
     */
    async getBlackspots(top = 5) {
        try {
            const res = await this.client.get('/api/traffic/blackspots', {
                params: { top }
            });
            return res.data;
        } catch (err) {
            throw new Error(`Blackspots failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Get nearest incidents (KNN)
     * GET /api/traffic/nearest?lat=10.77&lng=106.69&k=5
     */
    async getNearestIncidents(lat = 10.77, lng = 106.69, k = 5) {
        try {
            const res = await this.client.get('/api/traffic/nearest', {
                params: { lat, lng, k }
            });
            return res.data || [];
        } catch (err) {
            console.warn('⚠️ Nearest incidents failed:', err.readableMessage);
            return []; // Return empty array on error
        }
    }

    /**
     * Get graph edges
     * GET /api/traffic/graph-edges
     */
    async getGraphEdges() {
        try {
            const res = await this.client.get('/api/traffic/graph-edges');
            return res.data;
        } catch (err) {
            throw new Error(`Graph edges failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Get graph nodes
     * GET /api/traffic/graph-nodes
     */
    async getGraphNodes() {
        try {
            const res = await this.client.get('/api/traffic/graph-nodes');
            return res.data;
        } catch (err) {
            throw new Error(`Graph nodes failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Clear all graph data
     * DELETE /api/traffic/clear-all
     */
    async clearAllData() {
        try {
            const res = await this.client.delete('/api/traffic/clear-all');
            return res.data;
        } catch (err) {
            throw new Error(`Clear data failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Get graph data (nodes list)
     * GET /api/traffic/graph-nodes
     */
    async getGraphData() {
        try {
            const res = await this.client.get('/api/traffic/graph-nodes');
            return { nodes: res.data || [] };
        } catch (err) {
            throw new Error(`Graph data failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Seed simple graph (same as enhanced for now)
     * POST /api/traffic/seed-enhanced-graph
     */
    async seedSimpleGraph() {
        return await this.seedEnhancedGraph();
    }

    // ═══════════════════════════════════════════════════════════
    // ROUTE API - /citizen/routes/*
    // ═══════════════════════════════════════════════════════════

    /**
     * ✅ IMPROVED: Find shortest path with better error handling
     * GET /citizen/routes/find?start=1&end=20&algorithm=dijkstra
     */
    async findRoute(startId, endId, algorithm = 'dijkstra') {
        try {
            const res = await this.client.get('/citizen/routes/find', {
                params: {
                    start: startId,
                    end: endId,
                    algorithm: algorithm.toLowerCase()
                },
                validateStatus: (status) => {
                    // ✅ Accept 400 as valid response (backend sends path data in 400)
                    return status >= 200 && status < 500;
                }
            });

            const data = res.data;

            // ✅ Check if backend returned error
            if (data.success === false || data.error) {
                const error = new Error(data.error || 'Route not found');
                error.isRouteNotFound = true;
                error.backendData = data;
                throw error;
            }

            return data;

        } catch (err) {
            // ✅ Already a route-not-found error
            if (err.isRouteNotFound) {
                throw err;
            }

            // ✅ Network/server error
            throw new Error(`Route finding failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Get graph stats
     * GET /citizen/routes/stats
     */
    async getGraphStats() {
        try {
            const res = await this.client.get('/citizen/routes/stats');
            return res.data;
        } catch (err) {
            throw new Error(`Graph stats failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Rebuild graph
     * POST /citizen/routes/rebuild
     */
    async rebuildGraph() {
        try {
            const res = await this.client.post('/citizen/routes/rebuild');
            return res.data;
        } catch (err) {
            throw new Error(`Rebuild failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Find alternative routes
     * GET /citizen/routes/alternatives?start=1&end=20&k=3
     */
    async findAlternativeRoutes(startId, endId, k = 3) {
        try {
            const res = await this.client.get('/citizen/routes/alternatives', {
                params: { start: startId, end: endId, k }
            });
            return res.data;
        } catch (err) {
            throw new Error(`Alternative routes failed: ${err.readableMessage || err.message}`);
        }
    }

    // ═══════════════════════════════════════════════════════════
    // REPORT API - /api/reports/*
    // ═══════════════════════════════════════════════════════════

    /**
     * Submit report
     * POST /api/reports
     */
    async submitReport(reportData) {
        try {
            const res = await this.client.post('/api/reports', reportData);
            return res.data;
        } catch (err) {
            throw new Error(`Submit report failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Get pending reports
     * GET /api/reports/pending
     */
    async getPendingReports() {
        try {
            const res = await this.client.get('/api/reports/pending');
            return res.data;
        } catch (err) {
            throw new Error(`Get reports failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Approve report
     * POST /api/reports/{id}/approve?reviewer=Admin
     */
    async approveReport(reportId, reviewer = 'Admin') {
        try {
            const res = await this.client.post(
                `/api/reports/${reportId}/approve`,
                null,
                { params: { reviewer } }
            );
            return res.data;
        } catch (err) {
            throw new Error(`Approve report failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Reject report
     * POST /api/reports/{id}/reject?reviewer=Admin
     */
    async rejectReport(reportId, reviewer = 'Admin') {
        try {
            const res = await this.client.post(
                `/api/reports/${reportId}/reject`,
                null,
                { params: { reviewer } }
            );
            return res.data;
        } catch (err) {
            throw new Error(`Reject report failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Undo last action
     * POST /api/reports/undo
     */
    async undoLastAction() {
        try {
            const res = await this.client.post('/api/reports/undo');
            return res.data;
        } catch (err) {
            throw new Error(`Undo failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Redo last action
     * POST /api/reports/redo
     */
    async redoLastAction() {
        try {
            const res = await this.client.post('/api/reports/redo');
            return res.data;
        } catch (err) {
            throw new Error(`Redo failed: ${err.readableMessage || err.message}`);
        }
    }

    /**
     * Get command history
     * GET /api/reports/command-history
     */
    async getCommandHistory() {
        try {
            const res = await this.client.get('/api/reports/command-history');
            return res.data;
        } catch (err) {
            throw new Error(`Command history failed: ${err.readableMessage || err.message}`);
        }
    }

    async getAllNodes() {
        return await this.getGraphNodes();
    }
}

// Export singleton instance
export const dsaService = new DSAService();
export default dsaService;