export const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
// Gọi endpoint mới
export const DATA_API_URL = 'http://localhost:8080/api/air-quality/dashboard';

export const levelColors = {
    GOOD: '#00e400',
    MODERATE: '#ffff00',
    UNHEALTHY_SENSITIVE: '#ff7e00',
    UNHEALTHY: '#ff0000',
    VERY_UNHEALTHY: '#8f3f97',
    HAZARDOUS: '#7e0023'
};

export const levelLabels = {
    GOOD: 'Tốt',
    MODERATE: 'Trung bình',
    UNHEALTHY_SENSITIVE: 'Kém',
    UNHEALTHY: 'Xấu',
    VERY_UNHEALTHY: 'Rất xấu',
    HAZARDOUS: 'Nguy hại'
};
