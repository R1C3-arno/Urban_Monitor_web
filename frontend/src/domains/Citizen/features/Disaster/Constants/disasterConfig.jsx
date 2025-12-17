import {ShieldUser,CloudRainWind, Waves,Earth,Flame,Tornado} from "lucide-react";

export const disasterConfig = {
    FLOOD: {
        color: '#94B4C1',
        patternUrl: '/patterns/flood-pattern.png',
        patternId: 'flood-pattern',
        icon: <Waves/>,
        label: 'Flood'
    },
    EARTHQUAKE: {
        color: '#715A5A',
        patternUrl: '/patterns/earthquake-pattern.png',
        patternId: 'earthquake-pattern',
        icon: <Earth />,
        label: 'Earthquake'
    },
    HEATWAVE: {
        color: '#CC561E',
        patternUrl: '/patterns/heatwave-pattern.png',
        patternId: 'heatwave-pattern',
        icon: <Flame />,
        label: 'Heatwave'
    },
    STORM: {
        color: '#005461',
        patternUrl: '/patterns/storm-pattern.png',
        patternId: 'storm-pattern',
        icon: <Tornado />,
        label: 'Storm'
    }
};

export const severityColors = {
    EXTREME: '#8B0000',
    SEVERE: '#ff0000',
    HIGH: '#ff6600',
    MODERATE: '#ffcc00',
    LOW: '#00cc00'
};

export const statusColors = {
    EMERGENCY: '#ff0000',
    ALERT: '#ff6600',
    WARNING: '#ffcc00',
    MONITORING: '#00cc00',
    RECOVERING: '#9966ff',
    RESOLVED: '#666666'
};

export const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
export const DATA_API_URL = 'http://localhost:8080/api/disaster/dashboard';
