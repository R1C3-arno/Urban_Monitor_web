import { useRef } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { ControlPanel, StatsPanel} from "@/domains/Citizen/features/Utility/Components/index.js";
import useUtilityMap from "@/domains/Citizen/features/Utility/hooks/useUtilityMap.js";

const UtilityMap = () => {
    const mapContainer = useRef(null);
    const { stats, selectedMetric, setSelectedMetric } = useUtilityMap(mapContainer);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

            {/* Control Panel */}
            <ControlPanel
                selectedMetric={selectedMetric}
                onMetricChange={setSelectedMetric}
            />

            {/* Stats Panel */}
            <StatsPanel stats={stats} />
        </div>
    );
};

export default UtilityMap;
