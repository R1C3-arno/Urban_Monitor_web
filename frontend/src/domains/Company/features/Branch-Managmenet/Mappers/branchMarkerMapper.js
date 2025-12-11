import { createBranchMarkerElement } from "../Components/BranchMarker/branchMarker.factory.jsx";

export const mapBranchToMarker = (branch, onClick) => {
    console.log("🔍 Branch to map:", branch);
    return {
        id: branch.id,
        coords: [branch.longitude, branch.latitude],
        branchType: branch.branchType,
        performanceLevel: branch.performanceLevel,
        element: createBranchMarkerElement(branch.branchType, branch.performanceLevel),
        onClick: () => onClick?.(branch),
    };
};

export const mapBranchesToMarkers = (branches, onClick) => {
    if (!Array.isArray(branches)) return [];
    return branches.map(branch => mapBranchToMarker(branch, onClick));
};
