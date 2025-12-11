import React, {useRef, useEffect,useState} from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './Map.css';
import BaseMarker from "../MapMarker/Marker.jsx";
import GeolocationControl from "../GeolocationControl/GeolocationControl.jsx";


const Map = ({
                 center = [106.7, 10.7],
                 zoom = 12,
                 markers = [],
                 polygons = [],
                 onMapClick,
                 styleUrl = 'https://api.maptiler.com/maps/0196d23d-6773-76c9-9909-12b393279a7b/style.json?key=Ak2018xBFFEm6Mi85vDZ',
                 height = '700px',
                 getMap,

                 enableGeolocation = false,
                 geolocatePosition = 'top-right',
                 trackUserLocation = true,
                 onUserLocationFound,
                 onGeolocationError,
             }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [geolocationReady, setGeolocationReady] = useState(false);


    useEffect(() => {
        // ✅ 1. CHẶN container chưa sẵn sàng
        if (!mapContainer.current) return;

        // ✅ 2. Map chỉ được tạo 1 lần duy nhất
        if (map.current) return;

        maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

        // ✅ 3. BẮT BUỘC validate style
        const safeStyle =
            typeof styleUrl === "string" && styleUrl.startsWith("http")
                ? styleUrl
                : "https://api.maptiler.com/maps/streets-v2/style.json?key=" +
                import.meta.env.VITE_MAPTILER_API_KEY;

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: safeStyle,   // ✅ không bao giờ invalid
            center: center,
            zoom: zoom,
            interactive: true,
            attributionControl: false,
            logoPosition: "none",
        });

        map.current.on("load", () => {
            setMapLoaded(true);
            console.log("✅ Map loaded");

            if (getMap) getMap(map.current);
            if (onMapClick) map.current.on("click", onMapClick);

            // ✅ ĐÁNH DẤU LÚC NÀY MỚI ĐƯỢC ADD GEOLOCATION
            setGeolocationReady(true);
        });

        // ✅ 5. KHÔNG remove map khi styleUrl đổi
        return () => {
            if (map.current) {
                try {
                    map.current.off();     // clear event trước
                } catch (e) {
                    console.warn("Map cleanup failed:", e);
                }
            }
        };
    }, []); // ✅ KHÔNG ĐƯỢC để [styleUrl]



    return (
        <>
            <div className="base-map-wrapper">
                <div
                    ref={mapContainer}
                    className="base-map"
                    style={{height}}
                />

                {map.current && mapLoaded && Array.isArray(markers) && markers.length > 0 &&
                    markers.map(marker => (
                        <BaseMarker
                            key={marker.id}
                            map={map.current}
                            coords={marker.coords}
                            color={marker.color}
                            element={marker.element}
                            onClick={marker.onClick}
                        />
                    ))}
                {/* Geolocation control */}
                {map.current && geolocationReady && enableGeolocation && (
                    <GeolocationControl
                        key="geolocate-control"
                        map={map.current}
                        position={geolocatePosition}
                        trackUserLocation={trackUserLocation}
                        onGeolocate={onUserLocationFound}
                        onError={onGeolocationError}
                    />
                )}

            </div>
        </>
    );
};
export default Map;




