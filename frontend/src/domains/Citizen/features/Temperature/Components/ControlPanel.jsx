import LegendItem from './LegendItem.jsx';
import StatsInfo from './StatsInfo.jsx';

const ControlPanel = ({ stats, legendData }) => {
    return (
        <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(20,20,20,0.95)', padding: '20px', borderRadius: '12px', color: '#fff', fontFamily: 'system-ui', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', maxWidth: '300px', zIndex: 1 }}>
            <h2 style={{ margin: '0 0 15px', fontSize: '18px' }}> 🌫️ Air Quality Index </h2>

            {Object.entries(legendData).map(([level, count]) => (
                <LegendItem key={level} level={level} count={count} />
            ))}

            <StatsInfo stats={stats} />
        </div>
    );
};

export default ControlPanel;
