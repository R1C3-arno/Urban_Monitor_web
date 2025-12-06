import React, {useState, useEffect} from "react";
import Map from "../../../../../../shared/Components/Map/BaseMap/Map.jsx";
import {TrafficMarker} from "../TrafficMarker/TrafficMarker.jsx";
import MapPopUp from "../../../../../../shared/Components/Map/MapPopUp/PopUp.jsx";
import TrafficPopUp from "../TrafficPopUp/TrafficPopUp.jsx";
import accident1 from "../../../../../../assets/accident1.jpg"
import accident2 from "../../../../../../assets/accident2.jpg"

import TrafficCircle from "../TrafficCircle/TrafficCircle.jsx";
import {useTrafficData} from "../../Hooks/useTrafficData.js";


import {
    TRAFFIC_MAP_CONFIG,
    GEOLOCATION_CONFIG,
    ERROR_MESSAGES,
} from "../../Config/trafficConfig.js";
import "./TrafficMap.css";

const TrafficMap = () => {
    // ==================== STATE ====================
    const [map, setMap] = useState(null);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    // ==================== CUSTOM HOOK ====================
    const {
        markers,
        circles,
        loading,
        error,
        isReady,
        dataSourceName,
    } = useTrafficData({
        useMock: true, // ✅ Toggle này để switch giữa mock và real API
        autoFetch: true,
        onIncidentClick: (incident) => {
            console.log("📍 Incident clicked:", incident.title);
            setSelectedIncident(incident);
        },
    });

    // ==================== EVENT HANDLERS ====================

    const handleMapClick = (e) => {
        console.log("🗺️ Map clicked:", e.lngLat);
        setSelectedIncident(null); // Close popup when clicking map
    };

    const handleUserLocationFound = (location) => {
        console.log("📍 User location found:", location);

        try {
            setUserLocation(location);

            // Fly to user location
            if (map && map.loaded && typeof map.flyTo === "function") {
                console.log("✈️ Flying to user location...");

                map.flyTo({
                    center: [location.lng, location.lat],
                    zoom: 15,
                    duration: 2000,
                    essential: true,
                });

                console.log("✅ Fly animation started");
            } else {
                console.warn("⚠️ Map not ready for flyTo");

                // Fallback: just setCenter
                if (map && typeof map.setCenter === "function") {
                    map.setCenter([location.lng, location.lat]);
                    map.setZoom(15);
                }
            }
        } catch (error) {
            console.error("❌ Error in handleUserLocationFound:", error);
        }
    };

    const handleGeolocationError = (errorMsg) => {
        console.error("❌ Geolocation error:", errorMsg);

        // User-friendly error messages
        let message = ERROR_MESSAGES.GEOLOCATION_UNAVAILABLE;

        if (typeof errorMsg === "string") {
            if (errorMsg.includes("denied")) {
                message = ERROR_MESSAGES.GEOLOCATION_DENIED;
            } else if (errorMsg.includes("timeout")) {
                message = ERROR_MESSAGES.GEOLOCATION_TIMEOUT;
            }
        }

        alert(message);
    };

    const handlePopupClose = () => {
        console.log("❌ Closing popup");
        setSelectedIncident(null);
    };

    // ==================== RENDER ====================

    // Loading state
    if (loading) {
        return (
            <div className="traffic-map-loading">
                <p>Đang tải bản đồ giao thông...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="traffic-map-error">
                <p>❌ {error}</p>
                <p>Nguồn dữ liệu: {dataSourceName}</p>
            </div>
        );
    }

    return (
        <div className="traffic-map">
            <Map
                center={TRAFFIC_MAP_CONFIG.DEFAULT_CENTER}
                zoom={TRAFFIC_MAP_CONFIG.DEFAULT_ZOOM}
                markers={markers}
                getMap={setMap}
                onMapClick={handleMapClick}
                enableGeolocation={GEOLOCATION_CONFIG.ENABLED}
                geolocatePosition={GEOLOCATION_CONFIG.POSITION}
                trackUserLocation={GEOLOCATION_CONFIG.TRACK_USER}
                showAccuracyCircle={GEOLOCATION_CONFIG.SHOW_ACCURACY_CIRCLE}
                maxAccuracyRadius={GEOLOCATION_CONFIG.MAX_ACCURACY_RADIUS} //  GIỚI HẠN 50M
                onUserLocationFound={handleUserLocationFound}
                onGeolocationError={handleGeolocationError}
            />



            {/* Traffic Circles (Danger Zones) */}
            {map && circles.length > 0 && (

                <TrafficCircle map={map} data={circles}/>

            )}

            {/* Popup for selected incident */}
            {selectedIncident && map && (
                <div className="map-popup-container">
                    <MapPopUp
                        map={map}
                        coords={selectedIncident.coords}
                        onClose={handlePopupClose}
                    >
                        <TrafficPopUp data={selectedIncident.toJSON()}/>
                    </MapPopUp>
                </div>
            )}

            {/* Debug info (remove in production) */}
            {process.env.NODE_ENV === "development" && (
                <div
                    style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        background: "rgba(0,0,0,0.7)",
                        color: "white",
                        padding: "8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        zIndex: 1000,
                    }}
                >
                    <div>📊 Data: {dataSourceName}</div>
                    <div>📍 Incidents: {markers.length}</div>
                    <div>⭕ Zones: {circles.length}</div>
                    {userLocation && (
                        <div>
                            📌 User: [{userLocation.lng.toFixed(4)}, {userLocation.lat.toFixed(4)}]
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrafficMap;
