import { useRef } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { CrimeControlPanel} from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/EmergencyCrime/index.js";
import useCrimeMap
    from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/EmergencyCrime/hooks/useCrimeMap.js";

const EmergencyCrime = () => {
    const mapContainer = useRef(null);
    const { stats, crimeList, modelsLoaded } = useCrimeMap(mapContainer);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
            <CrimeControlPanel stats={stats} crimeList={crimeList} />
        </div>
    );
};

export default EmergencyCrime;
