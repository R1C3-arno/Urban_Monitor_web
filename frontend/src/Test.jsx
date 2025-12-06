import React, {useState} from 'react';
import Button from "./shared/Components/UI/Button/Button.jsx";
import Card from "./shared/Components/UI/Card/Card.jsx";
import Modal from "./shared/Components/UI/Modal/Modal.jsx";
import Spinner from "./shared/Components/UI/Spinner/Spinner.jsx";
import BaseMap from "./shared/Components/Map/BaseMap/Map.jsx";
import MapPopUp from "./shared/Components/Map/MapPopUp/PopUp.jsx";
import ImageModal from "./shared/Components/UI/ImageModal/ImageModal.jsx";
import General from "./General/Pages/General.jsx";
import ybrookie from "./assets/ybrookie.jpg";
import logo from "./assets/logo.png";
import Alert from "./shared/Components/UI/Alert/Alert.jsx";

const Test = () => {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const images = [ybrookie];
    const handleSubmit = () => {
        console.log("Submit alert");
    };

    const handlePrev = () => {
        setIndex((prev) =>
            prev === 0 ? 2 - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setIndex((prev) =>
            prev === 2 - 1 ? 0 : prev + 1
        );
    };

    return (
        <div style={{ padding: 40 }}>
            <button onClick={() => setOpen(true)}>
                MỞ MODAL TEST
            </button>

            <ImageModal
                isOpen={open}
                onClose={() => setOpen(false)}
                images= {images}
                index={index}
                onPrev={handlePrev}
                onNext={handleNext}
                rightTitle="Thông tin cảnh báo"
                title="BÁO CÁO TAI NẠN"
                description="Bạn có chắc muốn tiếp tục thao tác này không?"
                rightContent={
                    <Alert
                        inline
                        title="Xác Nhận Báo Cáo"
                        isOpen={true}
                        onClose={() => setOpen(false)}
                        onSubmit={handleSubmit}
                    />
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

export default Test;
