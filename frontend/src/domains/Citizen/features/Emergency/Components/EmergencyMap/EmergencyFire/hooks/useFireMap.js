import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import * as maptiler3d from '@maptiler/3d';
import {
    MAPTILER_KEY,
    DATA_API_URL,
    FIRETRUCK_MODEL_URL,
    LAYER_ID,
    LIGHT_ID
} from '../constants/fireConfig';
import { createFirePopupHTML } from '../utils/firePopupTemplate';

const useFireMap = (mapContainer) => {
    const map = useRef(null);
    const layer3D = useRef(null);
    const [stats, setStats] = useState({ total: 0, critical: 0, responding: 0 });
    const [modelsLoaded, setModelsLoaded] = useState(false);

    const calculateStats = (features) => {
        if (!features || features.length === 0) {
            setStats({ total: 0, critical: 0, responding: 0 });
            return;
        }

        const total = features.length;
        const critical = features.filter(f => f.properties.priority === 'CRITICAL').length;
        const responding = features.filter(f => f.properties.status === 'RESPONDING').length;

        setStats({ total, critical, responding });
    };

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

                console.log('Loaded Fire Data:', backendData);

                const geojsonData = backendData.mapData;
                setStats(backendData.stats);

                if (map.current.getLayer(LAYER_ID)) map.current.removeLayer(LAYER_ID);

                // Create 3D layer
                layer3D.current = new maptiler3d.Layer3D('fire-3d-layer');
                map.current.addLayer(layer3D.current);

                // Thêm ánh sáng
                layer3D.current.setAmbientLight({
                    color: 0xffffff,
                    intensity: 2.0
                });

                layer3D.current.addPointLight('fire-light', {
                    lngLat: [106.6297, 16.5],
                    altitude: 500000,
                    color: 0xffffff,
                    intensity: 100,
                    decay: 0.1
                });

                // Load 3D models for each fire location
                let loadedCount = 0;
                for (const feature of geojsonData.features) {
                    const [lng, lat] = feature.geometry.coordinates;
                    const props = feature.properties;

                    try {
                        await layer3D.current.addMeshFromURL(
                            `firetruck-${props.id}`,
                            FIRETRUCK_MODEL_URL,
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
                        console.log(`Loaded 3D model for firetruck-${props.id}`);
                    } catch (err) {
                        console.warn(`Failed to load 3D model for ${props.id}:`, err);
                    }
                }

                if (loadedCount > 0) {
                    setModelsLoaded(true);
                    console.log(`Successfully loaded ${loadedCount} 3D firetruck models`);
                }

                // Add circle markers
                map.current.addSource('fire-points', {
                    type: 'geojson',
                    data: geojsonData
                });

                map.current.addLayer({
                    id: 'fire-circles',
                    type: 'circle',
                    source: 'fire-points',
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
                        'circle-stroke-color': '#ff4400',
                        'circle-opacity': 0.8
                    }
                });

                // Glow effect for fires
                map.current.addLayer({
                    id: 'fire-glow',
                    type: 'circle',
                    source: 'fire-points',
                    filter: ['==', ['get', 'priority'], 'CRITICAL'],
                    paint: {
                        'circle-radius': 30,
                        'circle-color': '#ff4400',
                        'circle-opacity': 0.4,
                        'circle-blur': 1
                    }
                });

                map.current.on('click', 'fire-circles', (e) => {
                    const props = e.features[0].properties;
                    const coordinates = e.features[0].geometry.coordinates.slice();

                    new maptilersdk.Popup()
                        .setLngLat(coordinates)
                        .setHTML(createFirePopupHTML(props))
                        .addTo(map.current);
                });

                map.current.on('mouseenter', 'fire-circles', () => {
                    map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseleave', 'fire-circles', () => {
                    map.current.getCanvas().style.cursor = '';
                });

            } catch (error) {
                console.error('Error loading fire data:', error);
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

export default useFireMap;
