import { TrafficReport} from "../../Models/Report/TrafficReport.js";
import {
    REPORT_CONFIG,
    REPORT_ERROR_MESSAGES
} from "../../Config/reportConfig.js";

/**
 * UI Form → Domain Model
 */
export const mapFormToReport = (formData) => {
    if (!formData.title) throw new Error(REPORT_ERROR_MESSAGES.TITLE_REQUIRED);
    if (formData.title.length < REPORT_CONFIG.TITLE_MIN_LENGTH)
        throw new Error(REPORT_ERROR_MESSAGES.TITLE_TOO_SHORT);

    if (
        !formData.description ||
        formData.description.length < REPORT_CONFIG.DESCRIPTION_MIN_LENGTH
    ) {
        throw new Error(REPORT_ERROR_MESSAGES.DESCRIPTION_TOO_SHORT);
    }

    if (formData.lat === undefined || formData.lng === undefined)
        throw new Error(REPORT_ERROR_MESSAGES.LOCATION_REQUIRED);

    return new TrafficReport({
        title: formData.title,
        description: formData.description,
        lat: formData.lat,
        lng: formData.lng,
        image: formData.image || null,
    });
};

/**
 * Domain Model → API DTO
 */
export const mapReportToApi = (report) => {
    return report.toJSON();
};

/**
 * API Response → UI
 */
export const mapApiToReportResponse = (apiData) => {
    return {
        id: apiData.id,
        status: apiData.status,
        createdAt: apiData.createdAt,
    };
};
