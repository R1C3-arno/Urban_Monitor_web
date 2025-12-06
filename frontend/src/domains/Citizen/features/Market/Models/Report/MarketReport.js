import {MARKET_SAFETY_REPORT_CONFIG, MARKET_SAFETY_REPORT_ERROR_MESSAGES} from "../../Config/reportConfig.js";

export class MarketSafetyReport {
    constructor({ title, description, type, severity, storeName, productName, lat, lng, image }) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.severity = severity || "MEDIUM";
        this.storeName = storeName || "";
        this.productName = productName || "";
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
            severity: this.severity,
            storeName: this.storeName,
            productName: this.productName,
            lat: this.lat,
            lng: this.lng,
            image: this.image,
            status: this.status,
            createdAt: this.createdAt,
        };
    }

    validate() {
        if (!this.title) throw new Error(MARKET_SAFETY_REPORT_ERROR_MESSAGES.TITLE_REQUIRED);
        if (this.title.length < MARKET_SAFETY_REPORT_CONFIG.TITLE_MIN_LENGTH) {
            throw new Error(MARKET_SAFETY_REPORT_ERROR_MESSAGES.TITLE_TOO_SHORT);
        }

        if (!this.description || this.description.length < MARKET_SAFETY_REPORT_CONFIG.DESCRIPTION_MIN_LENGTH) {
            throw new Error(MARKET_SAFETY_REPORT_ERROR_MESSAGES.DESCRIPTION_TOO_SHORT);
        }

        if (!this.type) {
            throw new Error(MARKET_SAFETY_REPORT_ERROR_MESSAGES.TYPE_REQUIRED);
        }

        if (!this.severity) {
            throw new Error(MARKET_SAFETY_REPORT_ERROR_MESSAGES.SEVERITY_REQUIRED);
        }

        if (this.lat === undefined || this.lng === undefined) {
            throw new Error(MARKET_SAFETY_REPORT_ERROR_MESSAGES.LOCATION_REQUIRED);
        }
    }
}