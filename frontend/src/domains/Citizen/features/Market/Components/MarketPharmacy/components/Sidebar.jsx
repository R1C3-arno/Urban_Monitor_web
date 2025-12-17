import { THEME } from '../constants/pharmacyConfig';
import StatsGrid from './StatsGrid';
import SearchButton from './SearchButton';
import StoreListItem from './StoreListItem';
import {Pill} from "lucide-react";

const Sidebar = ({ stats, visibleStores, selectedStore, showSearchButton, onSearchClick, onStoreClick }) => {
    return (
        <aside style={{
            width: '350px',
            background: THEME.sidebarBg,
            borderRight: `1px solid ${THEME.sidebarBorder}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px',
                background: THEME.primary,
                color: 'white'
            }}>
                <h2 style={{ margin: 0, fontSize: '18px',display: 'flex', gap: '12px' }}><Pill /> Licensed Pharmacies</h2>
                <p style={{ margin: '8px 0 0', fontSize: '12px', opacity: 0.9 }}>
                    Government approved stores with tax compliance
                </p>
            </div>

            {/* Stats */}
            <StatsGrid stats={stats} />

            {/* Search in area button */}
            {showSearchButton && (
                <SearchButton onClick={onSearchClick} />
            )}

            {/* Store list */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 12px 12px'
            }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                    Showing {visibleStores.length} stores in view
                </div>
                {visibleStores.map((store) => (
                    <StoreListItem
                        key={store.id}
                        store={store}
                        isSelected={selectedStore?.id === store.id}
                        onClick={onStoreClick}
                    />
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
