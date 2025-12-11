/**
 * Base map configuration (shared)
 */
export const BASE_LEVELS = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
};

export const BASE_DEFAULT_RADIUS = {
    LOW: 120,
    MEDIUM: 200,
    HIGH: 300,
};

// Default styles/colors per level (features may override)
export const BASE_COLOR_BY_LEVEL = {
    LOW: "#60A5FA",
    MEDIUM: "#F59E0B",
    HIGH: "#EF4444",
};

export const BASE_MAP_CONFIG = {
    DEFAULT_CENTER: [106.7, 10.77],
    DEFAULT_ZOOM: 12,
    CIRCLE_SEGMENTS: 64,
};
