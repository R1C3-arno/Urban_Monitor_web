export const REPORT_CONFIG = {
    TITLE_MIN_LENGTH: 5,
    DESCRIPTION_MIN_LENGTH: 10,
    MAX_IMAGE_SIZE_MB: 5,

    STATUS: {
        PENDING: "PENDING",
        APPROVED: "APPROVED",
        REJECTED: "REJECTED",
    },

    API: {
        CREATE: "/api/reports",
    },
};

export const REPORT_ERROR_MESSAGES = {
    TITLE_REQUIRED: "Thiếu tiêu đề",
    TITLE_TOO_SHORT: "Tiêu đề quá ngắn",
    DESCRIPTION_TOO_SHORT: "Mô tả quá ngắn",
    LOCATION_REQUIRED: "Thiếu vị trí",
    IMAGE_TOO_LARGE: "Ảnh vượt quá dung lượng cho phép",
};
