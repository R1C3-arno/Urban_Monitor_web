const StatsInfo = ({ stats }) => {
    if (!stats) return null;

    return (
        <div style={{
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid #e5e7eb',
            fontSize: '13px',
            color: '#6b7280'
        }}>
            <div style={{ color: '#2F2F2F', fontSize: '14px' }}>
                <div style={{ marginBottom: '6px' }}>
                    <strong style={{ color: '#A6D6D6' }}>{stats.total}</strong>{' '}
                    <span style={{ color: '#8D0B41' }}>TOTAL ACCIDENTS</span>
                </div>

                <div style={{ marginBottom: '6px' }}>
                    <strong style={{ color: '#EA5B6F' }}>{stats.highPriority}</strong>{' '}
                    <span style={{ color: '#EBF4DD' }}>HIGH PRIORITY</span>
                </div>

                <div>
                    <span style={{ color: '#FFBBE1' }}>MOST COMMON:</span>{' '}
                    <strong style={{ color: '#456882' }}>
                        {stats.topType} ({stats.topTypeCount})
                    </strong>
                </div>
            </div>

        </div>
    );
};

export default StatsInfo;
