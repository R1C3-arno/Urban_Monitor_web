import {IReportDataSource} from "./IReportDataSource";

export class ReportAPIService extends IReportDataSource {
    async submitReport(apiPayload) {   // ✅ NHẬN DTO THUẦN
        const res = await fetch("http://localhost:8080/api/reports", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(apiPayload),
        });

        if (!res.ok) {
            throw new Error("Gửi báo cáo thất bại");
        }

        return await res.json();
    }
}


/*
✅ Backend chỉ cần:

@PostMapping("/api/reports")
public Report create(@RequestBody ReportRequest req) {}
 */