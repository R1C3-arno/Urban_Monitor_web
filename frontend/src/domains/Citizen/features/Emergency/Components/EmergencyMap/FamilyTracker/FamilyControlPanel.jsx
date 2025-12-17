import MemberListItem from './MemberListItem';
import {Users} from "lucide-react";

const FamilyControlPanel = ({ familyMembers, selectedMember, onMemberClick }) => {
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
            maxHeight: 'calc(100vh - 60px)',
            overflow: 'auto',
            zIndex: 1
        }}>
            <h2 style={{ margin: '0 0 15px', fontSize: '18px', color: '#3498db' }}>
                <Users />
                Family Tracker
            </h2>

            <div style={{
                background: 'rgba(52,152,219,0.2)',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '15px',
                border: '1px solid #3498db'
            }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3498db' }}>
                    {familyMembers.length}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                    Family Members Online
                </div>
            </div>

            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                <b>Members:</b>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {familyMembers.map((member, idx) => (
                    <MemberListItem
                        key={member.id || idx}
                        member={member}
                        index={idx}
                        isSelected={selectedMember?.id === member.id}
                        onClick={onMemberClick}
                    />
                ))}
            </div>

            <div style={{
                marginTop: '15px',
                padding: '10px',
                background: 'rgba(46,204,113,0.1)',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#2ecc71',
                textAlign: 'center'
            }}>
                🟢 All members are safe
            </div>
        </div>
    );
};

export default FamilyControlPanel;
