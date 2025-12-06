// Mockdata

/**
 * TrafficMockService
 * Mock implementation of ITrafficDataSource
 * Follows Liskov Substitution Principle - can replace ITrafficDataSource anywhere
 */

import { ITrafficDataSource } from "./ITrafficDataSource.js";
import { MOCK_CONFIG, TRAFFIC_IMAGES } from "../Config/trafficConfig.js";

export class TrafficMockService extends ITrafficDataSource {
    constructor() {
        super();
        this._dataCache = null;
    }

    /**
     * Fetch incidents from mock JSON file
     * @returns {Promise<Array>}
     */
    async fetchIncidents() {
        try {
            // Use cache if available
            if (this._dataCache) {
                console.log("✅ Using cached mock data");
                return this._dataCache.markers || [];
            }

            console.log(`📥 Fetching mock data from ${MOCK_CONFIG.DATA_PATH}`);
            const response = await fetch(MOCK_CONFIG.DATA_PATH);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Map image strings to imported assets
            const processedMarkers = (data.markers || []).map(marker => ({
                ...marker,
                image: this._resolveImage(marker.image),
            }));

            this._dataCache = { ...data, markers: processedMarkers };

            console.log(`✅ Loaded ${processedMarkers.length} mock incidents`);
            return processedMarkers;

        } catch (error) {
            console.error("❌ Mock service error:", error);
            throw new Error(`Failed to load mock data: ${error.message}`);
        }
    }

    /**
     * Fetch single incident by ID from mock data
     * @param {string|number} id
     * @returns {Promise<Object>}
     */
    async fetchIncidentById(id) {
        const incidents = await this.fetchIncidents();
        const incident = incidents.find(item => item.id === id || item.id === Number(id));

        if (!incident) {
            throw new Error(`Incident with ID ${id} not found`);
        }

        return incident;
    }

    /**
     * Mock report incident (simulates API call)
     * @param {Object} incidentData
     * @returns {Promise<Object>}
     */
    async reportIncident(incidentData) {
        // Simulate network delay
        await this._simulateDelay(500);

        console.log("📝 Mock: Reporting incident", incidentData);

        // Return mock response
        return {
            id: Date.now(), // Generate mock ID
            ...incidentData,
            status: "PENDING",
            timestamp: Date.now(),
            reporter: "Mock User",
        };
    }

    /**
     * Get service name
     * @returns {string}
     */
    getName() {
        return "TrafficMockService";
    }

    /**
     * Clear cache (useful for testing)
     */
    clearCache() {
        this._dataCache = null;
        console.log("🗑️ Mock data cache cleared");
    }

    // ==================== PRIVATE HELPERS ====================

    /**
     * Resolve image string to imported asset
     * @param {string} imageKey
     * @returns {string|null}
     */
    _resolveImage(imageKey) {
        if (!imageKey) return null;

        const resolvedImage = TRAFFIC_IMAGES[imageKey];

        if (!resolvedImage) {
            console.warn(`⚠️ Image "${imageKey}" not found in TRAFFIC_IMAGES`);
            return null;
        }

        return resolvedImage;
    }

    /**
     * Simulate network delay
     * @param {number} ms
     * @returns {Promise<void>}
     */
    _simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}