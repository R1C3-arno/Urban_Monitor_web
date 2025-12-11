/**
 * Factory for Report Submit Service
 */
export const createBaseReportDataSource = ({
                                               submitReportApi,
                                           }) => {
    if (!submitReportApi) {
        throw new Error("createBaseReportDataSource requires submitReportApi");
    }

    return {
        async submitReport(reportPayload) {
            const res = await submitReportApi(reportPayload);
            return res?.data ?? res;
        },
    };
};
