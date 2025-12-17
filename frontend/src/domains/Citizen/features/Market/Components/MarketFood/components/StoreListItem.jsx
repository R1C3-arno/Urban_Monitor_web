import { DEFAULT_ICON, THEME } from '../constants/foodConfig';
import {Star,MapPinHouse,Clock} from "lucide-react";

const StoreListItem = ({ store, isSelected, onClick }) => {
    return (
        <div
            onClick={() => onClick(store)}
            style={{
                background: isSelected ? THEME.primaryLight : 'white',
                border: isSelected ? `2px solid ${THEME.primary}` : `1px solid ${THEME.selectedBorder}`,
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
            }}
        >
            {/* Store image */}
            <img
                src={store.imageUrl || DEFAULT_ICON}
                onError={(e) => { e.target.src = DEFAULT_ICON; }}
                alt={store.storeName}
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${THEME.primary}`
                }}
            />
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>
                        {store.storeName}
                    </h4>
                    <span style={{
                        background: store.licenseStatus === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                        color: store.licenseStatus === 'ACTIVE' ? '#16a34a' : '#dc2626',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                    }}>
                        {store.licenseStatus}
                    </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748b' }}>
                    <MapPinHouse />
                    {store.address}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#888' }}>
                    <span><Star /> {store.rating}</span>
                    <span><Clock />{store.openingHours}</span>
                </div>
            </div>
        </div>
    );
};

export default StoreListItem;
