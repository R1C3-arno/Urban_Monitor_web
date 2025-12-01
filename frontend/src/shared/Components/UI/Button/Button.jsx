import React from 'react';
import './Button.css';

const Button = ({
                    children,
                    variant = 'primary',
                    size = 'sm',
                    loading = false,
                    disabled = false,
                    onClick,
                    icon,
                    ...props
                }) => {
    const className = `btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''}`;

    return (
        <button
            className={className}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="spinner"></span>}
            {icon && <span className="icon">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;