/**
 * Traffic API Service Layer
 * OOP: Singleton Pattern
 * Handles all backend API calls
 */

class APIService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
        this.timeout = 10000;
    }

    static instance = null;

    static getInstance() {
        if (!APIService.instance) {
            APIService.instance = new APIService();
        }
        return APIService.instance;
    }

    async request(endpoint, options = {}) {
        const { method = 'GET', body = null, timeout = this.timeout } = options;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                body: body ? JSON.stringify(body) : null,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText} (${response.status})`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // ==================== TRAFFIC CONTROLLER ====================

    /**
     * Get all traffic incidents and danger zones
     * @returns {Promise<TrafficMapResponse>}
     */
    async getTrafficMap() {
        return this.request('/traffic/map');
    }

    /**
     * Get traffic incidents with pagination
     * @param {number} page - Page number
     * @param {number} size - Page size
     * @returns {Promise<IncidentDTO[]>}
     */
    async getIncidents(page = 0, size = 20) {
        return this.request(`/traffic/incidents?page=${page}&size=${size}`);
    }

    /**
     * Get detailed incident info
     * @param {number} incidentId
     * @returns {Promise<IncidentDetailResponse>}
     */
    async getIncidentDetail(incidentId) {
        return this.request(`/traffic/incidents/${incidentId}`);
    }

    // ==================== ROUTE CONTROLLER ====================

    /**
     * Find optimal route between two points
     * @param {Object} params
     * @param {number} params.startLng - Start longitude
     * @param {number} params.startLat - Start latitude
     * @param {number} params.endLng - End longitude
     * @param {number} params.endLat - End latitude
     * @param {string} params.algorithm - 'dijkstra' | 'astar' | 'bidirectional'
     * @param {string} params.decorator - 'avoid_tolls' | 'avoid_highways' | 'scenic'
     * @returns {Promise<RouteResponse>}
     */
    async findRoute(params) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/route/find?${queryString}`);
    }

    /**
     * Compare different routing algorithms
     * @param {Object} params - Same as findRoute
     * @returns {Promise<AlgorithmComparisonResponse>}
     */
    async compareAlgorithms(params) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/route/compare-algorithms?${queryString}`);
    }

    /**
     * Get route with exploration steps (for visualization)
     * @param {Object} params - Same as findRoute
     * @returns {Promise<ExplorationResponse>}
     */
    async getRouteWithExploration(params) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/route/explore?${queryString}`);
    }

    // ==================== REPORT CONTROLLER ====================

    /**
     * Create new traffic incident report
     * @param {ReportRequest} reportData
     * @returns {Promise<ReportResponse>}
     */
    async createReport(reportData) {
        return this.request('/report/create', {
            method: 'POST',
            body: reportData,
        });
    }

    /**
     * Get all reports with pagination
     * @param {number} page
     * @param {number} size
     * @returns {Promise<ReportResponse[]>}
     */
    async getReports(page = 0, size = 20) {
        return this.request(`/reports/all?page=${page}&size=${size}`);
    }

    /**
     * Get reports pending approval
     * @returns {Promise<ReportResponse[]>}
     */
    async getPendingReports() {
        return this.request('/reports/pending');
    }

    /**
     * Get report by ID
     * @param {number} reportId
     * @returns {Promise<ReportResponse>}
     */
    async getReportById(reportId) {
        return this.request(`/reports/${reportId}`);
    }

    // ==================== ADMIN CONTROLLER ====================

    /**
     * Approve traffic report (Admin only)
     * @param {number} reportId
     * @returns {Promise<ReportResponse>}
     */
    async approveReport(reportId) {
        return this.request(`/admin/approve/${reportId}`, {
            method: 'POST',
        });
    }

    /**
     * Reject traffic report (Admin only)
     * @param {number} reportId
     * @param {string} reason - Rejection reason
     * @returns {Promise<ReportResponse>}
     */
    async rejectReport(reportId, reason) {
        return this.request(`/admin/reject/${reportId}`, {
            method: 'POST',
            body: { reason },
        });
    }

    /**
     * Get admin statistics
     * @returns {Promise<AdminStatistics>}
     */
    async getAdminStats() {
        return this.request('/admin/stats');
    }

    /**
     * Get validation report
     * @returns {Promise<ValidationReport>}
     */
    async getValidationReport() {
        return this.request('/admin/validation-report');
    }

    // ==================== DSA FEATURES ====================

    /**
     * Find blackspots (danger zones) using spatial indexing
     * @param {number} lat - Center latitude
     * @param {number} lng - Center longitude
     * @param {number} radiusKm - Search radius in km
     * @returns {Promise<BlackspotResponse[]>}
     */
    async findBlackspots(lat, lng, radiusKm = 5) {
        return this.request(`/dsa/blackspots?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`);
    }

    /**
     * Find nearest incidents using KD-Tree
     * @param {number} lat
     * @param {number} lng
     * @param {number} topK - Number of nearest incidents
     * @returns {Promise<NearestIncidentResponse[]>}
     */
    async findNearestIncidents(lat, lng, topK = 10) {
        return this.request(`/dsa/nearest?lat=${lat}&lng=${lng}&topK=${topK}`);
    }

    /**
     * Get DSA algorithm performance metrics
     * @returns {Promise<DSAMetrics>}
     */
    async getDSAMetrics() {
        return this.request('/dsa/metrics');
    }
}

export default APIService.getInstance();