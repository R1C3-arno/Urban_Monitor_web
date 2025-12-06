import {REPORT_CONFIG,REPORT_ERROR_MESSAGES} from "../../Config/reportConfig.js";

export class TrafficReport {
    constructor({ title, description, lat, lng, image }) {
        this.title = title;
        this.description = description;
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
            lat: this.lat,
            lng: this.lng,
            image: this.image,
            status: this.status,
            createdAt: this.createdAt,
        };
    }

    validate() {
        if (!this.title) throw new Error(REPORT_ERROR_MESSAGES.TITLE_REQUIRED);
        if (this.title.length < REPORT_CONFIG.TITLE_MIN_LENGTH) {
            throw new Error(REPORT_ERROR_MESSAGES.TITLE_TOO_SHORT);
        }

        if (!this.description || this.description.length < REPORT_CONFIG.DESCRIPTION_MIN_LENGTH) {
            throw new Error(REPORT_ERROR_MESSAGES.DESCRIPTION_TOO_SHORT);
        }

        if (this.lat === undefined || this.lng === undefined) {
            throw new Error(REPORT_ERROR_MESSAGES.LOCATION_REQUIRED);
        }
    }
}


/*
Không dính UI
✅ Chỉ lo dữ liệu
✅ Validate độc lập → dễ debug
 */