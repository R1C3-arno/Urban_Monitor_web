import { useEffect, useRef } from "react";
import { CIRCLE_CONFIG } from "../../Config/branchConfig.js";

const BranchCircle = ({ map, data = [], opacity = CIRCLE_CONFIG.OPACITY }) => {
    const instanceIdRef = useRef(`branch-${crypto.randomUUID()}`);
    const addedLayersRef = useRef(new Set());
    const addedSourcesRef = useRef(new Set());

    useEffect(() => {
        if (!map || !Array.isArray(data)) return;

        let cancelled = false;

        const draw = () => {
            if (cancelled) return;

            data.forEach((zone) => {
                const sourceId = `${instanceIdRef.current}-source-${zone.id}`;
                const layerId = `${instanceIdRef.current}-layer-${zone.id}`;

                if (map.getSource(sourceId)) return;

                if (!zone.coords || !Array.isArray(zone.coords)) return;

                const coords = zone.coords;
                const first = coords[0];
                const last = coords[coords.length - 1];
                const ring = (first[0] !== last[0] || first[1] !== last[1]) 
                    ? [...coords, first] 
                    : coords;

                map.addSource(sourceId, {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: [ring],
                        },
                        properties: {
                            id: zone.id,
                            level: zone.level,
                        },
                    },
                });

                map.addLayer({
                    id: layerId,
                    type: "fill",
                    source: sourceId,
                    paint: {
                        "fill-color": zone.color || "#3B82F6",
                        "fill-opacity": opacity,
                        "fill-outline-color": "#000000",
                    },
                });

                addedSourcesRef.current.add(sourceId);
                addedLayersRef.current.add(layerId);
            });

            const activeLayerIds = new Set(
                data.map(z => `${instanceIdRef.current}-layer-${z.id}`)
            );
            const activeSourceIds = new Set(
                data.map(z => `${instanceIdRef.current}-source-${z.id}`)
            );

            addedLayersRef.current.forEach((layerId) => {
                if (!activeLayerIds.has(layerId)) {
                    if (map.getLayer(layerId)) map.removeLayer(layerId);
                    addedLayersRef.current.delete(layerId);
                }
            });

            addedSourcesRef.current.forEach((sourceId) => {
                if (!activeSourceIds.has(sourceId)) {
                    if (map.getSource(sourceId)) map.removeSource(sourceId);
                    addedSourcesRef.current.delete(sourceId);
                }
            });
        };

        if (map.isStyleLoaded()) draw();
        else map.once("load", draw);

        return () => {
            cancelled = true;
            addedLayersRef.current.forEach(id => {
                if (map.getLayer(id)) map.removeLayer(id);
            });
            addedSourcesRef.current.forEach(id => {
                if (map.getSource(id)) map.removeSource(id);
            });
            addedLayersRef.current.clear();
            addedSourcesRef.current.clear();
        };

    }, [map, data, opacity]);

    return null;
};

export default BranchCircle;
