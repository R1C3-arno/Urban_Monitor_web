const ClusterLegend = () => {
    return (
        <div style={{
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid #333',
            fontSize: '12px',
            color: '#888'
        }}>
            <div style={{ marginBottom: '8px' }}>
                <b>Cluster Legend:</b>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{
                    width: '16px', height: '16px',
                    borderRadius: '50%',
                    background: '#51bbd6',
                    marginRight: '8px'
                }} />
                <span>&lt; 10 stations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{
                    width: '20px', height: '20px',
                    borderRadius: '50%',
                    background: '#f1f075',
                    marginRight: '8px'
                }} />
                <span>10 - 30 stations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                    width: '24px', height: '24px',
                    borderRadius: '50%',
                    background: '#f28cb1',
                    marginRight: '8px'
                }} />
                <span>&gt; 30 stations</span>
            </div>
        </div>
    );
};

export default ClusterLegend;
