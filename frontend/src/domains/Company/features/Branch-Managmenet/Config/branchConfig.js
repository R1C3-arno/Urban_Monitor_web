export const BRANCH_TYPES = {
    RETAIL: "RETAIL",
    WAREHOUSE: "WAREHOUSE",
    FACTORY: "FACTORY",
    OFFICE: "OFFICE",
};

export const BRANCH_LEVELS = {
    EXCELLENT: "EXCELLENT",
    GOOD: "GOOD",
    AVERAGE: "AVERAGE",
    POOR: "POOR",
};

export const BRANCH_COLORS = {
    EXCELLENT: "#22C55E",
    GOOD: "#3B82F6",
    AVERAGE: "#F59E0B",
    POOR: "#EF4444",
};

export const BRANCH_MAP_CONFIG = {
    DEFAULT_CENTER: [106.7, 10.77],
    DEFAULT_ZOOM: 12,
};

export const CIRCLE_CONFIG = {
    OPACITY: 0.25,
    SEGMENTS: 64,
    RADIUS_BY_LEVEL: {
        EXCELLENT: 300,
        GOOD: 250,
        AVERAGE: 200,
        POOR: 150,
    },
};

export const BRANCH_API_CONFIG = {
    BASE_URL: "http://localhost:8080/api/company/method2/branches",
};

export const MOCK_CONFIG = {
    ENABLED: false,
    DATA_PATH: "/mock/branches.json",
};
