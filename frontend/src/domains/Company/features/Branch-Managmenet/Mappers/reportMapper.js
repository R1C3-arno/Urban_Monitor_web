import { BaseReport } from "@/shared/Components/Map/Engine/index.js";

/**
 * ✅ Form → BaseReport
 * Chuyển data từ form UI sang BaseReport object
 */
export const mapFormToBranchReport = (formData) => {
    const report = new BaseReport({
        title: formData.branchName,
        description: formData.notes || "",
        lat: formData.lat,
        lng: formData.lng,
    });

    // Thông tin bổ sung vào meta
    report.meta = {
        branchType: formData.branchType,
        manager: formData.manager,
        employeeCount: formData.employeeCount,
        monthlyRevenue: formData.monthlyRevenue,
        monthlyExpense: formData.monthlyExpense,
        inventoryValue: formData.inventoryValue,
        address: formData.address,
        image: formData.image,
    };

    return report;
};

/**
 * ✅ BaseReport → API Payload
 * Chuẩn bị payload gửi lên backend
 */
export const mapBranchReportToApi = (report) => {
    return {
        branchName: report.title,
        branchType: report.meta.branchType,
        manager: report.meta.manager,
        employeeCount: report.meta.employeeCount,
        monthlyRevenue: report.meta.monthlyRevenue,
        monthlyExpense: report.meta.monthlyExpense,
        inventoryValue: report.meta.inventoryValue,
        address: report.meta.address,
        lat: report.lat,
        lng: report.lng,
        image: report.meta.image,
        notes: report.description,
        category: "BRANCH_MANAGEMENT",
    };
};

/**
 * ✅ API Response → UI Response
 * Chuyển response từ backend sang format cho UI
 */
export const mapApiToBranchReportResponse = (res) => {
    return {
        id: res.id,
        status: res.status,
        message: res.message,
        createdAt: res.createdAt,
        branch: res.branch,
    };
};
