export const SECURITY_REPORT_CONFIG = {
    TITLE_MIN_LENGTH: 5,
    DESCRIPTION_MIN_LENGTH: 10,
    MAX_IMAGE_SIZE_MB: 5,

    STATUS: {
        PENDING: "PENDING",
        INVESTIGATING: "INVESTIGATING",
        RESOLVED: "RESOLVED",
        DISMISSED: "DISMISSED",
    },

    SEVERITY: {
        LOW: "LOW",
        MEDIUM: "MEDIUM",
        HIGH: "HIGH",
        CRITICAL: "CRITICAL",
    },

    TYPES: {
        THEFT: "THEFT",
        SUSPICIOUS_PERSON: "SUSPICIOUS_PERSON",
        VIOLENCE: "VIOLENCE",
        VANDALISM: "VANDALISM",
        HARASSMENT: "HARASSMENT",
        TRESPASSING: "TRESPASSING",
        OTHER: "OTHER",
    },

    API: {
        CREATE: "/api/security-reports",
    },
};

export const SECURITY_REPORT_ERROR_MESSAGES = {
    TITLE_REQUIRED: "Thiếu tiêu đề",
    TITLE_TOO_SHORT: "Tiêu đề quá ngắn",
    DESCRIPTION_TOO_SHORT: "Mô tả quá ngắn",
    LOCATION_REQUIRED: "Thiếu vị trí",
    IMAGE_TOO_LARGE: "Ảnh vượt quá dung lượng cho phép",
    TYPE_REQUIRED: "Thiếu loại vấn đề an ninh",
    SEVERITY_REQUIRED: "Thiếu mức độ nghiêm trọng",
};