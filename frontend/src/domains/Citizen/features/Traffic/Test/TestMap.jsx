/**
 * UPDATED TrafficMap.jsx
 * Tích hợp tất cả APIs, OOP Models, DSA Structures, Algorithms
 */

import React, { useState, useEffect, useRef } from "react";
import Map from "@/shared/Components/Map/BaseMap/Map.jsx";
import {TrafficMarker} from "@/domains/Citizen/features/Traffic/Components/TrafficMarker/TrafficMarker.jsx";
import MapPopUp from "@/shared/Components/Map/MapPopUp/PopUp.jsx";
import TrafficPopUp from "@/domains/Citizen/features/Traffic/Components/TrafficPopUp/TrafficPopUp.jsx";

import {
    BlackspotsVisualization,
    AlgorithmComparisonPanel,
    RouteExplorer,
    ValidationChainDisplay,
    AdminPanelComponent
} from "@/domains/Citizen/features/Traffic/Test/DSAComp.jsx";

import {
    useTrafficData,
    useRouteFinding,
    useNearestIncidents,
    useBlackspots,
    useTrafficReports
} from "@/domains/Citizen/features/Traffic/Test/useTrafficHook.js";

import APIService from "@/domains/Citizen/features/Traffic/Test/APIService.js";
import { Coordinate } from "./Models.js";

import {
    TRAFFIC_MAP_CONFIG,
    GEOLOCATION_CONFIG,
    ERROR_MESSAGES
} from "@/domains/Citizen/features/Traffic/Config/trafficConfig.js";


