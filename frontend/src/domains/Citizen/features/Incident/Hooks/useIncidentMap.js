import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { MAPTILER_KEY, API_BASE } from '../Constants/incidentConfig';
import { createPulsingIcon } from '../Utils/pulsingIcon';
import { createIncidentPopupHTML } from '../Utils/popupTemplate';

const useIncidentMap = (mapContainer) => {
    const map = useRef(null);

    // State only holds data from API - no local calculations
    const [stats, setStats] = useState(null);
    const [legend, setLegend] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (map.current) return;

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.DATAVIZ.DARK,
            center: [106.7009, 10.7769],
            zoom: 11.5,
            apiKey: MAPTILER_KEY
        });

        map.current.on('load', async () => {
            try {
                // Fetch all data from backend in parallel
                const [geoRes, statsRes, legendRes] = await Promise.all([
                    fetch(`${API_BASE}/geojson`),
                    fetch(`${API_BASE}/stats`),
                    fetch(`${API_BASE}/legend`)
                ]);

                const geojson = await geoRes.json();
                const statsData = await statsRes.json();
                const legendData = await legendRes.json();

                // Set state directly from backend - no calculations
                setStats(statsData);
                setLegend(legendData);
                setLoading(false);

                // Add pulsing icons using legend data from backend
                legendData.levels.forEach(item => {
                    const iconName = `pulsing-icon-${item.level}`;
                    if (!map.current.hasImage(iconName)) {
                        map.current.addImage(
                            iconName,
                            createPulsingIcon(item.color, item.iconSize, map),
                            { pixelRatio: 2 }
                        );
                    }
                });

                // Add source
                map.current.addSource('incidents', {
                    type: 'geojson',
                    data: geojson
                });

                // Add layer - icon-image uses level from properties
                map.current.addLayer({
                    id: 'incident-icons',
                    type: 'symbol',
                    source: 'incidents',
                    layout: {
                        'icon-image': ['concat', 'pulsing-icon-', ['upcase', ['get', 'level']]],
                        'icon-allow-overlap': true,
                        'icon-ignore-placement': true
                    }
                });

                // Click popup - all data comes from backend properties
                map.current.on('click', 'incident-icons', (e) => {
                    const props = e.features[0].properties;

                    new maptilersdk.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(createIncidentPopupHTML(props))
                        .addTo(map.current);
                });

                map.current.on('mouseenter', 'incident-icons', () => {
                    map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseleave', 'incident-icons', () => {
                    map.current.getCanvas().style.cursor = '';
                });

            } catch (error) {
                console.error('Error loading incidents:', error);
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

    return { stats, legend, loading };
};

export default useIncidentMap;
