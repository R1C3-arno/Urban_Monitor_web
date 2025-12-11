export class IBaseReportDataSource {
    async submit(payload) { throw new Error("submit() must be implemented"); }
    getName() { return "IBaseReportDataSource"; }
    async submitReport(reportPayload) {
        throw new Error("submitReport() must be implemented");
    }
}
