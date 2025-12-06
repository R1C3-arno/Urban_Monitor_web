import { EmergencyReportMockService} from "./ReportMockService.js";
import { EmergencyReportAPIService} from "./ReportAPIService.js";

export const createEmergencyReportDataSource = ({ useMock = false } = {}) => {
    return useMock
        ? new EmergencyReportMockService()
        : new EmergencyReportAPIService();
};