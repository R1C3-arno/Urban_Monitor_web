import MetricButton from './MetricButton';

const ControlPanel = ({ selectedMetric, onMetricChange }) => {
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(20, 20, 20, 0.95)',
            padding: '15px',
            borderRadius: '12px',
            color: '#fff',
            fontFamily: 'system-ui',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            zIndex: 1
        }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#888' }}>
                Display by
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
                <MetricButton
                    metric="water"
                    selectedMetric={selectedMetric}
                    onClick={onMetricChange}
                    label="Water"
                />
                <MetricButton
                    metric="electricity"
                    selectedMetric={selectedMetric}
                    onClick={onMetricChange}
                    label="Electricity"
                />
                <MetricButton
                    metric="wifi"
                    selectedMetric={selectedMetric}
                    onClick={onMetricChange}
                    label="Wifi"
                />
            </div>
        </div>
    );
};

export default ControlPanel;
