// components/shared/PopupFrame.jsx
import React from "react";
import "./PopupFrame.css";

const PopupFrame = ({
                        title,
                        children,
                        footer,
                        className = "",
                    }) => {
    return (
        <div className={`popup-frame ${className}`}>
            {/* HEADER */}
            {title && <div className="popup-header">{title}</div>}

            {/* BODY */}
            <div className="popup-body">{children}</div>

            {/* FOOTER */}
            {footer && <div className="popup-footer">{footer}</div>}
        </div>
    );
};

export default PopupFrame;
