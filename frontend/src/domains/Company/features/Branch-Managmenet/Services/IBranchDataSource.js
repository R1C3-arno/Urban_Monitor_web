export class IBranchDataSource {
    async fetchBranches() {
        throw new Error("fetchBranches() must be implemented");
    }

    async fetchBranchById(id) {
        throw new Error("fetchBranchById() must be implemented");
    }

    getName() {
        throw new Error("getName() must be implemented");
    }
}

export const createBranchDataSource = async (useMock = false) => {
    if (useMock) {
        const { BranchMockService } = await import("./BranchMockService.js");
        return new BranchMockService();
    } else {
        const { BranchAPIService } = await import("./BranchAPIService.js");
        return new BranchAPIService();
    }
};
