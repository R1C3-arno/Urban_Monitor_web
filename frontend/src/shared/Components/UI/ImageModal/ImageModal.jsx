import React from "react";
import Modal from "../Modal/Modal";
import PopupFrame from "../../UI/PopUpFrame/PopUpFrame.jsx";
import "./ImageModal.css";

const ImageModal = ({
                        isOpen,
                        onClose,
                        title = "Images",
                        images = [],
                        index = 0,
                        onPrev,
                        onNext,
                    }) => {
    const total = images.length;
    const currentImage = images[index];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <PopupFrame
                title={title}
                className="popup-image"
                footer={
                    <>
                        <button onClick={onPrev} className="nav-btn">◀</button>
                        <span>{index + 1} / {total}</span>
                        <button onClick={onNext} className="nav-btn">▶</button>
                    </>
                }
            >
                <div className="image-modal-body">
                    <img src={currentImage} alt="preview" />
                </div>
            </PopupFrame>
        </Modal>
    );
};

export default ImageModal;
