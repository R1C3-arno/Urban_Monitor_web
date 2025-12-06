import { EmergencyReport } from "../../Models/Report/EmergencyReport.js";
import {
    EMERGENCY_REPORT_CONFIG,
    EMERGENCY_REPORT_ERROR_MESSAGES
} from "../../Config/reportConfig.js";

/**
 * UI Form → Domain Model
 */
export const mapFormToEmergencyReport = (formData) => {
    if (!formData.title) throw new Error(EMERGENCY_REPORT_ERROR_MESSAGES.TITLE_REQUIRED);
    if (formData.title.length < EMERGENCY_REPORT_CONFIG.TITLE_MIN_LENGTH)
        throw new Error(EMERGENCY_REPORT_ERROR_MESSAGES.TITLE_TOO_SHORT);

    if (
        !formData.description ||
        formData.description.length < EMERGENCY_REPORT_CONFIG.DESCRIPTION_MIN_LENGTH
    ) {
        throw new Error(EMERGENCY_REPORT_ERROR_MESSAGES.DESCRIPTION_TOO_SHORT);
    }

    if (!formData.type) {
        throw new Error(EMERGENCY_REPORT_ERROR_MESSAGES.TYPE_REQUIRED);
    }

    if (formData.lat === undefined || formData.lng === undefined)
        throw new Error(EMERGENCY_REPORT_ERROR_MESSAGES.LOCATION_REQUIRED);

    return new EmergencyReport({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        priority: formData.priority || "HIGH",
        contactPhone: formData.contactPhone || "",
        lat: formData.lat,
        lng: formData.lng,
        image: formData.image || null,
    });
};

/**
 * Domain Model → API DTO
 */
export const mapEmergencyReportToApi = (report) => {
    return report.toJSON();
};

/**
 * API Response → UI
 */
export const mapApiToEmergencyReportResponse = (apiData) => {
    return {
        id: apiData.id,
        status: apiData.status,
        createdAt: apiData.createdAt,
    };
};