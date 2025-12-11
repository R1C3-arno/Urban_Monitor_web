// Domain Model

/**
 * TrafficIncident Domain Model
 * Follows OOP principles and encapsulates incident data
 * Immutable and self-validating
 */

/**
 * TrafficIncident Domain Model
 * ✅ UPDATED: Added `type` field to match backend
 * Backend sends: { id, title, lat, lng, level, type, image, ... }
 */

import {TRAFFIC_LEVELS, VALIDATION_RULES} from "../Config/trafficConfig.js";

export class TrafficIncident {
    constructor({
                    id,
                    title,
                    description,
                    lat,
                    lng,
                    level,
                    type,           //update : NEW: CAR,BIKe,ACCident,JAM
                    image,
                    timestamp,
                    reporter,
                    status = "PENDING",
                }) {
        // Validate on construction
        this._validate({id, title, lat, lng, level,type});

        // Immutable properties
        this._id = id;
        this._title = title;
        this._description = description || "";
        this._lat = lat;
        this._lng = lng;
        this._level = level;
        this._type = type || "ACCIDENT"; // ✅ Default to ACCIDENT
        this._image = image || null;
        this._timestamp = timestamp || Date.now();
        this._reporter = reporter || "Anonymous";
        this._status = status;

        Object.freeze(this); // Make immutable
    }

    // ==================== GETTERS ====================
    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    get description() {
        return this._description;
    }

    get lat() {
        return this._lat;
    }

    get lng() {
        return this._lng;
    }

    get level() {
        return this._level;
    }

    get type() {
        return this._type; //  NEW
    }

    get image() {
        return this._image;
    }

    get timestamp() {
        return this._timestamp;
    }

    get reporter() {
        return this._reporter;
    }

    get status() {
        return this._status;
    }

    get coords() {
        return [this._lng, this._lat];
    }

    // ==================== BUSINESS LOGIC ====================
    isHighPriority() {
        return this._level === TRAFFIC_LEVELS.HIGH;
    }

    isMediumPriority() {
        return this._level === TRAFFIC_LEVELS.MEDIUM;
    }

    isLowPriority() {
        return this._level === TRAFFIC_LEVELS.LOW;
    }

    isValidated() {
        return this._status === "VALIDATED";
    }

    isPending() {
        return this._status === "PENDING";
    }

    hasImage() {
        return this._image !== null && this._image !== undefined;
    }

    //  NEW: Check incident type
    isAccident() {
        return this._type === "ACCIDENT";
    }

    isTrafficJam() {
        return this._type === "JAM";
    }

    // ==================== VALIDATION ====================
    _validate({id, title, lat, lng, level,type}) {
        const errors = [];

        if (!id) {
            errors.push("ID is required");
        }

        if (!title || title.trim().length === 0) {
            errors.push("Title is required");
        }

        if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
            errors.push("Invalid latitude");
        }

        if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
            errors.push("Invalid longitude");
        }

        if (!VALIDATION_RULES.VALID_LEVELS.includes(level)) {
            errors.push(`Invalid level. Must be one of: ${VALIDATION_RULES.VALID_LEVELS.join(", ")}`);
        }

        // ✅ NEW: Validate type
        const validTypes = ["CAR", "BIKE", "ACCIDENT", "JAM", "SLOW", "FAST"];
        if (type && !validTypes.includes(type)) {
            errors.push(`Invalid type. Must be one of: ${validTypes.join(", ")}`);
        }

        if (errors.length > 0) {
            throw new Error(`TrafficIncident validation failed: ${errors.join(", ")}`);
        }
    }

    // ==================== UTILITIES ====================
    toJSON() {
        return {
            id: this._id,
            title: this._title,
            description: this._description,
            lat: this._lat,
            lng: this._lng,
            level: this._level,
            type: this._type,     //  NEW
            image: this._image,
            timestamp: this._timestamp,
            reporter: this._reporter,
            status: this._status,
        };
    }

    toString() {
        return `TrafficIncident(${this._id}: ${this._title} at [${this._lat}, ${this._lng}])`;
    }

    // ==================== FACTORY METHODS ====================
    static fromAPI(apiData) {
        return new TrafficIncident({
            id: apiData.id,
            title: apiData.title,
            description: apiData.description,
            lat: apiData.lat,
            lng: apiData.lng,
            level: apiData.level,
            type: apiData.type,   // ✅ NEW: Backend sends this
            image: apiData.image,
            timestamp: apiData.timestamp,
            reporter: apiData.reporter,
            status: apiData.status || "VALIDATED",
        });
    }

    static fromMock(mockData) {
        return new TrafficIncident({
            id: mockData.id,
            title: mockData.title,
            description: mockData.description,
            lat: mockData.lat,
            lng: mockData.lng,
            level: mockData.level,
            type: mockData.type || "ACCIDENT", // ✅ NEW
            image: mockData.image,
            timestamp: mockData.timestamp || Date.now(),
            reporter: mockData.reporter || "Mock User",
            status: "VALIDATED",
        });
    }
}