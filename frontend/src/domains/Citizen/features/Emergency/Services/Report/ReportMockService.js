import { IReportDataSource } from "./IReportDataSource";

export class EmergencyReportMockService extends IReportDataSource {
    async submitReport(report) {
        console.log("🚨 Mock submit emergency report:", report);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: Math.floor(Math.random() * 1000),
                    status: "DISPATCHED",
                    createdAt: new Date().toISOString(),
                });
            }, 500); // Faster response for emergencies
        });
    }
}