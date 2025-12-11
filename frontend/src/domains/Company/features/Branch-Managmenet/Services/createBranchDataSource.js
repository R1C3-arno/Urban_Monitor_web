import { BranchAPIService } from "./BranchAPIService";
import { BranchMockService } from "./BranchMockService";

/**
 * ✅ Factory tạo data source cho Branch
 * Switch giữa Mock và API service
 */


export const createBranchDataSource = ({ useMock = false } = {}) => {
    return useMock ? new BranchMockService() : new BranchAPIService();
};
