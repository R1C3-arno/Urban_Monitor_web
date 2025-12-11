import { useEffect } from "react";
import DSAService from "@/domains/Citizen/features/Traffic/Services/DSAService.js";

export const NearestIncidentsLayer = ({ visible = true, mapRef }) => {
    useEffect(() => {
        if (!mapRef?.current) return;
        const map = mapRef.current;

        const loadData = async () => {
            const data = await DSAService.getNearestIncidents();

            // ✅ ADD SOURCE
            if (!map.getSource("nearest-incidents")) {
                map.addSource("nearest-incidents", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: data.map(item => ({
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [item.lng, item.lat],
                            },
                            properties: item,
                        })),
                    },
                });
            }

            // ✅ ADD LAYER
            if (!map.getLayer("nearest-incidents-layer")) {
                map.addLayer({
                    id: "nearest-incidents-layer",
                    type: "circle",
                    source: "nearest-incidents",
                    paint: {
                        "circle-radius": 8,
                        "circle-color": "#ff3b3b",
                        "circle-stroke-width": 2,
                        "circle-stroke-color": "#ffffff",
                    },
                });
            }

            // ✅ SHOW / HIDE
            map.setLayoutProperty(
                "nearest-incidents-layer",
                "visibility",
                visible ? "visible" : "none"
            );
        };

        loadData();

        return () => {
            if (map.getLayer("nearest-incidents-layer")) {
                map.removeLayer("nearest-incidents-layer");
            }
            if (map.getSource("nearest-incidents")) {
                map.removeSource("nearest-incidents");
            }
        };
    }, [visible, mapRef]);

    return null;
};
