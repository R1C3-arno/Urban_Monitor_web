import React, {useRef, useEffect} from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './Map.css';


const BaseMap = ({
                     center = [106.7, 10.7],
                     zoom = 12,
                     markers = [],
                     polygons = [],
                     onMapClick,
                     styleUrl =  'https://api.maptiler.com/maps/0196d23d-6773-76c9-9909-12b393279a7b/style.json?key=Ak2018xBFFEm6Mi85vDZ',
                     height = '700px'
                 }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    useEffect(() => {
        if (map.current) return;
        maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: styleUrl,
            center: center,
            zoom: zoom,
            interactive: true,  // giữ true nếu muốn zoom/drag
            attributionControl: false, // tắt credit/bản quyền mặc định
            logoPosition: 'none'
        });
        if (onMapClick) {
            map.current.on('click', onMapClick);
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };

    }, [styleUrl]);
    useEffect(() => {
        if (!map.current) return;

        markers.forEach(marker => {
            new maptilersdk.Marker({ color: marker.color || '#3B82F6' })
                .setLngLat(marker.coords)
                .setPopup(
                    marker.popup ?
                        new maptilersdk.Popup().setHTML(marker.popup) :
                        null
                )
                .addTo(map.current);
        });
    }, [markers]);

    return (
        <div
            ref={mapContainer}
            className="base-map"
            style={{ height }}
        />
    );
};
export default BaseMap;




