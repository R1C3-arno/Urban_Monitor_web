export const MARKET_SAFETY_REPORT_CONFIG = {
    TITLE_MIN_LENGTH: 5,
    DESCRIPTION_MIN_LENGTH: 10,
    MAX_IMAGE_SIZE_MB: 5,

    STATUS: {
        PENDING: "PENDING",
        INVESTIGATING: "INVESTIGATING",
        VERIFIED: "VERIFIED",
        DISMISSED: "DISMISSED",
        RESOLVED: "RESOLVED",
    },

    SEVERITY: {
        LOW: "LOW",
        MEDIUM: "MEDIUM",
        HIGH: "HIGH",
        CRITICAL: "CRITICAL",
    },

    TYPES: {
        FOOD_HYGIENE: "FOOD_HYGIENE",
        PRODUCT_QUALITY: "PRODUCT_QUALITY",
        EXPIRED_PRODUCT: "EXPIRED_PRODUCT",
        COUNTERFEIT: "COUNTERFEIT",
        CONTAMINATED_FOOD: "CONTAMINATED_FOOD",
        MISLABELING: "MISLABELING",
        UNSAFE_PACKAGING: "UNSAFE_PACKAGING",
        PRICE_FRAUD: "PRICE_FRAUD",
        OTHER: "OTHER",
    },

    API: {
        CREATE: "/api/market-safety-reports",
    },
};

export const MARKET_SAFETY_REPORT_ERROR_MESSAGES = {
    TITLE_REQUIRED: "Thiếu tiêu đề",
    TITLE_TOO_SHORT: "Tiêu đề quá ngắn",
    DESCRIPTION_TOO_SHORT: "Mô tả quá ngắn",
    LOCATION_REQUIRED: "Thiếu vị trí",
    IMAGE_TOO_LARGE: "Ảnh vượt quá dung lượng cho phép",
    TYPE_REQUIRED: "Thiếu loại vấn đề an toàn",
    SEVERITY_REQUIRED: "Thiếu mức độ nghiêm trọng",
    STORE_NAME_REQUIRED: "Thiếu tên cửa hàng",
    PRODUCT_NAME_REQUIRED: "Thiếu tên sản phẩm",
};