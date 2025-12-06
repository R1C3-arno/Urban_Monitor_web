/**
 * useTrafficData Hook (PERFORMANCE FIXED)
 * Orchestrates traffic data fetching and transformation
 * ✅ FIXES: Infinite re-render loop, memory leak, lag
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { createTrafficDataSource } from "../Services/ITrafficDataSource.js";
import { mapToIncidents, mapToZones } from "../Mappers/trafficDataMapper.js";
import { mapIncidentsToMarkers } from "../Mappers/trafficMarkerMapper.js";
import { mapZonesToCircles } from "../Mappers/trafficCircleMapper.js";
import { MOCK_CONFIG, ERROR_MESSAGES } from "../Config/trafficConfig.js";

/**
 * Custom hook for traffic data management
 * @param {Object} options
 * @param {boolean} options.useMock - Use mock data source
 * @param {boolean} options.autoFetch - Auto-fetch on mount
 * @param {Function} options.onIncidentClick - Callback when incident clicked
 * @returns {Object} Hook state and methods
 */
export const useTrafficData = ({
                                   useMock = MOCK_CONFIG.ENABLED,
                                   autoFetch = true,
                                   onIncidentClick = null,
                               } = {}) => {
    // ==================== STATE ====================
    const [incidents, setIncidents] = useState([]);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dataSource, setDataSource] = useState(null);

    // ✅ CRITICAL FIX: Memoize callback to prevent re-renders
    const stableOnIncidentClick = useCallback((incident) => {
        onIncidentClick?.(incident);
    }, [onIncidentClick]);

    // ==================== INITIALIZE DATA SOURCE ====================
    useEffect(() => {
        const initDataSource = async () => {
            try {
                const source = await createTrafficDataSource(useMock);
                setDataSource(source);
                console.log(`✅ Data source initialized: ${source.getName()}`);
            } catch (err) {
                console.error("❌ Failed to initialize data source:", err);
                setError(ERROR_MESSAGES.LOAD_FAILED);
            }
        };

        initDataSource();
    }, [useMock]);

    // ==================== FETCH DATA ====================
    const fetchData = useCallback(async () => {
        if (!dataSource) {
            console.warn("⚠️ Data source not initialized yet");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            console.log(`📥 Fetching data from ${dataSource.getName()}...`);
            const rawData = await dataSource.fetchIncidents();

            // Transform data through mappers
            const incidentModels = mapToIncidents(rawData);
            const zoneModels = mapToZones(incidentModels);

            // ✅ FIX: Only set domain models, not derived data
            setIncidents(incidentModels);
            setZones(zoneModels);

            console.log("✅ Data loaded successfully:", {
                incidents: incidentModels.length,
                zones: zoneModels.length,
            });

        } catch (err) {
            console.error("❌ Error fetching traffic data:", err);
            setError(err.message || ERROR_MESSAGES.LOAD_FAILED);

            // Clear data on error
            setIncidents([]);
            setZones([]);
        } finally {
            setLoading(false);
        }
    }, [dataSource]); // ✅ FIX: Removed onIncidentClick dependency

    // ==================== MEMOIZED DERIVED DATA ====================
    // ✅ CRITICAL FIX: Memoize to prevent infinite re-renders
    const markers = useMemo(() => {

        return mapIncidentsToMarkers(incidents, stableOnIncidentClick);
    }, [incidents, stableOnIncidentClick]);

    const circles = useMemo(() => {
        const result = mapZonesToCircles(zones);
        console.log('✅ Circles generated:', result.length, result);
        return result;
    }, [zones]);

    // ==================== AUTO FETCH ON MOUNT ====================
    useEffect(() => {
        if (autoFetch && dataSource) {
            fetchData();
        }
    }, [autoFetch, dataSource, fetchData]);

    // ==================== FETCH INCIDENT BY ID ====================
    const fetchIncidentById = useCallback(
        async (id) => {
            if (!dataSource) {
                throw new Error("Data source not initialized");
            }

            try {
                const rawData = await dataSource.fetchIncidentById(id);
                const incident = mapToIncidents([rawData])[0];
                return incident;
            } catch (err) {
                console.error(`❌ Error fetching incident ${id}:`, err);
                throw err;
            }
        },
        [dataSource]
    );

    // ==================== REPORT INCIDENT ====================
    const reportIncident = useCallback(
        async (incidentData) => {
            if (!dataSource) {
                throw new Error("Data source not initialized");
            }

            try {
                const result = await dataSource.reportIncident(incidentData);
                console.log("✅ Incident reported:", result);

                // Refresh data after reporting
                await fetchData();

                return result;
            } catch (err) {
                console.error("❌ Error reporting incident:", err);
                throw err;
            }
        },
        [dataSource, fetchData]
    );

    // ==================== REFRESH DATA ====================
    const refresh = useCallback(() => {
        console.log("🔄 Refreshing traffic data...");
        return fetchData();
    }, [fetchData]);

    // ==================== PUBLIC API ====================
    return {
        // Data
        incidents,
        zones,
        markers,   // ✅ Memoized, stable reference
        circles,   // ✅ Memoized, stable reference

        // State
        loading,
        error,
        isReady: !loading && !error && dataSource !== null,

        // Methods
        refresh,
        fetchIncidentById,
        reportIncident,

        // Meta
        dataSourceName: dataSource?.getName() || "Not initialized",
    };
};