import { DisasterReportMockService} from "./ReportMockService.js";
import { DisasterReportAPIService} from "./ReportAPIService.js";

export const createDisasterReportDataSource = ({ useMock = false } = {}) => {
    return useMock
        ? new DisasterReportMockService()
        : new DisasterReportAPIService();
};