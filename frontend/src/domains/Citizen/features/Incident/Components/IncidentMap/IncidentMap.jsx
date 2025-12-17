import { useRef } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { IncidentPanel} from "@/domains/Citizen/features/Incident/Components/IncidentMap/index.js";
import useIncidentMap from "@/domains/Citizen/features/Incident/Hooks/useIncidentMap.js";

const IncidentMap = () => {
    const mapContainer = useRef(null);
    const { stats, legend, loading } = useIncidentMap(mapContainer);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div ref={mapContainer} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />

            {/* Panel - just renders data from backend */}
            <IncidentPanel stats={stats} legend={legend} loading={loading} />
        </div>
    );
};

export default IncidentMap;
