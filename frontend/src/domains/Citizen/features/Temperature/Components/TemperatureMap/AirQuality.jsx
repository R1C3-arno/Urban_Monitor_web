import { useRef } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { ControlPanel} from "@/domains/Citizen/features/Temperature/Components/index.js";
import useAirQualityMap from "@/domains/Citizen/features/Temperature/Components/hooks/useAirQualityMap.js";

// Không cần import file GeoJSON nữa vì BE đã trả về
const AirQuality = () => {
    const mapContainer = useRef(null);
    const { stats, legendData } = useAirQualityMap(mapContainer);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

            <ControlPanel stats={stats} legendData={legendData} />
        </div>
    );
};

export default AirQuality;
