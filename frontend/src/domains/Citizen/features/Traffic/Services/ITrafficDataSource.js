//Interface (DIP)

/**
 * ITrafficDataSource Interface
 * Defines contract for traffic data sources
 * Follows Dependency Inversion Principle (DIP)
 *
 * High-level modules should not depend on low-level modules.
 * Both should depend on abstractions (interfaces).
 */

/**
 * Abstract interface for traffic data sources
 * Implementations: TrafficAPIService, TrafficMockService
 */
export class ITrafficDataSource {
    /**
     * Fetch all traffic incidents
     * @returns {Promise<Array>} Array of raw incident data
     */
    async fetchIncidents() {
        throw new Error("Method 'fetchIncidents()' must be implemented");
    }

    /**
     * Fetch a single incident by ID
     * @param {string|number} id - Incident ID
     * @returns {Promise<Object>} Raw incident data
     */
    async fetchIncidentById(id) {
        throw new Error("Method 'fetchIncidentById()' must be implemented");
    }

    /**
     * Report a new incident
     * @param {Object} incidentData - Incident to report
     * @returns {Promise<Object>} Created incident data
     */
    async reportIncident(incidentData) {
        throw new Error("Method 'reportIncident()' must be implemented");
    }

    /**
     * Get data source name for debugging
     * @returns {string}
     */
    getName() {
        throw new Error("Method 'getName()' must be implemented");
    }
}

/**
 * Factory function to create appropriate data source
 * @param {boolean} useMock - Whether to use mock data
 * @returns {ITrafficDataSource}
 */
export const createTrafficDataSource = async (useMock = true) => {
    if (useMock) {
        const { TrafficMockService } = await import("./TrafficMockService.js");
        return new TrafficMockService();
    } else {
        const { TrafficAPIService } = await import("./TrafficAPIService.js");
        return new TrafficAPIService();
    }
};