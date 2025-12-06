import { DisasterReport} from "../Models/Report/DisasterReport.js";
import {
    DISASTER_REPORT_CONFIG,
    DISASTER_REPORT_ERROR_MESSAGES
} from "../Config/reportConfig.js";

/**
 * UI Form → Domain Model
 */
export const mapFormToDisasterReport = (formData) => {
    if (!formData.title) throw new Error(DISASTER_REPORT_ERROR_MESSAGES.TITLE_REQUIRED);
    if (formData.title.length < DISASTER_REPORT_CONFIG.TITLE_MIN_LENGTH)
        throw new Error(DISASTER_REPORT_ERROR_MESSAGES.TITLE_TOO_SHORT);

    if (
        !formData.description ||
        formData.description.length < DISASTER_REPORT_CONFIG.DESCRIPTION_MIN_LENGTH
    ) {
        throw new Error(DISASTER_REPORT_ERROR_MESSAGES.DESCRIPTION_TOO_SHORT);
    }

    if (!formData.type) {
        throw new Error(DISASTER_REPORT_ERROR_MESSAGES.TYPE_REQUIRED);
    }

    if (formData.lat === undefined || formData.lng === undefined)
        throw new Error(DISASTER_REPORT_ERROR_MESSAGES.LOCATION_REQUIRED);

    return new DisasterReport({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        severity: formData.severity || "MEDIUM",
        affectedPeople: formData.affectedPeople || 0,
        lat: formData.lat,
        lng: formData.lng,
        image: formData.image || null,
    });
};

/**
 * Domain Model → API DTO
 */
export const mapDisasterReportToApi = (report) => {
    return report.toJSON();
};

/**
 * API Response → UI
 */
export const mapApiToDisasterReportResponse = (apiData) => {
    return {
        id: apiData.id,
        status: apiData.status,
        createdAt: apiData.createdAt,
    };
};