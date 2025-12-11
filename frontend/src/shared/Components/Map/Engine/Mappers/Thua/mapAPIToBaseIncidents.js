import { BaseIncident } from "../../Domain/BaseIncident.js";


/**
 * ✅ API → BaseIncident[]
 */
export const mapApiToBaseIncidents = (rawData = []) => {
    if (!Array.isArray(rawData)) return [];


    return rawData.map(item => new BaseIncident(item));
};