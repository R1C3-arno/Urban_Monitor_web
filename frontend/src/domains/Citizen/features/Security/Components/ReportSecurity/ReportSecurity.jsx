import React, {useEffect, useState} from "react";
import ybrookie from '../../../../../../assets/ybrookie.jpg'
import ImageLayout_Left from "../../../../Layouts/ImageLayout_Left.jsx";
import Alert from "../../../../../../shared/Components/UI/Alert/Alert.jsx";
import ImageModal from "../../../../../../shared/Components/UI/ImageModal/ImageModal.jsx";
import './ReportSecurity.css';
import {useSecurityReport} from "../../Hooks/useSecurityReport.js";

const ReportSecurity = () => {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const images = [ybrookie];

    const [userLocation, setUserLocation] = useState(null);

    // Khi người dùng click map:
    const handlePickLocation = () => {
        // ✅ TẠM GIẢ LẬP (sau này thay bằng click map)
        setUserLocation({
            lat: 10.762622,
            lng: 106.660172,
        });

        alert("Log Success: Location changed successfully.");
    };

    const convertToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });


    // ✅ LẤY SERVICE TỪ HOOK
    const {submitReport, loading, error} = useSecurityReport({
        useMock: true, // ⚠️ đổi true nếu test offline
    });

    const [form, setForm] = useState({
        title: "",
        description: "",
        type: "", // Ví dụ: "THEFT", "SUSPICIOUS_PERSON", "VIOLENCE", "VANDALISM"
        severity: "MEDIUM", // "LOW", "MEDIUM", "HIGH", "CRITICAL"
        image: null,
    });


    const handlePrev = () => {
        setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleSubmit = async () => {
        try {
            if (!userLocation) {
                alert("Log Error: Please choose a location");
                return;
            }

            let imageBase64 = null;
            if (form.image) {
                imageBase64 = await convertToBase64(form.image);
            }

            const payload = {
                ...form,
                image: imageBase64,
                lat: userLocation.lat,
                lng: userLocation.lng,
            };

            await submitReport(payload);

            alert("✅ Security Report Sent");
            setOpen(false);
        } catch (err) {
            alert("❌ " + err.message);
        }
    };

    /*
    UI chỉ chịu trách nhiệm:

Lấy dữ liệu

Gửi đi

Hiển thị lỗi
     */


    return (
        <div className="security-report-button">
            <button onClick={() => setOpen(true)}>
                Báo Cáo An Ninh
            </button>
            <ImageModal
                isOpen={open}
                onClose={() => setOpen(false)}
                images={images}
                index={index}
                onPrev={handlePrev}
                onNext={handleNext}
                rightTitle="Thông tin cảnh báo an ninh"
                title="BÁO CÁO VẤN ĐỀ AN NINH"
                description="Bạn có chắc muốn tiếp tục thao tác này không?"
                rightContent={
                    <>
                        <Alert
                            inline
                            title="Xác Nhận Báo Cáo An Ninh"
                            isOpen={true}
                            onClose={() => setOpen(false)}
                            onSubmit={handleSubmit}
                            form={form}
                            setForm={setForm}
                        />
                        <div className="security-report-button-location">
                            <button onClick={handlePickLocation}>
                                Choose Location
                            </button>
                        </div>
                    </>
                }
                footer={
                    <>
                        <button onClick={() => setOpen(false)}>Hủy</button>
                        <button onClick={() => alert("OK")}>Xác nhận</button>
                    </>
                }
            />


        </div>
    );
};

export default ReportSecurity;