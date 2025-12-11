/**
 * BaseReport - simple domain DTO on frontend
 * Validation uses baseMapReportConfig on FE but BE still authoritative
 */
import {
    BASE_REPORT_CONFIG,
    BASE_REPORT_ERROR_MESSAGES
} from "../Config/baseReportConfig.js";

export class BaseReport {
    constructor({ title, description, lat, lng, images = [] } = {}) {
        this.title = title;
        this.description = description;
        this.lat = lat;
        this.lng = lng;
        this.images = images;
        this.createdAt = new Date().toISOString();
        this.status = "PENDING";
    }

    validate() {
        if (!this.title) throw new Error(BASE_REPORT_ERROR_MESSAGES.TITLE_REQUIRED);
        if (this.title.length < BASE_REPORT_CONFIG.TITLE_MIN_LENGTH) {
            throw new Error(BASE_REPORT_ERROR_MESSAGES.TITLE_TOO_SHORT);
        }
        if (!this.description) throw new Error(BASE_REPORT_ERROR_MESSAGES.DESCRIPTION_REQUIRED);
        if (this.description.length < BASE_REPORT_CONFIG.DESCRIPTION_MIN_LENGTH) {
            throw new Error(BASE_REPORT_ERROR_MESSAGES.DESCRIPTION_TOO_SHORT);
        }
        if (this.lat == null || this.lng == null) throw new Error(BASE_REPORT_ERROR_MESSAGES.LOCATION_REQUIRED);
        if (this.images && this.images.length > BASE_REPORT_CONFIG.MAX_IMAGES) {
            throw new Error(BASE_REPORT_ERROR_MESSAGES.IMAGE_LIMIT);
        }
    }

    toJSON() {
        return {
            title: this.title,
            description: this.description,
            lat: this.lat,
            lng: this.lng,
            images: this.images,
            createdAt: this.createdAt,
            status: this.status,
        };
    }
}
