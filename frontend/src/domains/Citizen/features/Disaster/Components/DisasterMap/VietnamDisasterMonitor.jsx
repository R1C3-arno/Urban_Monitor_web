import {useRef} from "react";
import {ControlPanel, LoadingOverlay} from "@/domains/Citizen/features/Disaster/Components/index.js";
import useDisasterMap from "@/domains/Citizen/features/Disaster/Hooks/useDisasterMap.js";

const VietnamDisasterMonitor = () => {
    const mapContainer = useRef(null);
    const {stats, activeFilters, loading, toggleFilter} = useDisasterMap(mapContainer);

    return (
        <div className="disaster_map_container">
            <div style={{position: 'relative', width: '100%', height: '100vh'}}>
                <div ref={mapContainer} style={{width: '100%', height: '100%'}}/>

                {loading && <LoadingOverlay/>}

                {/* Control Panel */}
                <ControlPanel
                    stats={stats}
                    activeFilters={activeFilters}
                    onToggleFilter={toggleFilter}
                />
            </div>
        </div>
    );
};

export default VietnamDisasterMonitor;