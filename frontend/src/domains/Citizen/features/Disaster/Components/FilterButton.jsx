const FilterButton = ({ type, config, isActive, onClick }) => {
    return (
        <button
            onClick={() => onClick(type.toLowerCase())}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                borderRadius: '6px',
                border: `2px solid ${config.color}`,
                background: isActive
                    ? config.color
                    : 'transparent',
                color: isActive
                    ? '#fff'
                    : config.color,
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
            }}
        >
            <span>{config.icon}</span>
            <span>{config.label}</span>
        </button>
    );
};

export default FilterButton;
