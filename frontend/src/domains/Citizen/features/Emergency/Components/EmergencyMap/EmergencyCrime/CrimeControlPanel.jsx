import { priorityColors} from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/EmergencyCrime/constants/crimeConfig.js";
import {Siren,Phone} from "lucide-react";

const CrimeControlPanel = ({ stats, crimeList }) => {
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
            maxWidth: '300px',
            zIndex: 1
        }}>
            <h2 style={{ margin: '0 0 15px', fontSize: '18px', color: '#ff0000' }}>
                <Siren />
                Crime Reports
            </h2>

            <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{
                    background: 'rgba(255,0,0,0.2)',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid #ff0000'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff0000' }}>
                        {stats.total}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        Active Cases
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(255,100,0,0.3), rgba(200,50,0,0.3))',
                        padding: '10px',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats.active}</div>
                        <div style={{ fontSize: '11px', color: '#ff9966' }}>Active</div>
                    </div>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(0,100,200,0.3), rgba(0,50,150,0.3))',
                        padding: '10px',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats.responding}</div>
                        <div style={{ fontSize: '11px', color: '#6699ff' }}>Police Responding</div>
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid #333'
            }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                    <b>Recent Reports:</b>
                </div>
                {crimeList.map((crime, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '6px',
                        marginBottom: '4px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '4px',
                        fontSize: '11px'
                    }}>
                        <div style={{
                            width: '8px', height: '8px',
                            borderRadius: '50%',
                            background: priorityColors[crime.priority],
                            marginRight: '8px'
                        }} />
                        <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {crime.name}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '12px',
                padding: '10px',
                background: 'rgba(255,0,0,0.1)',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#ff6666',
                textAlign: 'center'
            }}>
                <Phone />
                 Emergency: 113
            </div>
        </div>
    );
};

export default CrimeControlPanel;
