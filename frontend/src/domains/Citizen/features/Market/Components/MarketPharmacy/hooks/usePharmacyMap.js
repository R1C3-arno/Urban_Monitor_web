import { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { MAPTILER_KEY, DATA_API_URL } from '../constants/pharmacyConfig';
import { createMarkerElement } from '../utils/markerUtils';
import { createPharmacyPopupHTML } from '../utils/pharmacyPopupTemplate';

const usePharmacyMap = (mapContainer) => {
    const map = useRef(null);
    const markersRef = useRef([]);
    const [stores, setStores] = useState([]);
    const [visibleStores, setVisibleStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [showSearchButton, setShowSearchButton] = useState(false);

    // State stats nhận trực tiếp từ Backend
    const [stats, setStats] = useState({ total: 0, active: 0, avgRating: 0 });

    // ĐÃ XÓA HÀM calculateStats() Ở ĐÂY VÌ BE ĐÃ LÀM

    const createMarkers = (features) => {
        // Clear existing markers
        markersRef.current.forEach(m => m.marker.remove());
        markersRef.current = [];

        features.forEach(feature => {
            const [lng, lat] = feature.geometry.coordinates;
            const props = feature.properties;

            const el = createMarkerElement(props, selectedStore?.id === props.id);

            const marker = new maptilersdk.Marker({ element: el })
                .setLngLat([lng, lat])
                .addTo(map.current);

            // Click handler
            el.onclick = () => {
                selectStore(props);
                showPopup(props, [lng, lat]);
            };

            markersRef.current.push({ marker, props, coordinates: [lng, lat] });
        });
    };

    const showPopup = (props, coordinates) => {
        new maptilersdk.Popup({ offset: 25 })
            .setLngLat(coordinates)
            .setHTML(createPharmacyPopupHTML(props))
            .addTo(map.current);
    };

    const updateVisibleStores = () => {
        if (!map.current) return;

        const bounds = map.current.getBounds();
        const visible = stores.filter(f => {
            const [lng, lat] = f.geometry.coordinates;
            return bounds.contains([lng, lat]);
        });

        setVisibleStores(visible.map(f => f.properties));
        setShowSearchButton(false);
    };

    const selectStore = (store) => {
        setSelectedStore(store);
    };

    const flyToStore = (store) => {
        if (!map.current) return;
        const feature = stores.find(s => s.properties.id === store.id);
        if (feature) {
            map.current.flyTo({
                center: feature.geometry.coordinates,
                zoom: 15
            });
            selectStore(store);
            showPopup(store, feature.geometry.coordinates);
        }
    };

    useEffect(() => {
        if (map.current) return;

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

                console.log('Loaded Pharmacy Data:', backendData);

                // --- LOGIC MỚI: Lấy data từ response của BE ---
                const geoFeatures = backendData.mapData.features;

                setStores(geoFeatures);
                setStats(backendData.stats); // Set Stats trực tiếp từ BE
                // ----------------------------------------------

                // Create custom markers
                createMarkers(geoFeatures);

                // Initial visible stores
                setTimeout(() => updateVisibleStores(), 500);

                // Show search button when map moves
                map.current.on('moveend', () => {
                    setShowSearchButton(true);
                });

            } catch (error) {
                console.error('Error loading pharmacy data:', error);
            }
        });
    }, []);

    // Update markers when selectedStore changes
    useEffect(() => {
        if (stores.length > 0 && map.current) {
            createMarkers(stores);
        }
    }, [selectedStore]);

    return {
        stores,
        visibleStores,
        selectedStore,
        showSearchButton,
        stats,
        updateVisibleStores,
        flyToStore
    };
};

export default usePharmacyMap;
