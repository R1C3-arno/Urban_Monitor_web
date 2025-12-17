import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { MAPTILER_KEY, DATA_API_URL } from '../constants/utilityConfig';
import { createUtilityPopupHTML } from '../utils/popupTemplate';
import { getColorExpression } from '../utils/colorUtils';

const useUtilityMap = (mapContainer) => {
    const map = useRef(null);
    const [stats, setStats] = useState({
        totalStations: 0,
        avgWater: 0,
        avgElectricity: 0,
        avgPing: 0
    });
    const [selectedMetric, setSelectedMetric] = useState('water');

    const updateLayerColors = () => {
        if (!map.current || !map.current.getLayer('clusters')) return;

        const colorExpression = getColorExpression(selectedMetric);
        map.current.setPaintProperty('clusters', 'circle-color', colorExpression);
    };

    useEffect(() => {
        if (map.current) {
            updateLayerColors();
            return;
        }

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.DATAVIZ.DARK,
            center: [106.6297, 16.5],
            zoom: 5.5,
            apiKey: MAPTILER_KEY
        });

        map.current.on('load', async () => {
            try {
                const response = await fetch(DATA_API_URL);
                const backendData = await response.json();

                console.log('Loaded Dashboard Data:', backendData);

                // --- UPDATE: Lấy data từ BE ---
                const geojsonData = backendData.mapData;
                setStats(backendData.stats);
                // -----------------------------

                map.current.addSource('utility-stations', {
                    type: 'geojson',
                    data: geojsonData,
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 50,
                    clusterProperties: {
                        totalWater: ['+', ['get', 'waterUsage']],
                        totalElectricity: ['+', ['get', 'electricityUsage']],
                        avgPing: ['max', ['get', 'wifiPing']]
                    }
                });

                map.current.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'utility-stations',
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#51bbd6',
                            10, '#f1f075',
                            30, '#f28cb1'
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            10, 30,
                            30, 40
                        ],
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#ffffff'
                    }
                });

                map.current.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'utility-stations',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                        'text-size': 14
                    },
                    paint: {
                        'text-color': '#ffffff'
                    }
                });

                map.current.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'utility-stations',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': '#11b4da',
                        'circle-radius': 8,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#fff'
                    }
                });

                map.current.on('click', 'clusters', async (e) => {
                    const features = map.current.queryRenderedFeatures(e.point, {
                        layers: ['clusters']
                    });
                    const clusterId = features[0].properties.cluster_id;

                    const source = map.current.getSource('utility-stations');
                    const zoom = await source.getClusterExpansionZoom(clusterId);

                    map.current.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                });

                map.current.on('click', 'unclustered-point', (e) => {
                    const props = e.features[0].properties;
                    const coordinates = e.features[0].geometry.coordinates.slice();

                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    new maptilersdk.Popup()
                        .setLngLat(coordinates)
                        .setHTML(createUtilityPopupHTML(props))
                        .addTo(map.current);
                });

                map.current.on('mouseenter', 'clusters', () => {
                    map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseleave', 'clusters', () => {
                    map.current.getCanvas().style.cursor = '';
                });
                map.current.on('mouseenter', 'unclustered-point', () => {
                    map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseleave', 'unclustered-point', () => {
                    map.current.getCanvas().style.cursor = '';
                });

            } catch (error) {
                console.error('Error loading data:', error);
            }
        });
    }, [selectedMetric]);

    return { stats, selectedMetric, setSelectedMetric };
};

export default useUtilityMap;
