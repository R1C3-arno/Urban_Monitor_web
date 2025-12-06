export const EMERGENCY_REPORT_CONFIG = {
    TITLE_MIN_LENGTH: 5,
    DESCRIPTION_MIN_LENGTH: 10,
    MAX_IMAGE_SIZE_MB: 5,

    STATUS: {
        PENDING: "PENDING",
        DISPATCHED: "DISPATCHED",
        IN_PROGRESS: "IN_PROGRESS",
        RESOLVED: "RESOLVED",
        CANCELLED: "CANCELLED",
    },

    PRIORITY: {
        LOW: "LOW",
        MEDIUM: "MEDIUM",
        HIGH: "HIGH",
        CRITICAL: "CRITICAL",
    },

    TYPES: {
        MEDICAL: "MEDICAL",
        FIRE_EMERGENCY: "FIRE_EMERGENCY",
        POLICE_NEEDED: "POLICE_NEEDED",
        RESCUE: "RESCUE",
        CARDIAC_ARREST: "CARDIAC_ARREST",
        SEVERE_INJURY: "SEVERE_INJURY",
        CHILD_IN_DANGER: "CHILD_IN_DANGER",
        DOMESTIC_VIOLENCE: "DOMESTIC_VIOLENCE",
        OTHER: "OTHER",
    },

    API: {
        CREATE: "/api/emergency-reports",
    },
};

export const EMERGENCY_REPORT_ERROR_MESSAGES = {
    TITLE_REQUIRED: "Thiếu tiêu đề",
    TITLE_TOO_SHORT: "Tiêu đề quá ngắn",
    DESCRIPTION_TOO_SHORT: "Mô tả quá ngắn",
    LOCATION_REQUIRED: "Thiếu vị trí",
    IMAGE_TOO_LARGE: "Ảnh vượt quá dung lượng cho phép",
    TYPE_REQUIRED: "Thiếu loại khẩn cấp",
    PRIORITY_REQUIRED: "Thiếu mức độ ưu tiên",
    CONTACT_PHONE_INVALID: "Số điện thoại không hợp lệ",
};