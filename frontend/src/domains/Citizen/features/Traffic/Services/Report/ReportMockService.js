import { IReportDataSource } from "./IReportDataSource";

export class ReportMockService extends IReportDataSource {
    async submitReport(report) {
        console.log("🧪 Mock submit report:", report);

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


/*
✅ Test UI không cần backend
✅ Debug cực dễ
 */