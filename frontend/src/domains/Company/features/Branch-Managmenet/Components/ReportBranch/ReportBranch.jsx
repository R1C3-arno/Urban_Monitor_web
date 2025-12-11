import React, { useState } from "react";
import ImageModal from "@/shared/Components/UI/ImageModal/ImageModal.jsx";
import Alert from "@/shared/Components/UI/Alert/Alert.jsx";
import "./ReportBranch.css";
import { useBranchReport } from "../../hooks/useBranchReport";
import { BRANCH_TYPES} from "@/domains/Company/features/Branch-Managmenet/Config/branchConfig.js";

/**
 * ✅ Component tạo/báo cáo chi nhánh mới
 * 
 * Backend API endpoint: POST /api/company/branches/create
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
 *   image: "base64...",  // Hình ảnh dạng base64
 *   notes: "Ghi chú..."
 * }
 * 
 * Backend cần validate và tính toán:
 * - monthlyProfit = monthlyRevenue - monthlyExpense
 * - performanceLevel dựa trên các chỉ số
 * - Tạo zone ảnh hưởng cho chi nhánh
 * 
 * Backend trả về:
 * {
 *   id: "branch_123",
 *   status: "CREATED",
 *   message: "Chi nhánh đã được tạo thành công",
 *   createdAt: "2024-12-07T10:00:00Z"
 * }
 */
const ReportBranch = () => {
    const [open, setOpen] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    const [form, setForm] = useState({
        branchName: "",
        branchType: "",
        manager: "",
        employeeCount: 0,
        monthlyRevenue: 0,
        monthlyExpense: 0,
        inventoryValue: 0,
        address: "",
        image: null,
        notes: "",
    });

    const { submitReport, loading, error } = useBranchReport({ useMock: false });

    // Chọn vị trí trên bản đồ
    const handlePickLocation = () => {
        // TODO: Tích hợp với Map để user click chọn vị trí
        setUserLocation({ lat: 10.77, lng: 106.69 });
        alert("✅ Vị trí đã chọn");
    };

    // Convert file → base64
    const convertToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });

    // Submit form
    const handleSubmit = async () => {
        try {
            // Convert image nếu có
            let imageBase64 = null;
            if (form.image) {
                imageBase64 = await convertToBase64(form.image);
            }

            // Gửi toàn bộ lên backend
            const payload = {
                ...form,
                image: imageBase64,
                lat: userLocation?.lat || null,
                lng: userLocation?.lng || null,
            };

            // Backend sẽ validate và trả lỗi nếu có
            await submitReport(payload);

            alert("✅ Tạo chi nhánh thành công!");
            setOpen(false);
            
            // Reset form
            setForm({
                branchName: "",
                branchType: "",
                manager: "",
                employeeCount: 0,
                monthlyRevenue: 0,
                monthlyExpense: 0,
                inventoryValue: 0,
                address: "",
                image: null,
                notes: "",
            });
            setUserLocation(null);

        } catch (err) {
            // Hiển thị lỗi từ backend
            alert("❌ " + err.message);
        }
    };

    return (
        <div className="branch-report-button-container">
            <button 
                className="branch-report-button"
                onClick={() => setOpen(true)}
            >
                🏢 Tạo chi nhánh mới
            </button>

            <ImageModal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="TẠO CHI NHÁNH MỚI"
                images={[]} // Không cần preview images
                rightTitle="Thông tin chi nhánh"
                rightContent={
                    <>
                        {/* Form tạo chi nhánh */}
                        <Alert
                            inline={true}
                            isOpen={true}
                            title="Thông tin chi nhánh"
                            message="Điền đầy đủ thông tin chi nhánh"
                            confirmText="Tạo chi nhánh"
                            cancelText="Hủy"
                            onClose={() => setOpen(false)}
                            onSubmit={handleSubmit}
                            form={form}
                            setForm={setForm}
                            fields={BRANCH_TYPES}  // ✅ 100% configurable từ branchConfig
                        />

                        {/* Location Picker */}
                        <div className="branch-location-picker">
                            <button onClick={handlePickLocation}>
                                📍 {userLocation ? "Vị trí đã chọn" : "Chọn vị trí trên bản đồ"}
                            </button>
                            {userLocation && (
                                <p className="branch-location-info">
                                    Lat: {userLocation.lat}, Lng: {userLocation.lng}
                                </p>
                            )}
                        </div>

                        {/* Loading/Error */}
                        {loading && <p style={{ color: '#f59e0b', marginTop: '12px' }}>⏳ Đang tạo...</p>}
                        {error && <p style={{ color: '#ef4444', marginTop: '12px' }}>❌ {error}</p>}
                    </>
                }
            />
        </div>
    );
};

export default ReportBranch;
