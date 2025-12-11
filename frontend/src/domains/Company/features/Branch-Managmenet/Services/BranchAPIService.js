import { IBranchDataSource } from "./IBranchDataSource.js";
import { BRANCH_API_CONFIG } from "../Config/branchConfig.js";
import {BranchMethod2Adapter} from "@/domains/Company/features/Branch-Managmenet/Services/BranchMethod2Adapter.js";

export class BranchAPIService extends IBranchDataSource {
    async fetchBranches() {
        try {
            const response = await fetch(BRANCH_API_CONFIG.BASE_URL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();

            // ← ADD: Adapt Method2 response to your format
            const branches = Array.isArray(data) ? data : (data.branches || []);
            return BranchMethod2Adapter.adaptBranches(branches);
        } catch (error) {
            console.error("API error:", error);
            throw error;
        }
    }

    async fetchBranchById(id) {
        try {
            const response = await fetch(`${BRANCH_API_CONFIG.BASE_URL}/${id}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const branch = await response.json();

            // ← ADD: Adapt single branch
            return BranchMethod2Adapter.adaptBranch(branch);
        } catch (error) {
            console.error(`API error fetching branch ${id}:`, error);
            throw error;
        }
    }

    getName() {
        return "BranchAPIService (Method2)";
    }
}
