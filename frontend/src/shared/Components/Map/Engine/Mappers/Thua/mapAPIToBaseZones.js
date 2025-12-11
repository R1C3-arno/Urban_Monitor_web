import { BaseZone } from "../../Domain/BaseZone.js";


/**
 * ✅ API → BaseZone[]
 * Backend trả sẵn polygon
 */
export const mapApiToBaseZones = (zones = []) => {
    if (!Array.isArray(zones)) return [];


    return zones.map(zone => new BaseZone(zone));
};