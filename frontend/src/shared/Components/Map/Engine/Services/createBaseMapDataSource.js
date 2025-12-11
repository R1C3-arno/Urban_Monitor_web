/**
 * Factory helper to dynamically import createDataSource implementation
 * Usage:
 *   const ds = await createBaseMapDataSource({ useMock, mockPath, apiPath })
 * mockPath/apiPath are module paths like "../features/Traffic/services/TrafficMockService.js"
 */
/**
 * Factory tạo MapDataSource từ config backend
 * FE không biết nghiệp vụ – chỉ biết endpoint
 */
export const createBaseMapDataSource = ({
                                            getIncidentsApi,
                                            getZonesApi,
                                        }) => {
    if (!getIncidentsApi || !getZonesApi) {
        throw new Error("createBaseMapDataSource requires APIs");
    }

    return {
        async fetchAll() {
            const [incRes, zoneRes] = await Promise.all([
                getIncidentsApi(),
                getZonesApi(),
            ]);

            return {
                incidents: incRes?.data ?? incRes,
                zones: zoneRes?.data ?? zoneRes,
            };
        },

        async getIncidents() {
            const res = await getIncidentsApi();
            return res?.data ?? res;
        },

        async getZones() {
            const res = await getZonesApi();
            return res?.data ?? res;
        },
    };
};
