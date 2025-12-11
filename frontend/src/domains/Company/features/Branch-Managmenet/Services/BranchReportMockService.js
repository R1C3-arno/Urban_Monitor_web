import { IBaseReportDataSource } from "@/shared/Components/Map/Engine/index.js";

/**
 * ✅ Mock Service cho việc tạo chi nhánh mới
 * Dùng để test FE trước khi có API thật
 */
export class BranchReportMockService extends IBaseReportDataSource {
    async submit(payload) {
        console.log("🧪 Mock: Creating new branch:", payload);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: `branch_${Math.floor(Math.random() * 1000)}`,
                    status: "CREATED",
                    message: "Chi nhánh đã được tạo thành công",
                    createdAt: new Date().toISOString(),
                    branch: {
                        id: `branch_${Math.floor(Math.random() * 1000)}`,
                        ...payload,
                        // Backend sẽ tính toán các giá trị này
                        monthlyProfit: payload.monthlyRevenue - payload.monthlyExpense,
                        performanceLevel: "GOOD",
                    }
                });
            }, 1500);
        });
    }

    getName() {
        return "BranchReportMockService";
    }
}
