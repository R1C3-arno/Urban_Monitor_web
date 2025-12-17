import { memberColors} from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/FamilyTracker/constants/familyConfig.js";

const MemberListItem = ({ member, index, isSelected, onClick }) => {
    return (
        <div
            onClick={() => onClick(member)}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                background: isSelected
                    ? 'rgba(52,152,219,0.3)' 
                    : 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                cursor: 'pointer',
                border: isSelected
                    ? '1px solid #3498db' 
                    : '1px solid transparent',
                transition: 'all 0.2s'
            }}
        >
            <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: memberColors[index % memberColors.length],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white'
            }}>
                {member.name?.charAt(0) || '?'}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
                    {member.name}
                </div>
                <div style={{ fontSize: '11px', color: '#888' }}>
                    {member.description}
                </div>
            </div>
            <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#2ecc71'
            }} />
        </div>
    );
};

export default MemberListItem;
