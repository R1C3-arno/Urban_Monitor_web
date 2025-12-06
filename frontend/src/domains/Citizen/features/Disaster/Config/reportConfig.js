export const DISASTER_REPORT_CONFIG = {
    TITLE_MIN_LENGTH: 5,
    DESCRIPTION_MIN_LENGTH: 10,
    MAX_IMAGE_SIZE_MB: 5,

    STATUS: {
        PENDING: "PENDING",
        RESPONDING: "RESPONDING",
        RESOLVED: "RESOLVED",
        CLOSED: "CLOSED",
    },

    SEVERITY: {
        LOW: "LOW",
        MEDIUM: "MEDIUM",
        HIGH: "HIGH",
        CRITICAL: "CRITICAL",
    },

    TYPES: {
        FLOOD: "FLOOD",
        EARTHQUAKE: "EARTHQUAKE",
        FIRE: "FIRE",
        STORM: "STORM",
        LANDSLIDE: "LANDSLIDE",
        TSUNAMI: "TSUNAMI",
        DROUGHT: "DROUGHT",
        VOLCANIC_ERUPTION: "VOLCANIC_ERUPTION",
        OTHER: "OTHER",
    },

    API: {
        CREATE: "/api/disaster-reports",
    },
};

export const DISASTER_REPORT_ERROR_MESSAGES = {
    TITLE_REQUIRED: "Thiếu tiêu đề",
    TITLE_TOO_SHORT: "Tiêu đề quá ngắn",
    DESCRIPTION_TOO_SHORT: "Mô tả quá ngắn",
    LOCATION_REQUIRED: "Thiếu vị trí",
    IMAGE_TOO_LARGE: "Ảnh vượt quá dung lượng cho phép",
    TYPE_REQUIRED: "Thiếu loại thiên tai",
    SEVERITY_REQUIRED: "Thiếu mức độ nghiêm trọng",
    AFFECTED_PEOPLE_INVALID: "Số người bị ảnh hưởng không hợp lệ",
};