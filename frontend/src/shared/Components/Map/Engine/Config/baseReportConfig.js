/**
 * Base report config + messages (shared)
 */
export const BASE_REPORT_CONFIG = {
    TITLE_MIN_LENGTH: 5,
    DESCRIPTION_MIN_LENGTH: 10,
    MAX_IMAGES: 3,
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
};

export const BASE_REPORT_ERROR_MESSAGES = {
    TITLE_REQUIRED: "Tiêu đề không được để trống",
    TITLE_TOO_SHORT: `Tiêu đề phải ≥ ${BASE_REPORT_CONFIG.TITLE_MIN_LENGTH} ký tự`,
    DESCRIPTION_REQUIRED: "Mô tả không được để trống",
    DESCRIPTION_TOO_SHORT: `Mô tả phải ≥ ${BASE_REPORT_CONFIG.DESCRIPTION_MIN_LENGTH} ký tự`,
    LOCATION_REQUIRED: "Bắt buộc phải chọn vị trí trên bản đồ",
    IMAGE_LIMIT: `Chỉ được upload tối đa ${BASE_REPORT_CONFIG.MAX_IMAGES} ảnh`,
    IMAGE_TYPE_INVALID: "Định dạng ảnh không hợp lệ",
};
