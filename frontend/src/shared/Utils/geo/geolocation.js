/**
 * Geolocation utility functions
 */

/**
 * Check if browser supports geolocation
 */
export const isGeolocationSupported = () => {
    return 'geolocation' in navigator;
};

/**
 * Get current position
 * @returns {Promise<{lng: number, lat: number, accuracy: number}>}
 */
export const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        if (!isGeolocationSupported()) {
            reject(new Error('Geolocation is not supported by this browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lng: position.coords.longitude,
                    lat: position.coords.latitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                });
            },
            (error) => {
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    });
};

/**
 * Watch position continuously
 * @param {Function} onSuccess - Callback when position updates
 * @param {Function} onError - Callback when error occurs
 * @returns {number} Watch ID to clear later
 */
export const watchPosition = (onSuccess, onError) => {
    if (!isGeolocationSupported()) {
        onError?.(new Error('Geolocation not supported'));
        return null;
    }

    return navigator.geolocation.watchPosition(
        (position) => {
            onSuccess({
                lng: position.coords.longitude,
                lat: position.coords.latitude,
                accuracy: position.coords.accuracy,
                heading: position.coords.heading,
                speed: position.coords.speed,
                timestamp: position.timestamp,
            });
        },
        (error) => {
            onError?.(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
};

/**
 * Stop watching position
 * @param {number} watchId - Watch ID from watchPosition
 */
export const clearWatch = (watchId) => {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
    }
};

/**
 * Format geolocation error message
 * @param {GeolocationPositionError} error
 * @returns {string}
 */
export const getErrorMessage = (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return 'Người dùng từ chối chia sẻ vị trí';
        case error.POSITION_UNAVAILABLE:
            return 'Không thể xác định vị trí';
        case error.TIMEOUT:
            return 'Hết thời gian chờ';
        default:
            return 'Lỗi không xác định';
    }
};

/**
 * Calculate distance between two points (Haversine formula)
 * @param {Object} point1 - {lng, lat}
 * @param {Object} point2 - {lng, lat}
 * @returns {number} Distance in meters
 */
export const calculateDistance = (point1, point2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (point1.lat * Math.PI) / 180;
    const φ2 = (point2.lat * Math.PI) / 180;
    const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
    const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};