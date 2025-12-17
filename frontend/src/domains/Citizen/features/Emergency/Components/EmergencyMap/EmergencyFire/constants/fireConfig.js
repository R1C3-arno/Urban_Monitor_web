export const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
export const DATA_API_URL = 'http://localhost:8080/api/emergency/dashboard/fire';
// Place your fireTruck.glb file in public/models/ folder
export const FIRETRUCK_MODEL_URL = '/models/fireTruck.glb';

export const LAYER_ID = 'fire-3d-layer';
export const LIGHT_ID = 'fire-light';

export const priorityColors = {
    CRITICAL: '#ff0000',
    HIGH: '#ff6600',
    MEDIUM: '#ffcc00',
    LOW: '#00cc00'
};
