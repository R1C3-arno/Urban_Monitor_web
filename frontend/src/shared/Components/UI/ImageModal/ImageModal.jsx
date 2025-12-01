import React from "react";
import Modal from "../Modal/Modal.jsx";
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
            <div className="image-modal-wrapper">
                {/* HEADER */}
                <div className="image-modal-header">
                    <span>{title}</span>
                </div>

                {/* IMAGE */}
                <div className="image-modal-body">
                    <img src={currentImage} alt="preview" />
                </div>

                {/* FOOTER */}
                <div className="image-modal-footer">
                    <button onClick={onPrev} className="nav-btn">◀</button>
                    <span>{index + 1} / {total}</span>
                    <button onClick={onNext} className="nav-btn">▶</button>
                </div>
            </div>
        </Modal>
    );
};

export default ImageModal;
