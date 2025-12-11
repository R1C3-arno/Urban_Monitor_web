/**
 * BaseIncident (frontend-readonly)
 * Backend is authoritative for level/type/icon fields
 */
export class BaseIncident {
    constructor({
                    id,
                    title = "",
                    description = "",
                    lat,
                    lng,
                    level = null,
                    type = null,
                    icon = null,
                    image = null,
                    createdAt = null,
                    meta = {},
                }) {
        // Minimal validation (FE-side)
        if (!id) throw new Error("BaseIncident requires id");
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            throw new Error("BaseIncident requires valid lat/lng");
        }

        this._id = id;
        this._title = title;
        this._description = description;
        this._lat = lat;
        this._lng = lng;
        this._level = level;
        this._type = type;
        this._icon = icon;
        this._image = image;
        this._createdAt = createdAt;
        this._meta = meta;

        Object.freeze(this);
    }

    get id() { return this._id; }
    get title() { return this._title; }
    get description() { return this._description; }
    get lat() { return this._lat; }
    get lng() { return this._lng; }
    get level() { return this._level; }
    get type() { return this._type; }
    get icon() { return this._icon; }
    get image() { return this._image; }
    get createdAt() { return this._createdAt; }
    get meta() { return this._meta; }

    // Marker expects [lng, lat]
    get coords() { return [this._lng, this._lat]; }

    toJSON() {
        return {
            id: this._id,
            title: this._title,
            description: this._description,
            lat: this._lat,
            lng: this._lng,
            coords: this.coords,
            level: this._level,
            type: this._type,
            icon: this._icon,
            image: this._image,
            createdAt: this._createdAt,
            meta: this._meta,
        };
    }
}
