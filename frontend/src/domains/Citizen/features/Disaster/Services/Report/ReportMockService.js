import { IReportDataSource } from "./IReportDataSource";

export class DisasterReportMockService extends IReportDataSource {
    async submitReport(report) {
        console.log("🧪 Mock submit disaster report:", report);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: Math.floor(Math.random() * 1000),
                    status: "PENDING",
                    createdAt: new Date().toISOString(),
                });
            }, 1000);
        });
    }
}