/**
 * Interface for data sources (FE-side contract)
 * Implementations (backend/mocks) must provide these methods
 */
export class IBaseMapDataSource {
    async fetchAll() { throw new Error("fetchAll() must be implemented"); }
    async fetchById(id) { throw new Error("fetchById() must be implemented"); }
    async report(payload) { throw new Error("report() must be implemented"); }
    async fetchIncidents() {
        throw new Error("fetchIncidents() not implemented");
    }


    async fetchIncidentById(id) {
        throw new Error("fetchIncidentById() not implemented");
    }
    async getIncidents() {
        throw new Error("getIncidents() must be implemented");
    }

    async getZones() {
        throw new Error("getZones() must be implemented");
    }
    getName() { return "IBaseMapDataSource"; }
}
