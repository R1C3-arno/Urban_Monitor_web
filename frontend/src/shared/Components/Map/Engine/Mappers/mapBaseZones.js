/**
 * Map raw zone array → BaseZone instances
 * Expect backend sends array of zones with coords already computed
 */
import { BaseZone} from "../Domain/BaseZone.js";

export const mapBaseZones = (raw = []) => {
    if (!Array.isArray(raw)) return [];

    return raw.map(z => {
        try {
            return new BaseZone({
                id: z.id,
                coords: z.coords,
                level: z.level,
                color: z.color,
                opacity: typeof z.opacity === "number" ? z.opacity : 0.3,
            });
        } catch (err) {
            console.warn("[mapBaseZones] skip invalid zone:", z?.id, err.message);
            return null;
        }
    }).filter(Boolean);
};
