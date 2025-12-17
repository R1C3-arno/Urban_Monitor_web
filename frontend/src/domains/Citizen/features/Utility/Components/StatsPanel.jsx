import StatsCard from './StatsCard';
import ClusterLegend from './ClusterLegend';

const StatsPanel = ({ stats }) => {
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(20, 20, 20, 0.95)',
            padding: '20px',
            borderRadius: '12px',
            color: '#fff',
            fontFamily: 'system-ui',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            maxWidth: '280px',
            zIndex: 1
        }}>
            <h2 style={{ margin: '0 0 15px', fontSize: '18px' }}>
                Utility Monitor
            </h2>

            <div style={{ display: 'grid', gap: '12px' }}>
                <StatsCard
                    value={stats.totalStations}
                    label="Active Stations"
                />

                <StatsCard
                    value={`${stats.avgWater} m³`}
                    label="Avg Water/Station"
                    gradient="linear-gradient(135deg, rgba(0,180,216,0.3), rgba(0,119,182,0.3))"
                    labelColor="#00b4d8"
                />

                <StatsCard
                    value={`${stats.avgElectricity} kWh`}
                    label="Avg Electricity/Station"
                    gradient="linear-gradient(135deg, rgba(255,149,0,0.3), rgba(255,107,0,0.3))"
                    labelColor="#ff9500"
                />

                <StatsCard
                    value={`${stats.avgPing} ms`}
                    label="Avg Ping"
                    gradient="linear-gradient(135deg, rgba(0,228,0,0.3), rgba(124,252,0,0.3))"
                    labelColor="#00e400"
                />
            </div>

            {/* Legend */}
            <ClusterLegend />
        </div>
    );
};

export default StatsPanel;
