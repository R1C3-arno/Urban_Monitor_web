import { IBranchDataSource} from "@/domains/Company/features/Branch-Managmenet/Services/IBranchDataSource.js";
import { MOCK_CONFIG} from "@/domains/Company/features/Branch-Managmenet/Config/branchConfig.js";

export class BranchMockService extends IBranchDataSource {
    constructor() {
        super();
        this._dataCache = null;
    }

    async fetchBranches() {
        try {
            if (this._dataCache) {
                return this._dataCache.branches || [];
            }

            const response = await fetch(MOCK_CONFIG.DATA_PATH);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            this._dataCache = data;

            return data.branches || [];
        } catch (error) {
            console.error("Mock service error:", error);
            throw new Error(`Failed to load mock data: ${error.message}`);
        }
    }

    async fetchBranchById(id) {
        const branches = await this.fetchBranches();
        const branch = branches.find(b => b.id === id);
        if (!branch) throw new Error(`Branch ${id} not found`);
        return branch;
    }

    getName() {
        return "BranchMockService";
    }

    clearCache() {
        this._dataCache = null;
    }
}
