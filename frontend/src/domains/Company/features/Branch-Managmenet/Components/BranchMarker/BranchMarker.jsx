import React, { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "./BranchMarker.css";
import { createMarkerDOM } from "./BranchMarkerFactory";

const BranchMarker = ({ map, data = [] }) => {
    const markersRef = useRef([]);

    useEffect(() => {
        if (!map || !Array.isArray(data)) return;

        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        data.forEach(marker => {
            const element = createMarkerDOM(marker);
            if (!element) return;

            if (!marker.coords || !Array.isArray(marker.coords)) {
                console.warn("Log Warning️: Invalid marker coords:", marker);
                return;
            }

            const [lng, lat] = marker.coords;

            if (isNaN(lng) || isNaN(lat)) {
                console.warn("Log Warning️: NaN coords:", { lng, lat, marker });
                return;
            }

            new maptilersdk.Marker({ element })
                .setLngLat([lng, lat])
                .addTo(map);

            try {
                const el = marker.element;
                if (!el) {
                    console.warn("Log Warning️: No element for marker:", marker);
                    return;
                }

                const markerObj = new maptilersdk.Marker({ element: el })
                    .setLngLat([lng, lat])
                    .addTo(map);

                // ✅ Click handler
                if (marker.onClick) {
                    el.addEventListener("click", () => {
                        marker.onClick();
                    });
                }

                console.log("✅ Marker added:", marker.id, [lng, lat]);
            } catch (e) {
                console.error("Log Error: Error adding marker:", e, marker);
            }
        });
    }, [map, data]);

    return null;
};

export default BranchMarker;
