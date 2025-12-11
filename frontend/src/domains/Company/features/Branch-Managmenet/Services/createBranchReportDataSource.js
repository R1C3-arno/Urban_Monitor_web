import { BranchReportAPIService } from "./BranchReportAPIService";
import { BranchReportMockService } from "./BranchReportMockService";

/**
 * ✅ Factory tạo report data source cho Branch
 * Switch giữa Mock và API service
 */


export const createBranchReportDataSource = ({ useMock = false } = {}) => {
    return useMock
        ? new BranchReportMockService()
        : new BranchReportAPIService();
};
