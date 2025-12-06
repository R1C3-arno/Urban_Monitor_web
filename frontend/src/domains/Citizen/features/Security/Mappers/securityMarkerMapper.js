/**
 * Traffic Marker Mapper
 * Converts TrafficIncident → Map Marker Props
 * Follows Single Responsibility Principle
 */

import { TRAFFIC_LEVEL_COLORS} from "../../../../../shared/Constants/color.js";
import { createSecurityMarkerElement} from "../Components/SecurityMarker/securityMarker.factory.jsx";

/**
 * Map TrafficIncident to marker props for BaseMarker component
 * @param {TrafficIncident} incident
 * @param {Function} onClick - Click handler
 * @returns {Object} Marker props
 */
export const mapIncidentToMarker = (incident, onClick) => {
    return {
        id: incident.id,
        coords: incident.coords,
        // ✅ KẾT NỐI DUY NHẤT VỚI BaseMarker
        element: createTrafficMarkerElement(
            incident.type,   // CAR | BIKE | ACCIDENT | JAM | SLOW | FAST
            incident.level   // LOW | MEDIUM | HIGH
        ),
        onClick: () => onClick?.(incident),
    };
};

/**
 * Map array of TrafficIncidents to marker props array
 * @param {Array<TrafficIncident>} incidents
 * @param {Function} onClick - Click handler receives incident
 * @returns {Array<Object>} Array of marker props
 */
export const mapIncidentsToMarkers = (incidents, onClick) => {
    if (!Array.isArray(incidents)) {
        console.warn("⚠️ mapIncidentsToMarkers: Expected array, got", typeof incidents);
        return [];
    }

    return incidents.map(incident => mapIncidentToMarker(incident, onClick));
};

/*
Backend nene gui
{
  "id": 12,
  "lat": 10.77,
  "lng": 106.69,
  "type": "ACCIDENT",
  "level": "HIGH"
}

 */

/**
 * Create user location marker
 * @param {Object} location - {lng, lat, accuracy}
 * @param {Function} onClick - Optional click handler
 * @returns {Object} Marker props
 */
export const createUserLocationMarker = (location, onClick) => {
    if (!location || !location.lng || !location.lat) {
        return null;
    }

    return {
        id: "user-location",
        coords: [location.lng, location.lat],
        color: "#3B82F6",
        onClick: onClick || (() => console.log("User location:", location)),
    };
};