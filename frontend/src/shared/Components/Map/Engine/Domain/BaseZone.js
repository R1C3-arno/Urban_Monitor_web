/**
 * BaseZone
 * IMPORTANT: coords must be prepared by backend as polygon ring:
 * coords: [[lng, lat], [lng, lat], ...] and closed (first == last) or frontend will close it before use.
 *
 * FE MUST NOT generate polygon from center+radius when using backend-driven approach.
 */
export class BaseZone {
    constructor({ id, coords = [], level = null, color = null, opacity = 0.3 }) {
        if (!id) throw new Error("BaseZone requires id");
        if (!Array.isArray(coords) || coords.length < 3) {
            throw new Error("BaseZone requires coords array of points");
        }

        this._id = id;
        this._coords = coords;
        this._level = level;
        this._color = color;
        this._opacity = opacity;

        Object.freeze(this);
    }

    get id() { return this._id; }
    get coords() { return this._coords; } // [[lng,lat], ...]
    get level() { return this._level; }
    get color() { return this._color; }
    get opacity() { return this._opacity; }

    toGeoJSON() {
        return {
            type: "Feature",
            id: this._id,
            geometry: {
                type: "Polygon",
                coordinates: [this._coords],
            },
            properties: {
                id: this._id,
                level: this._level,
                color: this._color,
                opacity: this._opacity,
            },
        };
    }

    toJSON() {
        return {
            id: this._id,
            coords: this._coords,
            level: this._level,
            color: this._color,
            opacity: this._opacity,
        };
    }
}
