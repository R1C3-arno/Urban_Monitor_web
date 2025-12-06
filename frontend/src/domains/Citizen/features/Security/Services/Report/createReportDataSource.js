import { SecurityReportMockService} from "./ReportMockService.js";
import { SecurityReportAPIService} from "./ReportAPIService.js";

export const createSecurityReportDataSource = ({ useMock = false } = {}) => {
    return useMock
        ? new SecurityReportMockService()
        : new SecurityReportAPIService();
};