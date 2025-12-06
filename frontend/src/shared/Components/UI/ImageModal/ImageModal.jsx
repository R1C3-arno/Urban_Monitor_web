import React from "react";

import Modal from "../Modal/Modal";
import PopupFrame from "../../UI/PopUpFrame/PopUpFrame.jsx";
import "./ImageModal.css";
import Card from "../Card/Card.jsx";
import Alert from "../Alert/Alert.jsx";

const ImageModal = ({
                        isOpen,
                        onClose,
                        title = "Images",
                        images = [],
                        index = 0,
                        onPrev,
                        onNext,
                        rightContent ,
                        rightTitle = "",
                    }) => {
    const total = 2;
    const currentImage = images[index];

    return  (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <PopupFrame
                title={title}
                className="popup-image"
                footer=
                    {total > 1 && (
                        <>
                            <button onClick={onPrev} className="nav-btn">◀</button>
                            <span>{index + 1} / {total}</span>
                            <button onClick={onNext} className="nav-btn">▶</button>
                        </>
                    )
                }
            >
                {/* BODY CHIA 2 CỘT */}
                <div className="image-modal-split">

                    {/* CỘT TRÁI: ẢNH */}
                    <div className="image-modal-left">
                        <img src={currentImage} alt="preview"/>
                    </div>

                    {/* CỘT PHẢI: FORM / INFO */}
                    <div className="image-modal-right">
                        <Card title={rightTitle}>
                            {rightContent}
                        </Card>
                    </div>

                </div>
            </PopupFrame>
        </Modal>
    );
};

export default ImageModal;
