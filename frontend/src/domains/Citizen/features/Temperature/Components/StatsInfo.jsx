const StatsInfo = ({ stats }) => {
    return (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #333', fontSize: '13px', color: '#ccc' }}>
            <div><b>{stats.total}</b> trạm hoạt động</div>
            <div>AQI trung bình: <b>{stats.avgAqi}</b></div>
            <div>Ô nhiễm nhất: <b>{stats.worst}</b></div>
        </div>
    );
};

export default StatsInfo;
