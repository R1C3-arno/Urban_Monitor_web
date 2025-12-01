//check mail
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

//check số phone
export const isValidPhone = (phone) => {
    const regex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
    return regex.test(phone.replace(/\s/g, ''));
};

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
