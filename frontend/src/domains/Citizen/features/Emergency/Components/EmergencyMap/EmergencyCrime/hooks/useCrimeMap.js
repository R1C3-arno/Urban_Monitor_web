import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import * as maptiler3d from '@maptiler/3d';
import {
    MAPTILER_KEY,
    DATA_API_URL,
    CRIMINAL_MODEL_URL,
    LAYER_ID,
    LIGHT_ID
} from '../constants/crimeConfig';
import { createCrimePopupHTML } from '../utils/crimePopupTemplate';

const useCrimeMap = (mapContainer) => {
    const map = useRef(null);
    const layer3D = useRef(null);
    const [stats, setStats] = useState({ total: 0, active: 0, responding: 0 });
    const [crimeList, setCrimeList] = useState([]);
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

                console.log('Loaded Crime Data:', backendData);

                // --- UPDATE: Lấy data từ response ---
                const geojsonData = backendData.mapData;
                if (!geojsonData || !geojsonData.features) {
                    console.warn('No crime map data received');
                    setCrimeList([]);
                    setStats({ total: 0, active: 0, responding: 0 });
                    return;
                }

                const statsData = backendData.stats || { total: 0, active: 0, responding: 0 };
                setStats(statsData);

                if (map.current.getLayer(LAYER_ID)) map.current.removeLayer(LAYER_ID);

                // Create 3D layer
                layer3D.current = new maptiler3d.Layer3D('crime-3d-layer');
                map.current.addLayer(layer3D.current);

                // Thêm ánh sáng
                layer3D.current.setAmbientLight({
                    color: 0xffffff,
                    intensity: 2.0
                });

                layer3D.current.addPointLight('crime-light', {
                    lngLat: [106.6297, 16.5],
                    altitude: 500000,
                    color: 0xffffff,
                    intensity: 100,
                    decay: 0.1
                });

                // Load 3D models for each crime location
                let loadedCount = 0;
                for (const feature of geojsonData.features) {
                    const [lng, lat] = feature.geometry.coordinates;
                    const props = feature.properties;

                    try {
                        await layer3D.current.addMeshFromURL(
                            `criminal-${props.id}`,
                            CRIMINAL_MODEL_URL,
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
                        console.log(`Loaded 3D model for criminal-${props.id}`);
                    } catch (err) {
                        console.warn(`Failed to load 3D model for ${props.id}:`, err);
                    }
                }

                if (loadedCount > 0) {
                    setModelsLoaded(true);
                    console.log(`Successfully loaded ${loadedCount} 3D criminal models`);
                }

                map.current.addSource('crime-points', {
                    type: 'geojson',
                    data: geojsonData
                });

                map.current.addLayer({
                    id: 'crime-heat',
                    type: 'circle',
                    source: 'crime-points',
                    paint: {
                        'circle-radius': 35,
                        'circle-color': '#ff0000',
                        'circle-opacity': 0.15,
                        'circle-blur': 1
                    }
                });

                map.current.addLayer({
                    id: 'crime-circles',
                    type: 'circle',
                    source: 'crime-points',
                    paint: {
                        'circle-radius': modelsLoaded ? 6 : 10,
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
                        'circle-stroke-color': '#ffffff'
                    }
                });

                map.current.on('click', 'crime-circles', (e) => {
                    const props = e.features[0].properties;
                    const coordinates = e.features[0].geometry.coordinates.slice();

                    new maptilersdk.Popup()
                        .setLngLat(coordinates)
                        .setHTML(createCrimePopupHTML(props))
                        .addTo(map.current);
                });

                map.current.on('mouseenter', 'crime-circles', () => {
                    map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseleave', 'crime-circles', () => {
                    map.current.getCanvas().style.cursor = '';
                });

            } catch (error) {
                console.error('Error loading crime data:', error);
            }
        });
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    return { stats, crimeList, modelsLoaded };
};

export default useCrimeMap;
