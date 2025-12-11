import { useCallback } from "react";
import { useBaseReport } from "@/shared/Components/Map/Engine/index.js";
import { createBranchReportDataSource } from "../services/createBranchReportDataSource";
import {
    mapFormToBranchReport,
    mapBranchReportToApi,
    mapApiToBranchReportResponse,
} from "../mappers/reportMapper";

/**
 * ✅ Hook nghiệp vụ Report cho Branch Management
 * FE chỉ hiển thị - backend xử lý toàn bộ logic
 * 
 * Backend API: POST /api/company/branches/create
 * 
 * Flow:
 * 1. User điền form → formData
 * 2. mapFormToBranchReport: formData → BaseReport
 * 3. mapBranchReportToApi: BaseReport → API payload
 * 4. submitReport: Gửi payload lên backend
 * 5. mapApiToBranchReportResponse: Backend response → UI format
 * 
 * Backend validation:
 * - Required fields: branchName, branchType, lat, lng
 * - Số âm: monthlyRevenue, monthlyExpense, inventoryValue >= 0
 * - employeeCount >= 0
 * 
 * Backend tính toán:
 * - monthlyProfit = monthlyRevenue - monthlyExpense
 * - performanceLevel dựa vào profit margin
 * - Zone polygon tự động tạo quanh vị trí chi nhánh
 * 
 * @param {Object} options
 * @param {boolean} options.useMock - Dùng mock service hay API thật
 */
export const useBranchReport = ({ useMock = true } = {}) => {

    // ✅ STABLE SERVICE FACTORY → CHỐNG LOOP
    const createService = useCallback(() => {
        return createBranchReportDataSource({ useMock });
    }, [useMock]);

    return useBaseReport({
        createService,                         // ✅ Service factory
        mapFormToReport: mapFormToBranchReport,     // ✅ Form → BaseReport
        mapReportToApi: mapBranchReportToApi,       // ✅ BaseReport → API
        mapApiToResponse: mapApiToBranchReportResponse, // ✅ API → UI
    });
};
