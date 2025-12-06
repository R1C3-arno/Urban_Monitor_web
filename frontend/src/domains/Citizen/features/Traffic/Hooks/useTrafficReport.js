import { useState } from "react";
import { TrafficReport} from "../Models/Report/TrafficReport.js";
import { createReportDataSource} from "../Services/Report/createReportDataSource.js";
import { mapFormToReport,mapReportToApi,mapApiToReportResponse} from "../Mappers/Report/reportMapper.js";

export const useTrafficReport = ({ useMock = true } = {}) => {
    const service = createReportDataSource({ useMock });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitReport = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            // ✅ UI → Domain
            const report = mapFormToReport(formData);
            report.validate();

            // ✅ Domain → API
            const apiPayload = mapReportToApi(report);

            const res = await service.submitReport(apiPayload);

            // ✅ API → UI
            return mapApiToReportResponse(res);

        } catch (err) {
            console.error("❌ Report error:", err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submitReport, loading, error };
};

/*
✅ UI sạch
✅ Test riêng hook được
✅ Mock / API đổi cực dễ
 */