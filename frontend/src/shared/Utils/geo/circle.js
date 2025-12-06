import {isValidPoint} from "./point.js";

/**
 * Tạo polygon hình tròn từ tâm & bán kính (m)
 * @param {Object} center - { x: lng, y: lat }
 * @param {Number} radius - mét
 * @param {Number} segments - số cạnh tròn (càng lớn càng mịn)
 * @returns {Array} Array of points [{ x, y }, ...]
 */
export const createCirclePolygon = (center, radius, segments = 64) => {
    if (!isValidPoint(center)) {
        throw new Error("Invalid center point");
    }

    const points = [];
    const earthRadius = 6378137; // mét
    const lat = center.y * Math.PI / 180;
    const lng = center.x * Math.PI / 180;

    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * 2 * Math.PI;

        const dx = radius * Math.cos(angle);
        const dy = radius * Math.sin(angle);

        const newLat = lat + dy / earthRadius;
        const newLng = lng + dx / (earthRadius * Math.cos(lat));

        points.push({
            x: newLng * 180 / Math.PI,
            y: newLat * 180 / Math.PI,
        });
    }

    return points;
};

/**
 * Tạo circle polygon với format [lng, lat] array
 * @param {number} lng - Longitude
 * @param {number} lat - Latitude
 * @param {number} radius - Radius in meters
 * @param {number} segments - Number of segments
 * @returns {Array} Array of [lng, lat] coordinates
 */
export const createCirclePolygonArray = (lng, lat, radius, segments = 64) => {
    const center = { x: lng, y: lat };
    const points = createCirclePolygon(center, radius, segments);

    // Convert {x, y} to [lng, lat]
    return points.map(p => [p.x, p.y]);
};