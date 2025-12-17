import { useRef } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { FamilyControlPanel} from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/FamilyTracker/index.js";
import useFamilyMap
    from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/FamilyTracker/hooks/useFamilyMap.js";
const FamilyTracker = () => {
    const mapContainer = useRef(null);
    const { familyMembers, selectedMember, modelsLoaded, flyToMember } = useFamilyMap(mapContainer);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
            <FamilyControlPanel
                familyMembers={familyMembers}
                selectedMember={selectedMember}
                onMemberClick={flyToMember}
            />
        </div>
    );
};

export default FamilyTracker;
