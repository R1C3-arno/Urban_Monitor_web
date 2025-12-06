
export class IReportDataSource {
    async submitReport(report) {
        throw new Error("submitReport() must be implemented");
    }
}




/*
✅ UI không biết backend là gì
✅ Mock hay API đổi được
 */