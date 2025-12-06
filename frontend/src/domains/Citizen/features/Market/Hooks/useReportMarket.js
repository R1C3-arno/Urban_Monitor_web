import { useState } from "react";
import { MarketSafetyReport} from "../Models/Report/MarketReport.js";
import { createMarketSafetyReportDataSource} from "../Services/Report/createReportDataSource.js";
import {
    mapFormToMarketSafetyReport,
    mapMarketSafetyReportToApi,
    mapApiToMarketSafetyReportResponse
} from "../Mappers/Report/reportMapper.js";

export const useMarketSafetyReport = ({ useMock = true } = {}) => {
    const service = createMarketSafetyReportDataSource({ useMock });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitReport = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            // ✅ UI → Domain
            const report = mapFormToMarketSafetyReport(formData);
            report.validate();

            // ✅ Domain → API
            const apiPayload = mapMarketSafetyReportToApi(report);

            const res = await service.submitReport(apiPayload);

            // ✅ API → UI
            return mapApiToMarketSafetyReportResponse(res);

        } catch (err) {
            console.error("❌ Market Safety Report error:", err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submitReport, loading, error };
};