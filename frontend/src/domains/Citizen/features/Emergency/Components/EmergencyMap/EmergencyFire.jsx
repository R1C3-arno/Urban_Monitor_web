import { useRef } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { FireControlPanel} from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/EmergencyFire/index.js";
import useFireMap from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/EmergencyFire/hooks/useFireMap.js";

const EmergencyFire = () => {
    const mapContainer = useRef(null);
    const { stats, modelsLoaded } = useFireMap(mapContainer);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
            <FireControlPanel stats={stats} />
        </div>
    );
};

export default EmergencyFire;
