import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { MAPTILER_KEY, DATA_API_URL } from '../constants/airQualityConfig';
import { createAirQualityPopupHTML } from '../utils/popupTemplate';

// Không cần import file GeoJSON nữa vì BE đã trả về
const useAirQualityMap = (mapContainer) => {
    const map = useRef(null);

    // State đơn giản hóa, lấy trực tiếp từ API
    const [stats, setStats] = useState({ total: 0, avgAqi: 0, worst: 'N/A' });
    const [legendData, setLegendData] = useState({});

    useEffect(() => {
        if (map.current) return;

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.DATAVIZ.DARK,
            center: [106.5, 16.0],
            zoom: 5,
            apiKey: MAPTILER_KEY
        });

        map.current.on('load', async () => {
            // Ẩn các layer biên giới mặc định để dùng GeoJSON của mình
            const layers = map.current.getStyle().layers;
            layers.forEach(layer => {
                if (layer.type === 'line' && (layer.id.includes('boundary') || layer.id.includes('admin') || layer.id.includes('border'))) {
                    map.current.setLayoutProperty(layer.id, 'visibility', 'none');
                }
            });

            try {
                // Fetch dữ liệu đã xử lý từ Backend
                const response = await fetch(DATA_API_URL);
                const backendResponse = await response.json();

                console.log("Full Backend Response:", backendResponse);

                // Cập nhật State từ response
                setStats(backendResponse.stats);
                setLegendData(backendResponse.legend);

                // Thêm source map (Dữ liệu GeoJSON nằm trong backendResponse.mapData)
                map.current.addSource('vietnam-provinces', {
                    type: 'geojson',
                    data: backendResponse.mapData
                });

                // LAYER TÔ MÀU
                map.current.addLayer({
                    id: 'provinces-fill',
                    type: 'fill',
                    source: 'vietnam-provinces',
                    paint: {
                        'fill-color': ['get', 'color'], // Màu đã được BE tính sẵn và nhét vào properties
                        'fill-opacity': 0.8,
                        'fill-outline-color': '#ffffff'
                    }
                });

                // LAYER VIỀN
                map.current.addLayer({
                    id: 'provinces-highlight',
                    type: 'line',
                    source: 'vietnam-provinces',
                    paint: {
                        'line-color': '#ffffff',
                        'line-width': 2,
                        'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0]
                    }
                });

                // Popup Logic (Giữ nguyên)
                map.current.on('click', 'provinces-fill', (e) => {
                    const props = e.features[0].properties;

                    new maptilersdk.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(createAirQualityPopupHTML(props))
                        .addTo(map.current);
                });

            } catch (error) {
                console.error("Error fetching map data:", error);
            }
        });
    }, []);

    return { stats, legendData };
};

export default useAirQualityMap;
