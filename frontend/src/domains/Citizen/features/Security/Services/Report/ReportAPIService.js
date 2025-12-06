import {IReportDataSource} from "./IReportDataSource";

export class SecurityReportAPIService extends IReportDataSource {
    async submitReport(apiPayload) {   // ✅ NHẬN DTO THUẦN
        const res = await fetch("http://localhost:8080/api/security-reports", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(apiPayload),
        });

        if (!res.ok) {
            throw new Error("Gửi báo cáo an ninh thất bại");
        }

        return await res.json();
    }
}