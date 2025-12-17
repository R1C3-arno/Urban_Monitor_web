const LegendList = ({ legend }) => {
    if (!legend || !legend.levels) return null;

    return (
        <div>
            {legend.levels.map(item => (
                <div key={item.level} style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                    fontSize: '14px'
                }}>
                    <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        marginRight: '10px',
                        background: item.color,
                        boxShadow: '0 0 8px rgba(0,0,0,0.3)'
                    }} />
                    <span>{item.level} ({item.count})</span>
                </div>
            ))}
        </div>
    );
};

export default LegendList;
