// SecurityMarker.jsx
import { createSecurityMarkerElement} from "./securityMarker.factory.jsx";

/**
 * Convert SecurityReport → BaseMarker Props
 */
export const SecurityMarker = (reports = [], onSelect = () => {}) => {
    return reports.map(report => ({
        id: report.id,
        coords: [report.lng, report.lat],

        // ✅ custom React icon
        element: createSecurityMarkerElement(report.type, report.severity),

        onClick: () => onSelect(report),
    }));
};
