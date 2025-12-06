import React, {useEffect, useState} from "react";
import ybrookie from '../../../../../../assets/ybrookie.jpg'
import ImageLayout_Left from "../../../../Layouts/ImageLayout_Left.jsx";
import Alert from "../../../../../../shared/Components/UI/Alert/Alert.jsx";
import ImageModal from "../../../../../../shared/Components/UI/ImageModal/ImageModal.jsx";
import './ReportEmergency.css';
import {useEmergencyReport} from "../../Hooks/useReportEmergency.js";

const ReportEmergency = () => {
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
    const {submitReport, loading, error} = useEmergencyReport({
        useMock: true, // ⚠️ đổi true nếu test offline
    });

    const [form, setForm] = useState({
        title: "",
        description: "",
        type: "", // Ví dụ: "MEDICAL", "FIRE_EMERGENCY", "POLICE_NEEDED", "RESCUE"
        priority: "HIGH", // "LOW", "MEDIUM", "HIGH", "CRITICAL"
        contactPhone: "",
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
            if (!form.title || !form.type || !form.description) {
                alert("Log Error: Please fill the form");
                return;
            }


            let imageBase64 = null;
            if (form.image) {
                imageBase64 = await convertToBase64(form.image);
            }

            const payload = {
                ...form,
                image: imageBase64,   // ✅ BASE64
                lat: userLocation.lat,
                lng: userLocation.lng,
            };

            await submitReport(payload);

            alert("Log Success: Emergency Report Sent - Help is on the way!");
            setOpen(false);
        } catch (err) {
            alert("Log Error " + err.message);
        }
    };


    return (
        <div className="emergency-report-button">
            <button onClick={() => setOpen(true)}>
                🚨 KHẨN CẤP
            </button>
            <ImageModal
                isOpen={open}
                onClose={() => setOpen(false)}
                images={images}
                index={index}
                onPrev={handlePrev}
                onNext={handleNext}
                rightTitle="Thông tin khẩn cấp"
                title="BÁO CÁO TRƯỜNG HỢP KHẨN CẤP"
                description="Yêu cầu hỗ trợ khẩn cấp sẽ được ưu tiên xử lý ngay lập tức!"
                rightContent={
                    <>
                        <Alert
                            inline
                            title="⚠️ Xác Nhận Yêu Cầu Khẩn Cấp"
                            isOpen={true}
                            onClose={() => setOpen(false)}
                            onSubmit={handleSubmit}
                            form={form}
                            setForm={setForm}
                        />
                        <div className="emergency-report-button-location">
                            <button onClick={handlePickLocation}>
                                Choose Location
                            </button>
                        </div>
                    </>
                }
                footer={
                    <>
                        <button onClick={() => setOpen(false)}>Hủy</button>
                        <button onClick={() => alert("OK")}>GỬI KHẨN CẤP</button>
                    </>
                }
            />


        </div>
    );
};

export default ReportEmergency;