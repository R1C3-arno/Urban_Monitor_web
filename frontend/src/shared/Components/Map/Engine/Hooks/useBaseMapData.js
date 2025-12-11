/**
 * useBaseMapData
 * - createDataSourceFactory: async factory or sync function that returns a data source instance
 * - mapToIncidents: rawIncidents => BaseIncident[]
 * - mapToZones: rawZones or incidents => BaseZone[]
 * - mapToMarkers: (items, onClick, createElement) => markerProps[]
 * - createElement: (type, level, item) => DOM element for marker
 *
 * Expect dataSource.fetchAll() returns either:
 *  - { incidents: [...], zones: [...] }
 *  - or array of incidents (then zones mapper should compute)
 */
import { useState, useEffect, useCallback, useMemo } from "react";

export const useBaseMapData = ({
                                   createDataSource,
                                   mapToIncidents,
                                   mapToZones,
                                   mapToMarkers,
                                   createElement,
                                   autoFetch = true,
                                   onItemClick = null,
                               } = {}) => {
    const [items, setItems] = useState([]);
    const [zones, setZones] = useState([]);
    const [dataSource, setDataSource] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const stableOnClick = useCallback((it) => onItemClick?.(it), [onItemClick]);

    // init dataSource (can be sync or async factory)
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const ds = typeof createDataSource === "function"
                    ? await createDataSource()
                    : null;

                if (mounted) setDataSource(ds);
            } catch (err) {
                console.error("[useBaseMapData] createDataSource error:", err);
                if (mounted) setError(err.message);
            }
        })();

        return () => { mounted = false; };
    }, [createDataSource]);

    const fetchData = useCallback(async () => {
        if (!dataSource) return;

        try {
            setLoading(true);
            setError(null);

            const raw = await dataSource.fetchAll();

            const rawIncidents = Array.isArray(raw) ? raw : raw.incidents || [];
            const rawZones = Array.isArray(raw) ? [] : (raw.zones || []);

            const incidents = mapToIncidents ? mapToIncidents(rawIncidents) : rawIncidents;
            const zonesFromBackend = mapToZones
                ? mapToZones(rawZones.length ? rawZones : incidents)
                : [];

            setItems(incidents);
            setZones(zonesFromBackend);
        } catch (err) {
            console.error("[useBaseMapData] fetchData error:", err);
            setError(err.message || String(err));
            setItems([]);
            setZones([]);
        } finally {
            setLoading(false);
        }
    }, [dataSource]);

    useEffect(() => {
        if (autoFetch && dataSource) fetchData();
    }, [autoFetch, dataSource]);


    const markers = useMemo(() => {
        return mapToMarkers ? mapToMarkers(items, stableOnClick, createElement) : [];
    }, [items, stableOnClick, mapToMarkers, createElement]);

    return {
        items,
        zones,
        markers,
        loading,
        error,
        refresh: fetchData,
        isReady: !!dataSource && !loading && !error,
    };
};
