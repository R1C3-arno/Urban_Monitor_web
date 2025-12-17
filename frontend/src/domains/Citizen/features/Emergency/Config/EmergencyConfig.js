// EmergencyConfig.js
export const EMERGENCY_CONFIG = {
    ambulance: {
        apiUrl: 'http://localhost:8080/api/emergency/dashboard/ambulance',
        modelUrl: '/models/ambulance.glb',
        layerId: 'layer-3d-ambulance',
        sourceId: 'source-ambulance',
        circleId: 'circle-ambulance',
        lightId: 'light-ambulance',
        color: '#ff4444',
        label: 'Cấp cứu',
        scale: 100,
        priorityColors: { CRITICAL: '#ff0000', HIGH: '#ff6600', MEDIUM: '#ffcc00', LOW: '#00cc00' }
    },
    fire: {
        apiUrl: 'http://localhost:8080/api/emergency/dashboard/fire',
        modelUrl: '/models/fireTruck.glb',
        layerId: 'layer-3d-fire',
        sourceId: 'source-fire',
        circleId: 'circle-fire',
        lightId: 'light-fire',
        color: '#ff4400',
        label: 'Cứu hỏa',
        scale: 100,
        priorityColors: { CRITICAL: '#ff0000', HIGH: '#ff6600', MEDIUM: '#ffcc00', LOW: '#00cc00' }
    },
    crime: {
        apiUrl: 'http://localhost:8080/api/emergency/dashboard/crime',
        modelUrl: '/models/criminal.glb',
        layerId: 'layer-3d-crime',
        sourceId: 'source-crime',
        circleId: 'circle-crime',
        lightId: 'light-crime',
        color: '#0066cc',
        label: 'An ninh',
        scale: 80,
        priorityColors: { CRITICAL: '#ff0000', HIGH: '#ff6600', MEDIUM: '#ffcc00', LOW: '#00cc00' }
    },
    family: {
        apiUrl: 'http://localhost:8080/api/emergency/dashboard/family',
        modelUrl: '/models/family.glb',
        layerId: 'layer-3d-family',
        sourceId: 'source-family',
        circleId: 'circle-family',
        lightId: 'light-family',
        color: '#2ecc71',
        label: 'Gia đình',
        scale: 50,
        priorityColors: { CRITICAL: '#ff0000', HIGH: '#ff6600', MEDIUM: '#ffcc00', LOW: '#00cc00' } // Fallback colors
    }
};