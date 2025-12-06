import { useState } from "react";
import { EmergencyReport } from "../Models/Report/EmergencyReport.js";
import { createEmergencyReportDataSource} from "../Services/Report/createReportDataSource.js";
import {
    mapFormToEmergencyReport,
    mapEmergencyReportToApi,
    mapApiToEmergencyReportResponse
} from "../Mappers/Report/reportMapper.js";

export const useEmergencyReport = ({ useMock = true } = {}) => {
    const service = createEmergencyReportDataSource({ useMock });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitReport = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            // ✅ UI → Domain
            const report = mapFormToEmergencyReport(formData);
            report.validate();

            // ✅ Domain → API
            const apiPayload = mapEmergencyReportToApi(report);

            const res = await service.submitReport(apiPayload);

            // ✅ API → UI
            return mapApiToEmergencyReportResponse(res);

        } catch (err) {
            console.error("❌ Emergency Report error:", err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submitReport, loading, error };
};