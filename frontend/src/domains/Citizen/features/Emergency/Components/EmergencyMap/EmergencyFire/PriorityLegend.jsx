import { priorityColors} from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/EmergencyFire/constants/fireConfig.js";

const PriorityLegend = () => {
    return (
        <div style={{
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid #333',
            fontSize: '12px'
        }}>
            <div style={{ marginBottom: '8px', color: '#888' }}><b>Priority Legend:</b></div>
            {Object.entries(priorityColors).map(([level, color]) => (
                <div key={level} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{
                        width: '12px', height: '12px',
                        borderRadius: '50%',
                        background: color,
                        marginRight: '8px'
                    }} />
                    <span style={{ color: '#ccc' }}>{level}</span>
                </div>
            ))}
        </div>
    );
};

export default PriorityLegend;
