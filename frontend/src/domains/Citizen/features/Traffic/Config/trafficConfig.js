// All constant $ settings

/**
 * Traffic Feature Configuration
 * Single source of truth for all traffic-related constants
 * Follows SRP - only manages configuration
 */

import { TRAFFIC_LEVEL_COLORS} from "../../../../../shared/Constants/color.js";
import accident1 from "../../../../../assets/accident1.jpg";
import accident2 from "../../../../../assets/accident2.jpg";

// ==================== MAP SETTINGS ====================
export const TRAFFIC_MAP_CONFIG = {
    DEFAULT_CENTER: [106.7, 10.7], // Ho Chi Minh City
    DEFAULT_ZOOM: 13,
    MIN_ZOOM: 10,
    MAX_ZOOM: 18,
};

// ==================== GEOLOCATION SETTINGS ====================
export const GEOLOCATION_CONFIG = {
    ENABLED: true,
    POSITION: "top-right",
    TRACK_USER: false,
    SHOW_USER_LOCATION: true,
    SHOW_ACCURACY_CIRCLE: true,
    MAX_ACCURACY_RADIUS: 50, // ✅ GIỚI HẠN 50M (fix vấn đề bành trướng)
    HIGH_ACCURACY: true,
    TIMEOUT: 10000,
    MAXIMUM_AGE: 0,
};

// ==================== CIRCLE POLYGON SETTINGS ====================
export const CIRCLE_CONFIG = {
    OPACITY: 0.25, // Giảm opacity để không che markers
    SEGMENTS: 64, // Độ mịn của circle
    RADIUS_BY_LEVEL: {
        LOW: 120,
        MEDIUM: 200,
        HIGH: 300,
    },
};

// ==================== TRAFFIC LEVELS ====================
export const TRAFFIC_LEVELS = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
};

// ==================== COLORS ====================
export const TRAFFIC_COLORS = TRAFFIC_LEVEL_COLORS;

// ==================== IMAGE ASSETS ====================
export const TRAFFIC_IMAGES = {
    accident1,
    accident2,
};

// ==================== API ENDPOINTS ====================
export const TRAFFIC_API_CONFIG = {
    BASE_URL: "http://localhost:8080/api/traffic",
    ENDPOINTS: {
        GET_MAP_DATA: "/map",
        REPORT_INCIDENT: "/report",
        GET_INCIDENT_DETAIL: "/incident/:id",
    },
    TIMEOUT: 5000,
};

// ==================== MOCK DATA CONFIG ====================
export const MOCK_CONFIG = {
    ENABLED: true, // ✅ Toggle để dùng mock hoặc real API
    DATA_PATH: "/mock/traffic.json",
};

// ==================== POPUP CONFIG ====================
export const POPUP_CONFIG = {
    CLOSE_BUTTON: true,
    CLOSE_ON_CLICK: false,
    OFFSET: [0, -10],
    MAX_WIDTH: "400px",
};

// ==================== VALIDATION RULES ====================
export const VALIDATION_RULES = {
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 500,
    REQUIRED_FIELDS: ["lat", "lng", "level", "title"],
    VALID_LEVELS: Object.values(TRAFFIC_LEVELS),
};

// ==================== ERROR MESSAGES ====================
export const ERROR_MESSAGES = {
    LOAD_FAILED: "Không thể tải dữ liệu giao thông",
    INVALID_DATA: "Dữ liệu không hợp lệ",
    NETWORK_ERROR: "Lỗi kết nối mạng",
    GEOLOCATION_DENIED: "Bạn đã từ chối quyền truy cập vị trí",
    GEOLOCATION_UNAVAILABLE: "Không thể xác định vị trí",
    GEOLOCATION_TIMEOUT: "Hết thời gian chờ",
};