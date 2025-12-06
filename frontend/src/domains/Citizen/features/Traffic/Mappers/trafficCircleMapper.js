/**
 * Traffic Circle Mapper
 * Converts TrafficZone → Circle Component Props
 * Follows Single Responsibility Principle
 */

/**
 * Map TrafficZone to circle props for TrafficCircle component
 * @param {TrafficZone} zone
 * @returns {Object} Circle props
 */
export const mapZoneToCircle = (zone) => {
    return {
        id: zone.id,
        coords: zone.coords,
        color: zone.color,
        opacity: zone.opacity,
        level: zone.level,
    };
};

/**
 * Map array of TrafficZones to circle props array
 * @param {Array<TrafficZone>} zones
 * @returns {Array<Object>} Array of circle props
 */
export const mapZonesToCircles = (zones) => {
    if (!Array.isArray(zones)) {
        console.warn("⚠️ mapZonesToCircles: Expected array, got", typeof zones);
        return [];
    }

    return zones.map(mapZoneToCircle);
};

/**
 * Convert zones to GeoJSON for advanced rendering
 * @param {Array<TrafficZone>} zones
 * @returns {Object} GeoJSON FeatureCollection
 */
export const zonesToGeoJSON = (zones = []) => {
    return {
        type: "FeatureCollection",
        features: zones
            .filter(zone => typeof zone?.toGeoJSON === "function")
            .map(zone => zone.toGeoJSON()),
    };
};
