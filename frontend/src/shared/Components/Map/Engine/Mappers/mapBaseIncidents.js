/**
 * Map raw incident array → BaseIncident instances
 * Expect rawData to be array of objects from backend
 */
import { BaseIncident} from "../Domain/BaseIncident.js";

export const mapBaseIncidents = (raw = []) => {
    if (!Array.isArray(raw)) return [];

    return raw.map(item => {
        try {
            return new BaseIncident({
                id: item.id,
                title: item.title,
                description: item.description,
                lat: item.lat,
                lng: item.lng,
                level: item.level,
                type: item.type || item.category || null,
                icon: item.icon || null,
                image: item.image || null,
                createdAt: item.createdAt || item.timestamp || null,
                meta: item.meta || {},
            });
        } catch (err) {
            console.warn("[mapBaseIncidents] skip invalid item:", item?.id, err.message);
            return null;
        }
    }).filter(Boolean);
};
