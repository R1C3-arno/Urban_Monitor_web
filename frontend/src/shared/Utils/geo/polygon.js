import FormatCoords from 'formatcoords';
import {isValidPoint} from "./point.js";





export const isPointInPolygon = (point, polygon) => {
    // ... code check point in polygon
    if (!isValidPoint(point)) {
        throw new Error("Invalid point");
    }
    if (!Array.isArray(polygon) || polygon.length < 3) {
        throw new Error("Polygon must be an array of at least 3 points");
    }

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y)) &&
            (point.x < (xj - xi) * (point.y - yi) / (yj - yi + 0.0000001) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};