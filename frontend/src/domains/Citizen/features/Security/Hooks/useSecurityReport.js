import { useState } from "react";
import { SecurityReport } from "../Models/Report/SecurityReport.js";
import { createSecurityReportDataSource} from "../Services/Report/createReportDataSource.js";
import {
    mapFormToSecurityReport,
    mapSecurityReportToApi,
    mapApiToSecurityReportResponse
} from "../Mappers/Report/reportMapper.js";

export const useSecurityReport = ({ useMock = true } = {}) => {
    const service = createSecurityReportDataSource({ useMock });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitReport = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            // ✅ UI → Domain
            const report = mapFormToSecurityReport(formData);
            report.validate();

            // ✅ Domain → API
            const apiPayload = mapSecurityReportToApi(report);

            const res = await service.submitReport(apiPayload);

            // ✅ API → UI
            return mapApiToSecurityReportResponse(res);

        } catch (err) {
            console.error("❌ Security Report error:", err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submitReport, loading, error };
};