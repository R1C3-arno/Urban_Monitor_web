import { createRoot } from "react-dom/client";
import RetailIcon from "./icons/RetailIcon.jsx";
import WarehouseIcon from "./icons/WarehouseIcon.jsx";
import FactoryIcon from "./icons/FactoryIcon.jsx";
import OfficeIcon from "./icons/OfficeIcon.jsx";
import DefaultBranchIcon from "./icons/DefaultBranchIcon.jsx";

const ICON_MAP = {
    RETAIL: RetailIcon,
    WAREHOUSE: WarehouseIcon,
    FACTORY: FactoryIcon,
    OFFICE: OfficeIcon,
};

export const createBranchMarkerElement = (branchType, performanceLevel) => {
    const el = document.createElement("div");
    const root = createRoot(el);

    const IconComponent = ICON_MAP[branchType] || DefaultBranchIcon;

    root.render(
        <div className={`branch-marker level-${performanceLevel?.toLowerCase() || 'average'}`}>
            <IconComponent />
        </div>
    );

    return el;
};
