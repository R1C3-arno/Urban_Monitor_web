// Services/createReportDataSource.js
import { ReportMockService } from "./ReportMockService";
import { ReportAPIService } from "./ReportAPIService";

export const createReportDataSource = ({ useMock = false } = {}) => {
    return useMock
        ? new ReportMockService()
        : new ReportAPIService();
};
