const StatsCard = ({ icon, label, labelColor, total, subValue, subLabel, bgColor, borderColor }) => {
    return (
        <div style={{
            background: bgColor,
            padding: '10px',
            borderRadius: '8px',
            borderLeft: `4px solid ${borderColor}`
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <span>{icon}</span>
                <span style={{ fontSize: '12px', color: labelColor }}>{label}</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{total}</div>
            <div style={{ fontSize: '10px', color: '#ff6666' }}>
                {subValue} {subLabel}
            </div>
        </div>
    );
};

export default StatsCard;
