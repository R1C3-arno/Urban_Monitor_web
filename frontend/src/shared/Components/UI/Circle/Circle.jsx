import React from 'react';
import './Circle.css';

const Circle = ({
                    children,
                    size = 'medium',
                    className = '',
                    style = {},
                    clickable = false,
                    ...props
                }) => {
    return (
        <div
            className={`circle circle-${size} ${clickable ? "circle-clickable" : ""} ${className}`}
            style={style}
            {...props}
        >
            <div className="circle-content">
                {children}
            </div>
        </div>
    );
};

export default Circle;
