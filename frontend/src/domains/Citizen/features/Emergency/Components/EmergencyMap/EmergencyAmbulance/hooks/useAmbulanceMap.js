import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import * as maptiler3d from '@maptiler/3d';
import {
    MAPTILER_KEY,
    DATA_API_URL,
    AMBULANCE_MODEL_URL,
    LAYER_ID,
    LIGHT_ID
} from '../constants/ambulanceConfig';
import { createAmbulancePopupHTML } from '../utils/ambulancePopupTemplate';

const useAmbulanceMap = (mapContainer) => {
    const map = useRef(null);
    const layer3D = useRef(null);

    const [stats, setStats] = useState({ total: 0, critical: 0, responding: 0 });
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        if (map.current) return;

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.DATAVIZ.DARK,
            center: [106.6297, 16.5],
            zoom: 5.5,
            pitch: 60,
            bearing: 0,
            apiKey: MAPTILER_KEY
        });

        map.current.on('load', async () => {
            try {
                const response = await fetch(DATA_API_URL);
                const backendData = await response.json();

                console.log('BACKEND RESPONSE:', backendData);

                console.log('Loaded Ambulance Data:', backendData);


                console.log('Loaded Ambulance Data:', backendData);

                const geoJsonData = backendData.mapData;
                setStats(backendData.stats); // Set Stats trực tiếp từ BE

                if (map.current.getLayer(LAYER_ID)) map.current.removeLayer(LAYER_ID);

                // Create 3D layer
                layer3D.current = new maptiler3d.Layer3D('ambulance-3d-layer');
                map.current.addLayer(layer3D.current);

                // Thêm ánh sáng
                layer3D.current.setAmbientLight({
                    color: 0xffffff,
                    intensity: 2.0
                });

                layer3D.current.addPointLight('ambulance-light', {
                    lngLat: [106.6297, 16.5],
                    altitude: 500000,
                    color: 0xffffff,
                    intensity: 100,
                    decay: 0.1
                });

                // Load 3D models for each emergency location
                let loadedCount = 0;
                for (const feature of geoJsonData.features) {
                    const [lng, lat] = feature.geometry.coordinates;
                    const props = feature.properties;

                    try {
                        await layer3D.current.addMeshFromURL(
                            `ambulance-${props.id}`,
                            AMBULANCE_MODEL_URL,
                            {
                                lngLat: [lng, lat],
                                scale: 100,
                                altitude: 0,
                                altitudeReference: maptiler3d.AltitudeReference.GROUND,
                                heading: Math.random() * 360,
                                visible: true
                            }
                        );
                        loadedCount++;
                        console.log(`Loaded 3D model for ambulance-${props.id}`);
                    } catch (err) {
                        console.warn(`Failed to load 3D model for ${props.id}:`, err);
                    }
                }

                if (loadedCount > 0) {
                    setModelsLoaded(true);
                    console.log(`Successfully loaded ${loadedCount} 3D ambulance models`);
                }

                // Add circle markers as fallback/indicator
                map.current.addSource('ambulance-points', {
                    type: 'geojson',
                    data: geoJsonData
                });

                // Only show circles if 3D models failed to load
                map.current.addLayer({
                    id: 'ambulance-circles',
                    type: 'circle',
                    source: 'ambulance-points',
                    paint: {
                        'circle-radius': modelsLoaded ? 6 : 12,
                        'circle-color': [
                            'match',
                            ['get', 'priority'],
                            'CRITICAL', '#ff0000',
                            'HIGH', '#ff6600',
                            'MEDIUM', '#ffcc00',
                            'LOW', '#00cc00',
                            '#888888'
                        ],
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#ffffff',
                        'circle-opacity': 0.8
                    }
                });

                // Pulse effect for critical emergencies
                map.current.addLayer({
                    id: 'ambulance-pulse',
                    type: 'circle',
                    source: 'ambulance-points',
                    filter: ['==', ['get', 'priority'], 'CRITICAL'],
                    paint: {
                        'circle-radius': 25,
                        'circle-color': '#ff0000',
                        'circle-opacity': 0.3,
                        'circle-stroke-width': 0
                    }
                });

                map.current.on('click', 'ambulance-circles', (e) => {
                    const props = e.features[0].properties;
                    const coordinates = e.features[0].geometry.coordinates.slice();

                    new maptilersdk.Popup()
                        .setLngLat(coordinates)
                        .setHTML(createAmbulancePopupHTML(props))
                        .addTo(map.current);
                });

                map.current.on('mouseenter', 'ambulance-circles', () => {
                    map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseleave', 'ambulance-circles', () => {
                    map.current.getCanvas().style.cursor = '';
                });

            } catch (error) {
                console.error('Error loading ambulance data:', error);
            }
        });
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    return { stats, modelsLoaded };
};

export default useAmbulanceMap;
