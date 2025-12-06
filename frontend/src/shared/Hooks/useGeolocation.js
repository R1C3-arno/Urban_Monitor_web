import { useState, useEffect, useCallback, useRef } from 'react';
import {
    isGeolocationSupported,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    getErrorMessage,
} from '../Utils/geo/geolocation.js';

/**
 * Custom hook for geolocation
 * @param {Object} options
 * @param {boolean} options.watch - Continuously watch position
 * @param {boolean} options.trackUserLocation - Track user on map
 * @param {Function} options.onLocationFound - Callback when location found
 * @param {Function} options.onLocationError - Callback when error
 */
export const useGeolocation = (options = {}) => {
    const {
        watch = false,
        trackUserLocation = false,
        onLocationFound,
        onLocationError,
    } = options;

    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [supported, setSupported] = useState(true);
    const watchIdRef = useRef(null);

    // Check support
    useEffect(() => {
        setSupported(isGeolocationSupported());
    }, []);

    // Handle position success
    const handleSuccess = useCallback(
        (pos) => {
            setPosition(pos);
            setError(null);
            setLoading(false);
            onLocationFound?.(pos);
        },
        [onLocationFound]
    );

    // Handle error
    const handleError = useCallback(
        (err) => {
            const message = getErrorMessage(err);
            setError(message);
            setLoading(false);
            onLocationError?.(message);
            console.error('Geolocation error:', message);
        },
        [onLocationError]
    );

    // Get current position once
    const locate = useCallback(async () => {
        if (!supported) {
            handleError(new Error('Geolocation not supported'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const pos = await getCurrentPosition();
            handleSuccess(pos);
        } catch (err) {
            handleError(err);
        }
    }, [supported, handleSuccess, handleError]);

    // Start watching position
    const startWatch = useCallback(() => {
        if (!supported || watchIdRef.current !== null) return;

        setLoading(true);
        watchIdRef.current = watchPosition(handleSuccess, handleError);
    }, [supported, handleSuccess, handleError]);

    // Stop watching
    const stopWatch = useCallback(() => {
        if (watchIdRef.current !== null) {
            clearWatch(watchIdRef.current);
            watchIdRef.current = null;
            setLoading(false);
        }
    }, []);

    // Auto watch if enabled
    useEffect(() => {
        if (watch || trackUserLocation) {
            startWatch();
        }

        return () => {
            stopWatch();
        };
    }, [watch, trackUserLocation, startWatch, stopWatch]);

    return {
        position,
        error,
        loading,
        supported,
        locate,
        startWatch,
        stopWatch,
        isWatching: watchIdRef.current !== null,
    };
};