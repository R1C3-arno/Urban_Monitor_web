const StatsCard = ({ value, label, gradient, labelColor }) => {
    const baseStyle = {
        padding: '12px',
        borderRadius: '8px'
    };

    const style = gradient
        ? { ...baseStyle, background: gradient }
        : { ...baseStyle, background: 'rgba(255,255,255,0.1)', textAlign: 'center' };

    return (
        <div style={style}>
            {labelColor ? (
                <>
                    <div style={{ fontSize: '12px', color: labelColor, marginBottom: '4px' }}>
                        {label}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        {value}
                    </div>
                </>
            ) : (
                <>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {value}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        {label}
                    </div>
                </>
            )}
        </div>
    );
};

export default StatsCard;
