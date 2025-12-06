import React, {useEffect, useState} from "react";
import ybrookie from '../../../../../../assets/ybrookie.jpg'
import ImageLayout_Left from "../../../../Layouts/ImageLayout_Left.jsx";
import Alert from "../../../../../../shared/Components/UI/Alert/Alert.jsx";
import ImageModal from "../../../../../../shared/Components/UI/ImageModal/ImageModal.jsx";
import './ReportAccident.css';
import {useTrafficReport} from "../../Hooks/useTrafficReport.js";

const ReportAccident = () => {
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
    const {submitReport, loading, error} = useTrafficReport({
        useMock: true, // ⚠️ đổi true nếu test offline
    });

    const [form, setForm] = useState({
        title: "",
        description: "",
        type: "",
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

            alert("Log Success: Report Sent");
            setOpen(false);
        } catch (err) {
            alert("Log Error " + err.message);
        }
    };


    return (
        <div className="traffic-report-button">
            <button onClick={() => setOpen(true)}>
                Report
            </button>
            <ImageModal
                isOpen={open}
                onClose={() => setOpen(false)}
                images={images}
                index={index}
                onPrev={handlePrev}
                onNext={handleNext}
                rightTitle="Thông tin cảnh báo"
                title="BÁO CÁO TAI NẠN"
                description="Bạn có chắc muốn tiếp tục thao tác này không?"
                rightContent={
                    <>
                        <Alert
                            inline
                            title="Xác Nhận Báo Cáo"
                            isOpen={true}
                            onClose={() => setOpen(false)}
                            onSubmit={handleSubmit}
                            form={form}
                            setForm={setForm}
                        />
                        <div className="traffic-report-button-location">
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

export default ReportAccident;


/*
✅ 6️⃣ BACKEND SPRING BOOT NHẬN BASE64 ĐƯỢC NGAY
public class ReportRequest {
    public String title;
    public String description;
    public String type;
    public String image; // ✅ BASE64
    public Double lat;
    public Double lng;
}

@PostMapping("/api/reports")
public Report create(@RequestBody ReportRequest req) {
    System.out.println("Lat: " + req.lat);
    System.out.println("Lng: " + req.lng);
    System.out.println("Image base64 length: " + req.image.length());
    return service.save(req);
}


✅ KHÔNG CẦN Multipart
✅ KHÔNG CẦN upload server
✅ TEST POSTMAN ĐƯỢC NGAY
 */