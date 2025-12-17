import { levelColors, levelLabels } from './constants/airQualityConfig.js';

const LegendItem = ({ level, count }) => {
    if (count <= 0) return null;

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '13px' }}>
            <div style={{ width: '20px', height: '14px', marginRight: '10px', background: levelColors[level], border: '1px solid #333' }} />
            <span>{levelLabels[level]} ({count})</span>
        </div>
    );
};

export default LegendItem;
