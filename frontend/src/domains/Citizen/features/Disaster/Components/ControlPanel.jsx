import {disasterConfig} from '../Constants/disasterConfig.jsx';
import FilterButton from './FilterButton';
import StatsCard from './StatsCard';
import SeverityLegend from './SeverityLegend';
import {ShieldUser,CloudRainWind, Waves,Earth,Flame,Tornado} from "lucide-react";

const ControlPanel = ({stats, activeFilters, onToggleFilter}) => {
    return (
        <div className="control-panel">


            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: `linear-gradient(
      to bottom,
      #213448 0%,
      #213448 25%,

      #547792 30%,
      #547792 50%,

      #94B4C1 60%,
      #94B4C1 75%,

      #EAE0CF 80%,
      #EAE0CF 100%
    )`,
                padding: '20px',
                borderRadius: '12px',
                color: '#fff',
                fontFamily: 'system-ui',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                maxWidth: '320px',
                zIndex: 1,
                border: '1px solid rgba(100,100,100,0.3)'
            }}>
                <h2 style={{margin: '0 0 15px', fontSize: '18px', color: '#fff'}}>
                    <CloudRainWind  />
                    Vietnam Disaster Monitor
                </h2>

                {/* Filter Toggles */}
                <div style={{marginBottom: '15px'}}>
                    <div style={{fontSize: '12px', color: '#888', marginBottom: '8px'}}>
                        <b>Filter by Type:</b>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
                        {Object.entries(disasterConfig).map(([type, config]) => (
                            <FilterButton
                                key={type}
                                type={type}
                                config={config}
                                isActive={activeFilters[type.toLowerCase()]}
                                onClick={onToggleFilter}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                    <StatsCard
                        icon=<Waves />
                        label="Flood"
                        labelColor="#66ccff"
                        total={stats.flood.total}
                        subValue={stats.flood.emergency}
                        subLabel="emergency"
                        bgColor="rgba(0,102,204,0.2)"
                        borderColor="#0066cc"
                    />

                    <StatsCard
                        icon=<Earth />
                        label="Earthquake"
                        labelColor="#ff6666"
                        total={stats.earthquake.total}
                        subValue={stats.earthquake.alert}
                        subLabel="alert"
                        bgColor="rgba(204,0,0,0.2)"
                        borderColor="#cc0000"
                    />

                    <StatsCard
                        icon=<Flame />
                        label="Heatwave"
                        labelColor="#ffcc66"
                        total={stats.heatwave.total}
                        subValue={stats.heatwave.extreme}
                        subLabel="extreme"
                        bgColor="rgba(255,102,0,0.2)"
                        borderColor="#ff6600"
                    />

                    <StatsCard
                        icon=<Tornado />
                        label="Storm"
                        labelColor="#cc99ff"
                        total={stats.storm.total}
                        subValue={stats.storm.emergency}
                        subLabel="emergency"
                        bgColor="rgba(153,102,255,0.2)"
                        borderColor="#9966ff"
                    />
                </div>

                {/* Legend */}
                <SeverityLegend/>

                <div style={{
                    marginTop: '12px',
                    padding: '10px',
                    background: 'rgba(100,100,100,0.1)',
                    borderRadius: '6px',
                    fontSize: '10px',
                    color: '#888'
                }}>
                    💡 Disaster zones now follow province boundaries. Click for details.
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;
