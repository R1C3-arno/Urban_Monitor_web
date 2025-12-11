import { IBaseReportDataSource } from "@/shared/Components/Map/Engine/index.js";
import { BRANCH_API_CONFIG} from "@/domains/Company/features/Branch-Managmenet/Config/branchConfig.js";

/**
 * ✅ Service gọi API thật để tạo chi nhánh mới
 * 
 * Backend endpoint: POST /api/company/branches/create
 * 
 * Frontend gửi payload:
 * {
 *   branchName: "Chi nhánh Quận 1",
 *   branchType: "RETAIL",
 *   manager: "Nguyễn Văn A",
 *   employeeCount: 15,
 *   monthlyRevenue: 500000000,
 *   monthlyExpense: 300000000,
 *   inventoryValue: 150000000,
 *   address: "123 Nguyễn Huệ...",
 *   lat: 10.77,
 *   lng: 106.69,
 *   image: "base64...",
 *   notes: "Ghi chú..."
 * }
 * 
 * Backend cần:
 * 1. Validate dữ liệu (required fields, số âm, v.v.)
 * 2. Tính toán:
 *    - monthlyProfit = monthlyRevenue - monthlyExpense
 *    - performanceLevel dựa trên profit margin, revenue, v.v.
 *    - Tạo polygon zone ảnh hưởng cho chi nhánh
 * 3. Upload hình ảnh (nếu có)
 * 4. Lưu vào database
 * 
 * Backend trả về:
 * {
 *   id: "branch_123",
 *   status: "CREATED" | "PENDING" | "FAILED",
 *   message: "Chi nhánh đã được tạo thành công",
 *   createdAt: "2024-12-07T10:00:00Z",
 *   branch: {
 *     id: "branch_123",
 *     branchName: "Chi nhánh Quận 1",
 *     performanceLevel: "GOOD",  // Backend tính toán
 *     monthlyProfit: 200000000,  // Backend tính toán
 *     ...
 *   }
 * }
 * 
 * Nếu lỗi, backend trả về:
 * {
 *   error: true,
 *   message: "Lỗi validation: Tên chi nhánh không được để trống",
 *   code: "VALIDATION_ERROR",
 *   fields: {
 *     branchName: "Không được để trống"
 *   }
 * }
 */
export class BranchReportAPIService extends IBaseReportDataSource {
    constructor() {
        super();
        this.baseURL = BRANCH_API.CREATE;
    }

    async submit(payload) {
        const res = await fetch(this.baseURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Tạo chi nhánh thất bại");
        }

        return await res.json();
    }

    getName() {
        return "BranchReportAPIService";
    }
}
