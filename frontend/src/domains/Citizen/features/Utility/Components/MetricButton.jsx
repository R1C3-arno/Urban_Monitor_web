import { metricButtonColors } from '../constants/utilityConfig';

const MetricButton = ({ metric, selectedMetric, onClick, label }) => {
    return (
        <button
            onClick={() => onClick(metric)}
            style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                background: selectedMetric === metric ? metricButtonColors[metric] : '#333',
                color: '#fff',
                fontSize: '13px'
            }}
        >
            {label}
        </button>
    );
};

export default MetricButton;
