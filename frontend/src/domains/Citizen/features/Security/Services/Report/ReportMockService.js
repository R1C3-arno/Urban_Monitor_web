import { IReportDataSource } from "./IReportDataSource";

export class SecurityReportMockService extends IReportDataSource {
    async submitReport(report) {
        console.log("🧪 Mock submit security report:", report);

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