import { MarketSafetyReportMockService} from "./ReportMockService.js";
import { MarketSafetyReportAPIService} from "./ReportAPIService.js";

export const createMarketSafetyReportDataSource = ({ useMock = false } = {}) => {
    return useMock
        ? new MarketSafetyReportMockService()
        : new MarketSafetyReportAPIService();
};