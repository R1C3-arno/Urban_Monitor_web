import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { disasterConfig, MAPTILER_KEY, DATA_API_URL } from '../Constants/disasterConfig.jsx';
import { createPopupHTML } from '../utils/popupTemplate';

const useDisasterMap = (mapContainer) => {
    const map = useRef(null);
    const [stats, setStats] = useState({
        flood: { total: 0, emergency: 0 },
        earthquake: { total: 0, alert: 0 },
        heatwave: { total: 0, extreme: 0 },
        storm: { total: 0, emergency: 0 }
    });
    const [activeFilters, setActiveFilters] = useState({
        flood: true,
        earthquake: true,
        heatwave: true,
        storm: true
    });
    const [loading, setLoading] = useState(true);

    const toggleFilter = (type) => {
        const newFilters = { ...activeFilters, [type]: !activeFilters[type] };
        setActiveFilters(newFilters);

        if (map.current && map.current.getLayer(`${type}-provinces-fill`)) {
            map.current.setLayoutProperty(
                `${type}-provinces-fill`,
                'visibility',
                newFilters[type] ? 'visible' : 'none'
            );
            map.current.setLayoutProperty(
                `${type}-provinces-pattern`,
                'visibility',
                newFilters[type] ? 'visible' : 'none'
            );
        }
    };

    useEffect(() => {
        if (map.current) return;

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.DATAVIZ.DARK,
            center: [106.6297, 16.0],
            zoom: 5.5,
            pitch: 0,
            apiKey: MAPTILER_KEY
        });

        map.current.on('load', async () => {
            try {
                console.log('Map loaded');

                // Ẩn các boundary layers mặc định
                const layers = map.current.getStyle().layers;
                layers.forEach(layer => {
                    if (layer.type === 'line' &&
                        (layer.id.includes('boundary') ||
                            layer.id.includes('admin') ||
                            layer.id.includes('border'))) {
                        map.current.setLayoutProperty(layer.id, 'visibility', 'none');
                    }
                });

                // Fetch disaster data
                console.log(' Fetching disaster data...');
                const response = await fetch(DATA_API_URL);
                const backendData = await response.json();

                console.log(' Loaded data from BE:', backendData);
                setStats(backendData.stats);

                // Lấy GeoJSON đã được BE xử lý (merge, tính màu, ...)
                const fullGeoJSON = backendData.mapData;

                // Load patterns với scale adjustment
                for (const [type, config] of Object.entries(disasterConfig)) {
                    try {
                        const response = await fetch(config.patternUrl);
                        const blob = await response.blob();
                        const img = await createImageBitmap(blob);

                        // Tạo canvas để resize pattern
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        // Điều chỉnh kích thước pattern ở đây (càng nhỏ càng tile nhiều)
                        const targetSize = 80; // Thay đổi số này: 64, 128, 256, 512
                        canvas.width = targetSize;
                        canvas.height = targetSize;

                        // Vẽ image vào canvas với kích thước mới
                        ctx.drawImage(img, 0, 0, targetSize, targetSize);

                        // Chuyển canvas thành ImageData
                        const imageData = ctx.getImageData(0, 0, targetSize, targetSize);

                        map.current.addImage(config.patternId, imageData);
                        console.log(` Pattern loaded: ${type} (resized to ${targetSize}x${targetSize})`);
                    } catch (err) {
                        console.warn(`⚠️ Pattern not found: ${type}`, err);
                    }
                }

                // Merge disaster data theo từng loại disaster
                for (const [disasterType, config] of Object.entries(disasterConfig)) {
                    // Filter disasters của loại này
                    const filteredFeatures = fullGeoJSON.features.filter(
                        f => f.properties.hasDisaster && f.properties.disasterType === disasterType
                    );

                    if (filteredFeatures.length === 0) continue;


                    const typeGeoJSON = {
                        type: 'FeatureCollection',
                        features: filteredFeatures
                    };

                    console.log(`${disasterType}: ${filteredFeatures .length} provinces affected`);


                    // Add source cho từng disaster type
                    const sourceId = `${disasterType.toLowerCase()}-provinces`;
                    map.current.addSource(sourceId, {
                        type: 'geojson',
                        data: typeGeoJSON
                    });

                    // Layer: Pattern fill
                    map.current.addLayer({
                        id: `${disasterType.toLowerCase()}-provinces-pattern`,
                        type: 'fill',
                        source: sourceId,
                        paint: {
                            'fill-pattern': config.patternId,
                            'fill-opacity': 0.6
                        }
                    });

                    // Layer: Color overlay
                    map.current.addLayer({
                        id: `${disasterType.toLowerCase()}-provinces-fill`,
                        type: 'fill',
                        source: sourceId,
                        paint: {
                            'fill-color': [
                                'match',
                                ['get', 'severity'],
                                'EXTREME', '#8B0000',   // Đỏ đậm
                                'SEVERE', '#ff0000',    // Đỏ
                                'HIGH', '#ff6600',      // Cam
                                'MODERATE', '#ffcc00',  // Vàng
                                'LOW', '#00cc00',       // Xanh lá
                                config.color            // Mặc định
                            ],
                            'fill-opacity': 0.3
                        }
                    });

                    // Layer: Outline
                    map.current.addLayer({
                        id: `${disasterType.toLowerCase()}-provinces-outline`,
                        type: 'line',
                        source: sourceId,
                        paint: {
                            'line-color': [
                                'match',
                                ['get', 'status'],
                                'EMERGENCY', '',
                                'ALERT', '',
                                'WARNING', '',
                                config.color
                            ],
                            'line-width': 2
                        }
                    });

                    // Click handler
                    map.current.on('click', `${disasterType.toLowerCase()}-provinces-fill`, (e) => {
                        const props = e.features[0].properties;

                        new maptilersdk.Popup({ maxWidth: '350px' })
                            .setLngLat(e.lngLat)
                            .setHTML(createPopupHTML(props, config))
                            .addTo(map.current);
                    });

                    // Hover effects
                    map.current.on('mouseenter', `${disasterType.toLowerCase()}-provinces-fill`, () => {
                        map.current.getCanvas().style.cursor = 'pointer';
                    });
                    map.current.on('mouseleave', `${disasterType.toLowerCase()}-provinces-fill`, () => {
                        map.current.getCanvas().style.cursor = '';
                    });
                }

                setLoading(false);

            } catch (error) {
                console.error(' Error loading map:', error);
                setLoading(false);
            }
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    return {
        stats,
        activeFilters,
        loading,
        toggleFilter
    };
};

export default useDisasterMap;
