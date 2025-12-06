//Real API

/**
 * TrafficAPIService
 * Real API implementation of ITrafficDataSource
 * Follows Liskov Substitution Principle
 */

import axios from "axios";
import { ITrafficDataSource } from "./ITrafficDataSource.js";
import { TRAFFIC_API_CONFIG } from "../Config/trafficConfig.js";

export class TrafficAPIService extends ITrafficDataSource {
    constructor() {
        super();

        // Configure axios instance
        this._client = axios.create({
            baseURL: TRAFFIC_API_CONFIG.BASE_URL,
            timeout: TRAFFIC_API_CONFIG.TIMEOUT,
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Add request interceptor for logging
        this._client.interceptors.request.use(
            (config) => {
                console.log(`🌐 API Request: ${config.method.toUpperCase()} ${config.url}`);
                return config;
            },
            (error) => {
                console.error("❌ API Request Error:", error);
                return Promise.reject(error);
            }
        );

        // Add response interceptor for error handling
        this._client.interceptors.response.use(
            (response) => {
                console.log(`✅ API Response: ${response.config.url}`, response.status);
                return response;
            },
            (error) => {
                console.error("❌ API Response Error:", error.response?.status, error.message);
                return Promise.reject(this._handleError(error));
            }
        );
    }

    /**
     * Fetch incidents from API
     * @returns {Promise<Array>}
     */
    async fetchIncidents() {
        try {
            const response = await this._client.get(TRAFFIC_API_CONFIG.ENDPOINTS.GET_MAP_DATA);

            // Backend returns: { markers: [...], meta: {...} }
            const incidents = response.data.markers || [];

            console.log(`✅ Loaded ${incidents.length} incidents from API`);
            return incidents;

        } catch (error) {
            console.error("❌ Failed to fetch incidents:", error);
            throw error;
        }
    }

    /**
     * Fetch single incident by ID
     * @param {string|number} id
     * @returns {Promise<Object>}
     */
    async fetchIncidentById(id) {
        try {
            const endpoint = TRAFFIC_API_CONFIG.ENDPOINTS.GET_INCIDENT_DETAIL.replace(":id", id);
            const response = await this._client.get(endpoint);

            return response.data;

        } catch (error) {
            console.error(`❌ Failed to fetch incident ${id}:`, error);
            throw error;
        }
    }

    /**
     * Report new incident to API
     * @param {Object} incidentData
     * @returns {Promise<Object>}
     */
    async reportIncident(incidentData) {
        try {
            const response = await this._client.post(
                TRAFFIC_API_CONFIG.ENDPOINTS.REPORT_INCIDENT,
                incidentData
            );

            console.log("✅ Incident reported successfully:", response.data);
            return response.data;

        } catch (error) {
            console.error("❌ Failed to report incident:", error);
            throw error;
        }
    }

    /**
     * Get service name
     * @returns {string}
     */
    getName() {
        return "TrafficAPIService";
    }

    // ==================== PRIVATE HELPERS ====================

    /**
     * Handle and normalize API errors
     * @param {Error} error
     * @returns {Error}
     */
    _handleError(error) {
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const message = error.response.data?.message || error.message;

            switch (status) {
                case 400:
                    return new Error(`Bad Request: ${message}`);
                case 401:
                    return new Error("Unauthorized: Please login");
                case 403:
                    return new Error("Forbidden: Access denied");
                case 404:
                    return new Error("Not Found: Resource does not exist");
                case 500:
                    return new Error("Server Error: Please try again later");
                default:
                    return new Error(`HTTP ${status}: ${message}`);
            }
        } else if (error.request) {
            // Request made but no response
            return new Error("Network Error: No response from server");
        } else {
            // Something else happened
            return new Error(`Request Error: ${error.message}`);
        }
    }
}