import { useState, useEffect, useCallback, useMemo } from "react";
import { createBranchDataSource } from "../Services/IBranchDataSource.js";
import { mapToBranches, mapToZones } from "../Mappers/branchDataMapper.js";
import { mapBranchesToMarkers } from "../Mappers/branchMarkerMapper.js";
import { mapZonesToCircles } from "../Mappers/branchCircleMapper.js";
import { MOCK_CONFIG } from "../Config/branchConfig.js";

export const useBranchData = ({
                                  useMock = false,
                                  autoFetch = true,
                                  onBranchClick = null,
                              } = {}) => {
    const [branches, setBranches] = useState([]);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dataSource, setDataSource] = useState(null);

    const stableOnBranchClick = useCallback((branch) => {
        onBranchClick?.(branch);
    }, [onBranchClick]);

    // ✅ INIT dataSource ONLY ONCE (empty dependency)
    useEffect(() => {
        const initDataSource = async () => {
            try {
                console.log("📥 Initializing data source...");
                const source = await createBranchDataSource(false);
                console.log("✅ Data source ready:", source.getName());
                setDataSource(source);
            } catch (err) {
                console.error("❌ Failed to initialize data source:", err);
                setError("Không thể khởi tạo data source");
            }
        };
        initDataSource();
    }, []); // ✅ Empty array = run only once

    const fetchData = useCallback(async () => {
        if (!dataSource) {
            console.warn("⚠️ Data source not ready");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            console.log("📡 Fetching branches...");
            const rawData = await dataSource.fetchBranches();
            console.log("✅ Raw data received:", rawData.length, "branches");

            const branchModels = mapToBranches(rawData);
            console.log("✅ Branches mapped:", branchModels.length);

            const zoneModels = mapToZones(branchModels);
            console.log("✅ Zones mapped:", zoneModels.length);

            setBranches(branchModels);
            setZones(zoneModels);
        } catch (err) {
            console.error("❌ Error fetching branch data:", err);
            setError(err.message || "Không thể tải dữ liệu");
            setBranches([]);
            setZones([]);
        } finally {
            setLoading(false);
        }
    }, [dataSource]);

    // ✅ Fetch data when dataSource is ready (one-time after init)
    useEffect(() => {
        if (autoFetch && dataSource) {
            console.log("🚀 Auto-fetching data...");
            fetchData();
        }
    }, [autoFetch, dataSource]); // ✅ Depends on dataSource init, not branches

    const markers = useMemo(() => {
        console.log("🎯 Mapping", branches.length, "branches to markers");
        const result = mapBranchesToMarkers(branches, stableOnBranchClick);
        console.log("✅ Markers mapped:", result.length);
        return result;
    }, [branches, stableOnBranchClick]);

    const circles = useMemo(() => {
        return mapZonesToCircles(zones);
    }, [zones]);

    const refresh = useCallback(() => {
        return fetchData();
    }, [fetchData]);

    return {
        branches,
        zones,
        markers,
        circles,
        loading,
        error,
        isReady: !loading && !error && dataSource !== null,
        refresh,
        dataSourceName: dataSource?.getName() || "Not initialized",
    };
};