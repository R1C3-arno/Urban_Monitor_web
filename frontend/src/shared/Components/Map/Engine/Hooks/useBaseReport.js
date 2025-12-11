/**
 * useBaseReport
 * - createService: function that returns a report service instance
 * - mapFormToReport: formData => BaseReport instance
 * - mapReportToApi: BaseReport => payload for API
 * - mapApiToResponse: API response => usable object
 *
 * Service expected to have submit(payload) method.
 */
import { useState } from "react";

export const useBaseReport = ({
                                  createService,
                                  mapFormToReport,
                                  mapReportToApi,
                                  mapApiToResponse,
                              } = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitReport = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            const report = mapFormToReport(formData);
            report.validate();

            const payload = mapReportToApi(report);
            const service = typeof createService === "function" ? await createService() : null;
            if (!service || typeof service.submit !== "function") {
                throw new Error("Report service not available");
            }

            const res = await service.submit(payload);
            return mapApiToResponse ? mapApiToResponse(res) : res;
        } catch (err) {
            console.error("[useBaseReport] submitReport error:", err);
            setError(err.message || String(err));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submitReport, loading, error };
};
