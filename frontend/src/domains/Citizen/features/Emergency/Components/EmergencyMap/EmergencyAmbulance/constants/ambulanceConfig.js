export const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
export const DATA_API_URL = 'http://localhost:8080/api/emergency/dashboard/ambulance';
// Place your ambulance.glb file in public/models/ folder
export const AMBULANCE_MODEL_URL = '/models/ambulance.glb';

export const LAYER_ID = 'ambulance-3d-layer';
export const LIGHT_ID = 'ambulance-light';

export const priorityColors = {
    CRITICAL: '#ff0000',
    HIGH: '#ff6600',
    MEDIUM: '#ffcc00',
    LOW: '#00cc00'
};
