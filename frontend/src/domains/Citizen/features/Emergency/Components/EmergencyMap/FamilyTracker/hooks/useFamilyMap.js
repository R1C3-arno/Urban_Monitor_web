import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import * as maptiler3d from '@maptiler/3d';
import {
    MAPTILER_KEY,
    DATA_API_URL,
    PERSON_MODEL_URL,
    LAYER_ID,
    LIGHT_ID,
    memberColors
} from '../constants/familyConfig';
import { createFamilyPopupHTML } from '../utils/familyPopupTemplate';

const useFamilyMap = (mapContainer) => {
    const map = useRef(null);
    const layer3D = useRef(null);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    const flyToMember = (member) => {
        if (!map.current) return;
        
        if (member.longitude && member.latitude) {
            map.current.flyTo({
                center: [member.longitude, member.latitude],
                zoom: 14,
                pitch: 60
            });
            setSelectedMember(member);
        }
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

                console.log('Loaded Family Data:', backendData);

                const geojsonData = backendData.mapData;

                setFamilyMembers(geojsonData.features.map(f => ({
                    ...f.properties,
                    longitude: f.geometry.coordinates[0],
                    latitude: f.geometry.coordinates[1]
                })));

                if (map.current.getLayer(LAYER_ID)) map.current.removeLayer(LAYER_ID);

                // Create 3D layer
                layer3D.current = new maptiler3d.Layer3D(LAYER_ID);
                map.current.addLayer(layer3D.current);

                // Thêm ánh sáng
                layer3D.current.setAmbientLight({
                    color: 0xffffff,
                    intensity: 2.0
                });

                layer3D.current.addPointLight(LIGHT_ID, {
                    lngLat: [106.6297, 16.5],
                    altitude: 500000,
                    color: 0xffffff,
                    intensity: 100,
                    decay: 0.1
                });

                // Load 3D models for each family member
                let loadedCount = 0;
                for (let i = 0; i < geojsonData.features.length; i++) {
                    const feature = geojsonData.features[i];
                    const [lng, lat] = feature.geometry.coordinates;
                    const props = feature.properties;

                    try {
                        await layer3D.current.addMeshFromURL(
                            `family-${props.id}`,
                            PERSON_MODEL_URL,
                            {
                                lngLat: [lng, lat],
                                scale: 100,
                                altitude: 0,
                                altitudeReference: maptiler3d.AltitudeReference.GROUND,
                                heading: 0,
                                visible: true
                            }
                        );
                        loadedCount++;
                        console.log(`Loaded 3D model for family-${props.id}`);
                    } catch (err) {
                        console.warn(`Failed to load 3D model for ${props.id}:`, err);
                    }
                }

                if (loadedCount > 0) {
                    setModelsLoaded(true);
                    console.log(`Successfully loaded ${loadedCount} 3D person models`);
                }

                // Add colored features
                const featuresWithColor = {
                    ...geojsonData,
                    features: geojsonData.features.map((f, idx) => ({
                        ...f,
                        properties: {
                            ...f.properties,
                            color: memberColors[idx % memberColors.length]
                        }
                    }))
                };

                map.current.addSource('family-points', {
                    type: 'geojson',
                    data: featuresWithColor
                });

                map.current.addLayer({
                    id: 'family-circles',
                    type: 'circle',
                    source: 'family-points',
                    paint: {
                        'circle-radius': modelsLoaded ? 8 : 14,
                        'circle-color': ['get', 'color'],
                        'circle-stroke-width': 3,
                        'circle-stroke-color': '#ffffff'
                    }
                });

                map.current.addLayer({
                    id: 'family-labels',
                    type: 'symbol',
                    source: 'family-points',
                    layout: {
                        'text-field': ['slice', ['get', 'name'], 0, 1],
                        'text-size': 11,
                        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold']
                    },
                    paint: {
                        'text-color': '#ffffff'
                    }
                });

                map.current.on('click', 'family-circles', (e) => {
                    const props = e.features[0].properties;
                    const coordinates = e.features[0].geometry.coordinates.slice();

                    new maptilersdk.Popup()
                        .setLngLat(coordinates)
                        .setHTML(createFamilyPopupHTML(props))
                        .addTo(map.current);

                    setSelectedMember(props);
                });

                map.current.on('mouseenter', 'family-circles', () => {
                    map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseleave', 'family-circles', () => {
                    map.current.getCanvas().style.cursor = '';
                });

            } catch (error) {
                console.error('Error loading family data:', error);
            }
        });
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    return { familyMembers, selectedMember, modelsLoaded, flyToMember };
};

export default useFamilyMap;
