export const mapZoneToCircle = (zone) => {
    return {
        id: zone.id,
        coords: zone.coords,
        color: zone.color,
        opacity: zone.opacity,
        level: zone.level,
    };
};

export const mapZonesToCircles = (zones) => {
    if (!Array.isArray(zones)) return [];
    return zones.map(mapZoneToCircle);
};
