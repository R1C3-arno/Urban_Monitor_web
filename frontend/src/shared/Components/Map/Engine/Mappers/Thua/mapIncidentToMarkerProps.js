import { BaseMarkerModel } from "../../Domain/BaseMarkerModel.js";


/**
 * ✅ Incident → Marker Model
 */
export const mapIncidentToMarkerProps = (
    incidents,
    onClick,
    createElement
) => {
    return incidents.map(item =>
        new BaseMarkerModel({
            id: item.id,
            coords: item.coords,
            element: createElement(item),
            onClick: () => onClick?.(item),
        })
    );
};