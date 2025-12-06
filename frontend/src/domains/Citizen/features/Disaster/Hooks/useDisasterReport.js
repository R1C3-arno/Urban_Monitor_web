import { useState } from "react";
import { DisasterReport } from "../Models/Report/DisasterReport.js";
import { createDisasterReportDataSource} from "../Services/Report/createReportDataSource.js";
import {
    mapFormToDisasterReport,
    mapDisasterReportToApi,
    mapApiToDisasterReportResponse
} from "../Mappers/reportMapper.js";

export const useDisasterReport = ({ useMock = true } = {}) => {
    const service = createDisasterReportDataSource({ useMock });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitReport = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            // ✅ UI → Domain
            const report = mapFormToDisasterReport(formData);
            report.validate();

            // ✅ Domain → API
            const apiPayload = mapDisasterReportToApi(report);

            const res = await service.submitReport(apiPayload);

            // ✅ API → UI
            return mapApiToDisasterReportResponse(res);

        } catch (err) {
            console.error("❌ Disaster Report error:", err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submitReport, loading, error };
};