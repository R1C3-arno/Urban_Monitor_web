import FormatCoords from 'formatcoords';
import {isValidPoint} from "./point.js";



// check tọa độ
// kết hợp với shared/utils/point.js
export const isValidCoordinates = (coords) => {
    let lng, lat;

    if (Array.isArray(coords) && coords.length === 2) {
        [lng, lat] = coords;
    } else if (typeof coords === 'object' && coords !== null) {
        lng = coords.lng ?? coords.x;
        lat = coords.lat ?? coords.y;
    } else {
        return false;
    }

    if (typeof lng !== 'number' || typeof lat !== 'number') return false;

    return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
};



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