import { useRef } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { AmbulanceControlPanel} from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/EmergencyAmbulance/index.js";
import useAmbulanceMap
    from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/EmergencyAmbulance/hooks/useAmbulanceMap.js";

const EmergencyAmbulance = () => {
    const mapContainer = useRef(null);
    const { stats, modelsLoaded } = useAmbulanceMap(mapContainer);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
            <AmbulanceControlPanel stats={stats} />
        </div>
    );
};

export default EmergencyAmbulance;
