import { THEME } from '../constants/pharmacyConfig';
import {Star} from "lucide-react";

const StatsGrid = ({ stats }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            padding: '12px'
        }}>
            <div style={{ background: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: THEME.primary }}>{stats.total}</div>
                <div style={{ fontSize: '10px', color: '#888' }}>Total</div>
            </div>
            <div style={{ background: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: THEME.secondary }}>{stats.active}</div>
                <div style={{ fontSize: '10px', color: '#888' }}>Active</div>
            </div>
            <div style={{ background: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b',display: 'flex', gap:'12px' }}><Star />{stats.avgRating}</div>
                <div style={{ fontSize: '10px', color: '#888' }}>Avg Rating</div>
            </div>
        </div>
    );
};

export default StatsGrid;
