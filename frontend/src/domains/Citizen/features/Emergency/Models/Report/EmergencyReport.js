import {EMERGENCY_REPORT_CONFIG, EMERGENCY_REPORT_ERROR_MESSAGES} from "../../Config/reportConfig.js";

export class EmergencyReport {
    constructor({ title, description, type, priority, contactPhone, lat, lng, image }) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.priority = priority || "HIGH";
        this.contactPhone = contactPhone || "";
        this.lat = lat;
        this.lng = lng;
        this.image = image;
        this.createdAt = new Date().toISOString();
        this.status = "PENDING";
    }

    toJSON() {
        return {
            title: this.title,
            description: this.description,
            type: this.type,
            priority: this.priority,
            contactPhone: this.contactPhone,
            lat: this.lat,
            lng: this.lng,
            image: this.image,
            status: this.status,
            createdAt: this.createdAt,
        };
    }

    validate() {
        if (!this.title) throw new Error(EMERGENCY_REPORT_ERROR_MESSAGES.TITLE_REQUIRED);
        if (this.title.length < EMERGENCY_REPORT_CONFIG.TITLE_MIN_LENGTH) {
            throw new Error(EMERGENCY_REPORT_ERROR_MESSAGES.TITLE_TOO_SHORT);
        }

        if (!this.description || this.description.length < EMERGENCY_REPORT_CONFIG.DESCRIPTION_MIN_LENGTH) {
            throw new Error(EMERGENCY_REPORT_ERROR_MESSAGES.DESCRIPTION_TOO_SHORT);
        }

        if (!this.type) {
            throw new Error(EMERGENCY_REPORT_ERROR_MESSAGES.TYPE_REQUIRED);
        }

        if (!this.priority) {
            throw new Error(EMERGENCY_REPORT_ERROR_MESSAGES.PRIORITY_REQUIRED);
        }

        if (this.lat === undefined || this.lng === undefined) {
            throw new Error(EMERGENCY_REPORT_ERROR_MESSAGES.LOCATION_REQUIRED);
        }
    }
}