import LegendList from './LegendList';
import StatsInfo from './StatsInfo';
import {TrafficCone} from "lucide-react";

const IncidentPanel = ({stats, legend, loading}) => {
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: `linear-gradient(
      to bottom,
      #D34E4E 0%,
      #D34E4E 20%,

      #F9E8B5 30%,
      #F9E8B5 55%,

      #E1C97C 60%,
      #E1C97C 75%,

      #D3875F 80%,
      #D3875F 100%
    )`,
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            maxWidth: '300px',
            zIndex: 1
        }}>

            <h2 style={{margin: '0 0 15px', fontSize: '18px', color: '#1f2937'}}>
                <TrafficCone/>
                Traffic Incidents
            </h2>

            {loading ? (
                <div style={{textAlign: 'center', padding: '20px', color: '#6b7280'}}>
                    Loading...
                </div>
            ) : (
                <>
                    {/* Legend from backend */}
                    <LegendList legend={legend}/>

                    {/* Stats from backend */}
                    <StatsInfo stats={stats}/>
                </>
            )}
        </div>
    );
};

export default IncidentPanel;
