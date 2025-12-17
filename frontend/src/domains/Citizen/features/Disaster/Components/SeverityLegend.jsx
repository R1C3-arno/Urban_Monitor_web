import { severityColors } from '../Constants/disasterConfig.jsx';

const SeverityLegend = () => {
    return (
        <div style={{
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid #333',
            fontSize: '11px'
        }}>
            <div style={{ marginBottom: '6px', color: '#888' }}><b>Severity:</b></div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {Object.entries(severityColors).map(([level, color]) => (
                    <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }} />
                        <span style={{ color: '#999', fontSize: '10px' }}>{level}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeverityLegend;