const TrafficMap = () => {
    // ==================== STATE ====================
    const [map, setMap] = useState(null);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef();

    // Feature toggles
    const [showBlackspots, setShowBlackspots] = useState(false);
    const [showRouteFinder, setShowRouteFinder] = useState(false);
    const [showNearestFinder, setShowNearestFinder] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [showAdmin, setShowAdmin] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const [showExplorer, setShowExplorer] = useState(false);

    // Route finding state
    const [startLocation, setStartLocation] = useState(null);
    const [endLocation, setEndLocation] = useState(null);

    // ==================== HOOKS ====================
    const {
        incidents,
        nodes,
        edges,
        blackspots,
        graph,
        kdTree,
        loading,
        error,
        isReady,
        dataSourceName,
    } = useTrafficData({
        useMock: false,
        autoFetch: true,
        onIncidentClick: (incident) => {
            console.log("Incident clicked:", incident.title);
            setSelectedIncident(incident);
        },
    });

    const {
        route,
        comparison,
        explorationSteps,
        loading: routeLoading,
        error: routeError,
        findRoute,
        compareAlgorithms,
    } = useRouteFinding(graph);

    const {
        nearest,
        loading: nearestLoading,
        findNearest,
    } = useNearestIncidents(kdTree, incidents);

    const {
        reports,
        pendingReports,
        fetchPendingReports,
    } = useTrafficReports();

    // ==================== EVENT HANDLERS ====================

    const handleMapClick = (e) => {
        console.log("Map clicked:", e.lngLat);
        setSelectedIncident(null);

        // Route finder: Set start or end location
        if (showRouteFinder) {
            const coord = new Coordinate(e.lngLat.lat, e.lngLat.lng);
            if (!startLocation) {
                setStartLocation(coord);
                console.log("Route start set:", coord);
            } else if (!endLocation) {
                setEndLocation(coord);
                findRoute(startLocation, coord, 'DIJKSTRA');
                console.log("Finding route...");
            } else {
                setStartLocation(coord);
                setEndLocation(null);
            }
        }
    };

    const handleUserLocationFound = (location) => {
        console.log("User location found:", location);
        const coord = new Coordinate(location.lat, location.lng);
        setUserLocation(location);

        // Auto-detect nearest incidents
        if (kdTree) {
            findNearest(coord, 5);
        }

        if (map && map.loaded && typeof map.flyTo === "function") {
            map.flyTo({
                center: [location.lng, location.lat],
                zoom: 15,
                duration: 2000,
                essential: true,
            });
        }
    };

    const handleGeolocationError = (errorMsg) => {
        console.error("Geolocation error:", errorMsg);
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
        setSelectedIncident(null);
    };

    const handleBlackspotClick = (spot) => {
        if (map) {
            map.flyTo({
                center: [spot.center.lng, spot.center.lat],
                zoom: 16,
            });
        }
    };

    const handleCompareAlgorithms = async () => {
        if (startLocation && endLocation && graph) {
            await compareAlgorithms(startLocation, endLocation);
        }
    };

    // ==================== RENDER ====================

    if (loading) {
        return (
            <div className="traffic-map-loading">
                <p>Đang tải bản đồ giao thông...</p>
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                    Backend: {dataSourceName}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="traffic-map-error">
                <p>❌ {error}</p>
                <p>Nguồn dữ liệu: {dataSourceName}</p>
                <p style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
                    Kiểm tra xem backend API có chạy không (http://localhost:8080)
                </p>
            </div>
        );
    }

    return (
        <div className="traffic-map">
            {/* Base Map */}
            <Map
                center={TRAFFIC_MAP_CONFIG.DEFAULT_CENTER}
                zoom={TRAFFIC_MAP_CONFIG.DEFAULT_ZOOM}
                markers={incidents.map(inc => ({
                    id: inc.id,
                    lngLat: [inc.coords.lng, inc.coords.lat],
                    title: inc.title,
                    color: inc.severityColor,
                    onClick: () => setSelectedIncident(inc),
                }))}
                getMap={setMap}
                onMapClick={handleMapClick}
                enableGeolocation={GEOLOCATION_CONFIG.ENABLED}
                geolocatePosition={GEOLOCATION_CONFIG.POSITION}
                trackUserLocation={GEOLOCATION_CONFIG.TRACK_USER}
                showAccuracyCircle={GEOLOCATION_CONFIG.SHOW_ACCURACY_CIRCLE}
                maxAccuracyRadius={GEOLOCATION_CONFIG.MAX_ACCURACY_RADIUS}
                onUserLocationFound={handleUserLocationFound}
                onGeolocationError={handleGeolocationError}
            />

            {/* Popup cho selected incident */}
            {selectedIncident && map && (
                <div className="map-popup-container">
                    <MapPopUp
                        map={map}
                        coords={selectedIncident.coords}
                        onClose={handlePopupClose}
                    >
                        <TrafficPopUp data={selectedIncident.toJSON()} />
                    </MapPopUp>
                </div>
            )}

            {/* Debug Info */}
            {process.env.NODE_ENV === "development" && (
                <div style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: "rgba(0,0,0,0.8)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    zIndex: 500,
                    maxWidth: "300px",
                }}>
                    <div>📡 Source: {dataSourceName}</div>
                    <div>🚗 Incidents: {incidents.length}</div>
                    <div>🔗 Nodes: {nodes.length}</div>
                    <div>━ Edges: {edges.length}</div>
                    <div>🔥 Blackspots: {blackspots.length}</div>
                    {userLocation && (
                        <div>
                            📍 You: [{userLocation.lng.toFixed(4)}, {userLocation.lat.toFixed(4)}]
                        </div>
                    )}
                    {route && (
                        <div>
                            ✓ Route: {route.distance.toFixed(2)}km (~{route.estimatedTime.toFixed(0)}min)
                        </div>
                    )}
                    <div style={{ marginTop: '5px', fontSize: '10px', color: '#aaa' }}>
                        Graph Ready: {isReady ? '✅' : '⏳'}
                    </div>
                </div>
            )}

            {/* FEATURE TOGGLE BUTTONS */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#fff',
                padding: '12px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 999,
                fontSize: '13px',
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    🧮 DSA Features
                </div>

                <FeatureButton
                    label="🔥 Blackspots"
                    active={showBlackspots}
                    onClick={() => setShowBlackspots(!showBlackspots)}
                    color="#EF4444"
                />

                <FeatureButton
                    label="🛣️ Route Finder"
                    active={showRouteFinder}
                    onClick={() => setShowRouteFinder(!showRouteFinder)}
                    color="#3B82F6"
                />

                <FeatureButton
                    label="📍 Nearest"
                    active={showNearestFinder}
                    onClick={() => setShowNearestFinder(!showNearestFinder)}
                    color="#10B981"
                />

                <FeatureButton
                    label="🔬 Compare Algo"
                    active={showComparison}
                    onClick={() => setShowComparison(!showComparison)}
                    color="#8B5CF6"
                />

                <FeatureButton
                    label="🔍 Explore Route"
                    active={showExplorer}
                    onClick={() => setShowExplorer(!showExplorer)}
                    color="#F59E0B"
                />

                <FeatureButton
                    label="👨‍💼 Admin"
                    active={showAdmin}
                    onClick={() => setShowAdmin(!showAdmin)}
                    color="#F97316"
                />

                <FeatureButton
                    label="🔗 Validation"
                    active={showValidation}
                    onClick={() => setShowValidation(!showValidation)}
                    color="#06B6D4"
                />
            </div>

            {/* ROUTE FINDER INFO */}
            {showRouteFinder && (
                <div style={{
                    position: 'absolute',
                    top: '350px',
                    right: '20px',
                    background: '#fff',
                    padding: '12px',
                    borderRadius: '8px',
                    maxWidth: '250px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 999,
                    fontSize: '12px',
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        🛣️ Route Finder
                    </div>
                    <div style={{ fontSize: '11px', marginBottom: '8px', color: '#666' }}>
                        Click on map to set start & end points
                    </div>

                    {startLocation && (
                        <div style={{ padding: '6px', background: '#ECFDF5', borderRadius: '4px', marginBottom: '6px' }}>
                            ✓ Start: [{startLocation.lng.toFixed(4)}, {startLocation.lat.toFixed(4)}]
                        </div>
                    )}

                    {endLocation && (
                        <div style={{ padding: '6px', background: '#ECFDF5', borderRadius: '4px', marginBottom: '6px' }}>
                            ✓ End: [{endLocation.lng.toFixed(4)}, {endLocation.lat.toFixed(4)}]
                        </div>
                    )}

                    {route && (
                        <div style={{ padding: '8px', background: '#F0F9FF', borderRadius: '4px' }}>
                            📊 <strong>Route Found</strong>
                            <div>Distance: {route.distance.toFixed(2)} km</div>
                            <div>Time: ~{route.estimatedTime.toFixed(0)} min</div>
                            <div>Algorithm: {route.algorithm}</div>
                        </div>
                    )}

                    {routeError && (
                        <div style={{ padding: '6px', background: '#FEF2F2', color: '#DC2626', borderRadius: '4px', fontSize: '11px' }}>
                            ⚠️ {routeError}
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setStartLocation(null);
                            setEndLocation(null);
                        }}
                        style={{
                            width: '100%',
                            marginTop: '8px',
                            padding: '6px',
                            background: '#E5E7EB',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px',
                        }}
                    >
                        Reset Route
                    </button>
                </div>
            )}

            {/* NEAREST INCIDENTS */}
            {showNearestFinder && nearest.length > 0 && (
                <div style={{
                    position: 'absolute',
                    bottom: '120px',
                    right: '20px',
                    background: '#fff',
                    padding: '12px',
                    borderRadius: '8px',
                    maxWidth: '280px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 999,
                    fontSize: '12px',
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        📍 {nearest.length} Nearest Incidents
                    </div>

                    {nearest.map((incident, idx) => (
                        <div
                            key={incident.id}
                            onClick={() => setSelectedIncident(incident)}
                            style={{
                                padding: '6px',
                                marginBottom: '6px',
                                background: '#F9FAFB',
                                borderLeft: `3px solid ${incident.severityColor}`,
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontSize: '11px',
                            }}
                        >
                            <div style={{ fontWeight: 'bold' }}>{idx + 1}. {incident.title}</div>
                            <div style={{ color: '#666', fontSize: '10px' }}>
                                {incident.type} • {incident.severity}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* DSA COMPONENTS */}
            {showBlackspots && (
                <BlackspotsVisualization
                    map={map}
                    incidents={incidents}
                />
            )}

            {showComparison && (
                <AlgorithmComparisonPanel graph={graph} />
            )}

            {showExplorer && (
                <RouteExplorer map={map} graph={graph} />
            )}

            {showValidation && (
                <ValidationChainDisplay visible={true} />
            )}

            {showAdmin && (
                <AdminPanelComponent visible={true} />
            )}
        </div>
    );
};

// ==================== HELPER COMPONENT ====================

const FeatureButton = ({ label, active, onClick, color }) => (
    <button
        onClick={onClick}
        style={{
            display: 'block',
            width: '100%',
            padding: '7px 10px',
            marginBottom: '6px',
            background: active ? color : '#F3F4F6',
            color: active ? '#fff' : '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: active ? 'bold' : 'normal',
            transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
            if (!active) e.target.style.background = '#E5E7EB';
        }}
        onMouseLeave={(e) => {
            if (!active) e.target.style.background = '#F3F4F6';
        }}
    >
        {label}
    </button>
);

export default TrafficMap;