export const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
export const DATA_API_URL = 'http://localhost:8080/api/emergency/dashboard/crime';
// Place your criminal.glb file in public/models/ folder
export const CRIMINAL_MODEL_URL = '/models/criminal.glb';

export const LAYER_ID = 'crime-3d-layer';
export const LIGHT_ID = 'crime-light';

export const priorityColors = {
    CRITICAL: '#ff0000',
    HIGH: '#ff6600',
    MEDIUM: '#ffcc00',
    LOW: '#00cc00'
};
