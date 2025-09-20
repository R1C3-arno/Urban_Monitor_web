import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapComponent.css'

const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const MAPTILER_API_KEY = import.meta.env.VITE_MAP_API_KEY;

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`,
      center: [106.6297, 10.8231],
      zoom: 10
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      className="map-container"
    />
  );
};

export default MapComponent;