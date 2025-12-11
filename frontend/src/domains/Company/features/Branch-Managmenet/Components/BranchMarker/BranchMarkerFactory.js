import { createBranchMarkerElement} from "@/domains/Company/features/Branch-Managmenet/Components/BranchMarker/branchMarker.factory.jsx";

export const createMarkerDOM = (marker) => {
    try {
        const element = createBranchMarkerElement(
            marker.branchType,
            marker.performanceLevel
        );
        return element;
    } catch (e) {
        console.error("Error creating marker element:", e);
        return null;
    }
};