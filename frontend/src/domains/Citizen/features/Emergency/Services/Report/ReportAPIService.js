import {IReportDataSource} from "./IReportDataSource";

export class EmergencyReportAPIService extends IReportDataSource {
    async submitReport(apiPayload) {   // ✅ NHẬN DTO THUẦN
        const res = await fetch("http://localhost:8080/api/emergency-reports", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(apiPayload),
        });

        if (!res.ok) {
            throw new Error("Gửi báo cáo khẩn cấp thất bại");
        }

        return await res.json();
    }
}