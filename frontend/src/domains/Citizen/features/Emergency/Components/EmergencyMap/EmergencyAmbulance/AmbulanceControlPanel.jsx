import PriorityLegend from './PriorityLegend';
import {Ambulance} from "lucide-react";

const AmbulanceControlPanel = ({ stats }) => {
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
            <h2 style={{ margin: '0 0 15px', fontSize: '18px', color: '#ff4444' }}>
                <Ambulance />
                Emergency Ambulance
            </h2>

            <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{
                    background: 'rgba(255,68,68,0.2)',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid #ff4444'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff4444' }}>
                        {stats.total}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        Active Emergencies
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(255,0,0,0.3), rgba(200,0,0,0.3))',
                        padding: '10px',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats.critical}</div>
                        <div style={{ fontSize: '11px', color: '#ff6666' }}>Critical</div>
                    </div>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(0,200,0,0.3), rgba(0,150,0,0.3))',
                        padding: '10px',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats.responding}</div>
                        <div style={{ fontSize: '11px', color: '#66ff66' }}>Responding</div>
                    </div>
                </div>
            </div>

            <PriorityLegend />
        </div>
    );
};

export default AmbulanceControlPanel;
