/**
 * GeolocationControl Component (Updated)
 * Wrapper for MapTiler GeolocateControl with accuracy radius limiting
 * ✅ FIX: Limits GPS accuracy circle size via maxAccuracyRadius prop
 */

import React, {useEffect, useRef} from 'react';
import * as maptilersdk from '@maptiler/sdk';
import './GeolocationControl.css';

const GeolocationControl = ({
                                map,
                                position = 'top-right',
                                trackUserLocation = false,
                                showUserLocation = true,
                                showAccuracyCircle = false,
                                maxAccuracyRadius = 100, // ✅ DEFAULT 100m (was unlimited before)
                                onGeolocate,
                                onError,
                            }) => {
    const controlRef = useRef(null);
    const isAddedRef = useRef(false);

    useEffect(() => {
        if (!map || isAddedRef.current) {
            console.log('⏭️ Skipping GeolocateControl creation (already exists or no map)');
            return;
        }

        console.log('🔧 Creating GeolocateControl...');

        try {
            const geolocateControl = new maptilersdk.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                },
                trackUserLocation,
                showUserLocation,
                showAccuracyCircle: showAccuracyCircle && maxAccuracyRadius > 0,
            });

            // Check if control already exists on map
            const existingControls = map._controls || [];
            const hasGeolocate = existingControls.some(
                (ctrl) => ctrl instanceof maptilersdk.GeolocateControl
            );

            if (hasGeolocate) {
                console.log('⚠️ GeolocateControl already exists on map, skipping');
                return;
            }

            // Add control
            const safePosition = ["top-left", "top-right", "bottom-left", "bottom-right"].includes(position)
                ? position
                : "top-right";

            map.addControl(geolocateControl, safePosition);

            controlRef.current = geolocateControl;
            isAddedRef.current = true;

            console.log('✅ GeolocateControl added to map');

            // ==================== EVENT LISTENERS ====================

            geolocateControl.on('geolocate', (e) => {
                console.log('📍 Geolocate event');

                try {
                    const locationData = {

                        lng: e.coords.longitude,
                        lat: e.coords.latitude,
                        accuracy: e.coords.accuracy,
                        heading: e.coords.heading,
                        speed: e.coords.speed,
                        timestamp: e.timestamp,
                    };
                    map.easeTo({
                        center: [locationData.lng, locationData.lat],
                        zoom: 16,
                        duration: 800
                    });


                    console.log('📍 Location:', locationData);

                    // ✅ FIX: Apply maxAccuracyRadius limit to accuracy circle
                    if (showAccuracyCircle && maxAccuracyRadius) {
                        // pass center coords explicitly
                        applyAccuracyRadiusLimit(map, locationData.accuracy, maxAccuracyRadius, {
                            lng: locationData.lng,
                            lat: locationData.lat
                        });

                    }

                    onGeolocate?.(locationData);
                } catch (err) {
                    console.error('❌ Error in geolocate callback:', err);
                }
            });

            geolocateControl.on('error', (e) => {
                console.error('❌ Geolocation error:', e);

                let errorMessage = 'Unable to get location';
                if (e.code === 1) errorMessage = 'Permission denied';
                else if (e.code === 2) errorMessage = 'Position unavailable';
                else if (e.code === 3) errorMessage = 'Timeout';
                else if (e.message) errorMessage = e.message;

                onError?.(errorMessage);
            });

            geolocateControl.on('trackuserlocationstart', () => {
                console.log('🎯 Tracking started');
            });

            geolocateControl.on('trackuserlocationend', () => {
                console.log('⏹️ Tracking stopped');
            });

        } catch (error) {
            console.error('❌ Failed to create GeolocateControl:', error);
            onError?.('Failed to initialize location control');
        }

        // ==================== CLEANUP ====================
        return () => {
            console.log('🧹 Cleaning up GeolocateControl');

            try {
                if (controlRef.current && map && isAddedRef.current) {
                    console.log('🗑️ Removing GeolocateControl from map');
                    map.removeControl(controlRef.current);
                    controlRef.current = null;
                    isAddedRef.current = false;
                }
            } catch (error) {
                console.error('❌ Error during cleanup:', error);
            }
        };
    }, [map, position, trackUserLocation, showUserLocation, showAccuracyCircle, maxAccuracyRadius]);

    return null;
};

// --- REPLACE existing applyAccuracyRadiusLimit with this implementation ---
/**
 * Create a circular polygon (approx) around a coordinate.
 * Returns an array of [lng, lat] pairs forming a closed ring.
 *
 * Uses simple equirectangular approximation by sampling angles.
 * Accurate enough for radii up to several kilometers and UI display.
 */
const createCircleCoords = (centerLng, centerLat, radiusMeters, points = 64) => {
    const coords = [];
    const earthRadius = 6378137;

    const latRad = (centerLat * Math.PI) / 180;

    for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;

        const dx = radiusMeters * Math.cos(angle);
        const dy = radiusMeters * Math.sin(angle);

        const dLng = dx / (earthRadius * Math.cos(latRad)) * (180 / Math.PI);
        const dLat = dy / earthRadius * (180 / Math.PI);

        coords.push([centerLng + dLng, centerLat + dLat]);
    }

    coords.push(coords[0]);
    return coords;
};


/**
 * Draw or update a custom accuracy polygon and user point
 */
const applyAccuracyRadiusLimit = (map, locationAccuracy, maxRadius, center) => {
    try {
        if (!map || !center) return;

        const safeAccuracy =
            typeof locationAccuracy === "number" && locationAccuracy > 0
                ? locationAccuracy
                : maxRadius;

        const limitedRadius = Math.min(safeAccuracy, maxRadius);


        const accCoords = createCircleCoords(center.lng, center.lat, limitedRadius, 64);
        const polygon = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [accCoords],
            },
            properties: {
                accuracy: limitedRadius,
            },
        };

        // Add/update source + layer for accuracy polygon
        const accSourceId = "user-accuracy-source";
        const accLayerId = "user-accuracy-layer";
        if (!map.getSource(accSourceId)) {
            map.addSource(accSourceId, {type: "geojson", data: polygon});
            // Add fill layer
            map.addLayer({
                id: accLayerId,
                type: "fill",
                source: accSourceId,
                paint: {
                    "fill-color": "rgba(59,130,246,0.10)",
                    "fill-outline-color": "rgba(59,130,246,0.2)",
                },
            });
        } else {
            map.getSource(accSourceId).setData(polygon);
        }

        // Add/update point marker for user location
        const userPointSource = "user-point-source";
        const userPointLayer = "user-point-layer";
        const pointFeature = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [center.lng, center.lat],
            },
            properties: {},
        };

        if (!map.getSource(userPointSource)) {
            map.addSource(userPointSource, {type: "geojson", data: pointFeature});
            map.addLayer({
                id: userPointLayer,
                type: "circle",
                source: userPointSource,
                paint: {
                    "circle-radius": 8,
                    "circle-color": "#3b82f6",
                    "circle-stroke-color": "white",
                    "circle-stroke-width": 2,
                },
            });
        } else {
            map.getSource(userPointSource).setData(pointFeature);
        }
    } catch (err) {
        console.warn("⚠️ applyAccuracyRadiusLimit failed:", err.message);
    }
};


export default GeolocationControl;