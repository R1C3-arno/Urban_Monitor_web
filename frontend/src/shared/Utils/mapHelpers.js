import FormatCoords from 'formatcoords';
import {isValidPoint} from "./point.js";


//hàm tính khoản cách 2 điểm
export const calculateDistance = (point1,point2) =>{
    if (!isValidPoint(p1) || !isValidPoint(p2)) {
        throw new Error("Points must have x and y as numbers");
    }
    return Math.sqrt(Math.pow(point2.x-point1.x,2)+Math.pow(point2.y-point1.y,2));
}

//hàm chuẩn hóa tọa độ
export const formatCoordinates = (point,format = 'dms') => {
    // ... code format tọa độ
    if (!isValidPoint(point)) throw new Error("Invalid point");
    const coord = new FormatCoords(point.y, point.x); // y = lat, x = lng
    switch(format) {
        case 'dms': return coord.toString('dms');
        case 'decimal': return coord.toString('decimal');
        default: return coord.toString();
    }
};


//hàm check coi có nằm trong vùng polygon ko
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