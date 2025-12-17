export const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
export const DATA_API_URL = 'http://localhost:8080/api/utility-monitor/dashboard';

export const metricColors = {
    water: {
        low: '#00b4d8',
        medium: '#0077b6',
        high: '#03045e'
    },
    electricity: {
        low: '#ffea00',
        medium: '#ff9500',
        high: '#ff0000'
    },
    wifi: {
        excellent: '#00e400',
        good: '#7cfc00',
        fair: '#ffff00',
        poor: '#ff7e00',
        bad: '#ff0000'
    }
};

export const metricButtonColors = {
    water: '#0077b6',
    electricity: '#ff9500',
    wifi: '#00e400'
};
