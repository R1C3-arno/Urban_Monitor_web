import { BaseZone } from "@/shared/Components/Map/Engine/index.js";

/**
 * ✅ Mapper chuyển zones từ backend → BaseZone
 * FE chỉ nhận polygon từ backend và wrap lại
 * 
 * Backend trả về zones:
 * [
 *   {
 *     id: "zone_1",
 *     coords: [[lng, lat], [lng, lat], ...],
 *     color: "#22C55E",
 *     opacity: 0.3,
 *     branchId: "branch_123",
 *     level: "EXCELLENT"
 *   }
 * ]
 */
export const mapBranchZones = (zonesFromAPI = []) => {
    if (!Array.isArray(zonesFromAPI)) {
        console.error("mapBranchZones nhận sai dữ liệu:", zonesFromAPI);
        return [];
    }
    return zonesFromAPI.map(zone =>
        new BaseZone({
            id: zone.id,
            coords: zone.coords,
            level: zone.level || "AVERAGE",
            color: zone.color,
            opacity: zone.opacity ?? 0.3,
        })
    );
};
