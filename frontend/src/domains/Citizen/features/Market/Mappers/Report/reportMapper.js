import { MarketSafetyReport} from "../../Models/Report/MarketReport.js";
import {
    MARKET_SAFETY_REPORT_CONFIG,
    MARKET_SAFETY_REPORT_ERROR_MESSAGES
} from "../../Config/reportConfig.js";

/**
 * UI Form → Domain Model
 */
export const mapFormToMarketSafetyReport = (formData) => {
    if (!formData.title) throw new Error(MARKET_SAFETY_REPORT_ERROR_MESSAGES.TITLE_REQUIRED);
    if (formData.title.length < MARKET_SAFETY_REPORT_CONFIG.TITLE_MIN_LENGTH)
        throw new Error(MARKET_SAFETY_REPORT_ERROR_MESSAGES.TITLE_TOO_SHORT);

    if (
        !formData.description ||
        formData.description.length < MARKET_SAFETY_REPORT_CONFIG.DESCRIPTION_MIN_LENGTH
    ) {
        throw new Error(MARKET_SAFETY_REPORT_ERROR_MESSAGES.DESCRIPTION_TOO_SHORT);
    }

    if (!formData.type) {
        throw new Error(MARKET_SAFETY_REPORT_ERROR_MESSAGES.TYPE_REQUIRED);
    }

    if (formData.lat === undefined || formData.lng === undefined)
        throw new Error(MARKET_SAFETY_REPORT_ERROR_MESSAGES.LOCATION_REQUIRED);

    return new MarketSafetyReport({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        severity: formData.severity || "MEDIUM",
        storeName: formData.storeName || "",
        productName: formData.productName || "",
        lat: formData.lat,
        lng: formData.lng,
        image: formData.image || null,
    });
};

/**
 * Domain Model → API DTO
 */
export const mapMarketSafetyReportToApi = (report) => {
    return report.toJSON();
};

/**
 * API Response → UI
 */
export const mapApiToMarketSafetyReportResponse = (apiData) => {
    return {
        id: apiData.id,
        status: apiData.status,
        createdAt: apiData.createdAt,
    };
};