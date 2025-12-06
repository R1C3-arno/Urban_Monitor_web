/**
 * Traffic Data Mapper
 * Converts raw API/Mock data → Domain Models
 * Follows Single Responsibility Principle - only does data mapping
 */

import { TrafficIncident } from "../Models/TrafficIncident.js";
import { TrafficZone } from "../Models/TrafficZone.js";
import { CIRCLE_CONFIG } from "../Config/trafficConfig.js";

/**
 * Map raw data array to TrafficIncident instances
 * @param {Array} rawData - Raw data from API/Mock
 * @returns {Array<TrafficIncident>}
 */
export const mapToIncidents = (rawData) => {
    if (!Array.isArray(rawData)) {
        console.warn("⚠️ mapToIncidents: Expected array, got", typeof rawData);
        return [];
    }

    const incidents = [];

    for (const item of rawData) {
        try {
            const incident = TrafficIncident.fromAPI(item);
            incidents.push(incident);
        } catch (error) {
            console.error(`❌ Failed to map incident ${item.id}:`, error.message);
            // Skip invalid items instead of crashing
        }
    }

    console.log(`✅ Mapped ${incidents.length}/${rawData.length} incidents`);
    return incidents;
};

/**
 * Map TrafficIncidents to TrafficZones
 * @param {Array<TrafficIncident>} incidents
 * @param {Object} radiusConfig - Optional custom radius config
 * @returns {Array<TrafficZone>}
 */
export const mapToZones = (incidents, radiusConfig = CIRCLE_CONFIG.RADIUS_BY_LEVEL) => {
    if (!Array.isArray(incidents)) {
        console.warn("⚠️ mapToZones: Expected array, got", typeof incidents);
        return [];
    }

    const zones = [];

    for (const incident of incidents) {
        try {
            const zone = TrafficZone.fromIncident(incident, radiusConfig);
            zones.push(zone);
        } catch (error) {
            console.error(`❌ Failed to create zone for incident ${incident.id}:`, error.message);
        }
    }

    console.log(`✅ Created ${zones.length} zones from ${incidents.length} incidents`);
    return zones;
};

/**
 * Filter incidents by level
 * @param {Array<TrafficIncident>} incidents
 * @param {string|Array<string>} levels - Single level or array of levels
 * @returns {Array<TrafficIncident>}
 */
export const filterByLevel = (incidents, levels) => {
    const levelArray = Array.isArray(levels) ? levels : [levels];
    return incidents.filter(incident => levelArray.includes(incident.level));
};

/**
 * Sort incidents by priority (HIGH → MEDIUM → LOW)
 * @param {Array<TrafficIncident>} incidents
 * @returns {Array<TrafficIncident>}
 */
export const sortByPriority = (incidents) => {
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };

    return [...incidents].sort((a, b) => {
        return priorityOrder[a.level] - priorityOrder[b.level];
    });
};

/**
 * Group incidents by level
 * @param {Array<TrafficIncident>} incidents
 * @returns {Object} { HIGH: [...], MEDIUM: [...], LOW: [...] }
 */
export const groupByLevel = (incidents) => {
    return incidents.reduce((acc, incident) => {
        if (!acc[incident.level]) {
            acc[incident.level] = [];
        }
        acc[incident.level].push(incident);
        return acc;
    }, { HIGH: [], MEDIUM: [], LOW: [] });
};