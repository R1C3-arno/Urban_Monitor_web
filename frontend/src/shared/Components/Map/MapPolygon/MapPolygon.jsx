import { useEffect } from "react";

/**
 * ✅ MAP POLYGON CORE
 * -----------------------------------------
 * Props:
 * - coords: Array<[lng, lat]>
 * - color: string
 * - opacity: number
 */
export default function MapPolygon({
                                       coords = [],
                                       color = "#ff0000",
                                       opacity = 0.3,
                                   }) {
    useEffect(() => {
        if (!window.mapInstance || !coords.length) return;

        const map = window.mapInstance;
        const id = `polygon-${Math.random()}`;

        // ✅ Add source
        map.addSource(id, {
            type: "geojson",
            data: {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [coords],
                },
            },
        });

        // ✅ Add layer
        map.addLayer({
            id,
            type: "fill",
            source: id,
            paint: {
                "fill-color": color,
                "fill-opacity": opacity,
            },
        });

        return () => {
            if (map.getLayer(id)) map.removeLayer(id);
            if (map.getSource(id)) map.removeSource(id);
        };
    }, [coords, color, opacity]);

    return null;
}
