import { useEffect, useState } from "react";
import DSAService from "@/domains/Citizen/features/Traffic/Services/DSAService.js";

/**
 * Blackspot Heatmap Layer (MapTiler SDK version)
 */
export const BlackspotLayer = ({ visible = true, top = 5, mapRef }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!mapRef?.current) return;
        const map = mapRef.current;

        if (visible) {
            loadBlackspots(map);
        } else {
            hideLayer(map);
        }

        return () => {
            removeLayer(map);
        };
    }, [visible, top, mapRef]);

    const hideLayer = (map) => {
        if (map.getLayer("blackspot-circles")) {
            map.setLayoutProperty("blackspot-circles", "visibility", "none");
        }
        if (map.getLayer("blackspot-labels")) {
            map.setLayoutProperty("blackspot-labels", "visibility", "none");
        }
    };

    const removeLayer = (map) => {
        if (map.getLayer("blackspot-labels")) map.removeLayer("blackspot-labels");
        if (map.getLayer("blackspot-circles")) map.removeLayer("blackspot-circles");
        if (map.getSource("blackspots")) map.removeSource("blackspots");
    };

    const loadBlackspots = async (map) => {
        setLoading(true);
        try {
            const data = await DSAService.getBlackspots(top);
            const blackspots = data.blackspots || [];

            const geojson = {
                type: "FeatureCollection",
                features: blackspots.map((spot, index) => ({
                    type: "Feature",
                    id: index,
                    geometry: {
                        type: "Point",
                        coordinates: [spot.lng, spot.lat],
                    },
                    properties: {
                        incidentCount: spot.incidentCount,
                        severityScore: spot.severityScore,
                        riskLevel: spot.riskLevel,
                        recentIncidents: spot.recentIncidents,
                    },
                })),
            };

            // ✅ ADD OR UPDATE SOURCE
            if (map.getSource("blackspots")) {
                map.getSource("blackspots").setData(geojson);
            } else {
                map.addSource("blackspots", {
                    type: "geojson",
                    data: geojson,
                });
            }

            // ✅ HEAT CIRCLES
            if (!map.getLayer("blackspot-circles")) {
                map.addLayer({
                    id: "blackspot-circles",
                    type: "circle",
                    source: "blackspots",
                    paint: {
                        "circle-radius": [
                            "interpolate",
                            ["linear"],
                            ["get", "severityScore"],
                            0, 20,
                            10, 40,
                            20, 60,
                        ],
                        "circle-color": [
                            "match",
                            ["get", "riskLevel"],
                            "VERY_HIGH", "#DC2626",
                            "HIGH", "#EA580C",
                            "MEDIUM", "#F59E0B",
                            "LOW", "#84CC16",
                            "#6B7280",
                        ],
                        "circle-opacity": 0.3,
                        "circle-stroke-width": 2,
                        "circle-stroke-color": [
                            "match",
                            ["get", "riskLevel"],
                            "VERY_HIGH", "#DC2626",
                            "HIGH", "#EA580C",
                            "MEDIUM", "#F59E0B",
                            "LOW", "#84CC16",
                            "#6B7280",
                        ],
                        "circle-stroke-opacity": 0.8,
                    },
                });
            }

            // ✅ LABELS
            if (!map.getLayer("blackspot-labels")) {
                map.addLayer({
                    id: "blackspot-labels",
                    type: "symbol",
                    source: "blackspots",
                    layout: {
                        "text-field": ["get", "incidentCount"],
                        "text-size": 14,
                        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                    },
                    paint: {
                        "text-color": "#FFFFFF",
                        "text-halo-color": "#000000",
                        "text-halo-width": 2,
                    },
                });
            }

            // ✅ SHOW
            map.setLayoutProperty("blackspot-circles", "visibility", "visible");
            map.setLayoutProperty("blackspot-labels", "visibility", "visible");

            console.log("✅ Blackspots loaded:", blackspots);
        } catch (error) {
            console.error("❌ Failed to load blackspots:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <div
                    style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        background: "#fff",
                        padding: "10px 15px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        zIndex: 999,
                    }}
                >
                    🔍 Analyzing blackspots...
                </div>
            )}
        </>
    );
};
