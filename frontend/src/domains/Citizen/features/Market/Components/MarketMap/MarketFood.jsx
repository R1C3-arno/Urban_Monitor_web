import { useRef } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Sidebar } from '../MarketFood/components/index.js';
import useFoodMap from '../MarketFood/hooks/useFoodMap.js';
import './MarketFood.css';
const MarketFood = () => {
    const mapContainer = useRef(null);
    const {
        visibleStores,
        selectedStore,
        showSearchButton,
        stats,
        updateVisibleStores,
        flyToStore
    } = useFoodMap(mapContainer);

    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
            {/* Sidebar */}
            <Sidebar
                stats={stats}
                visibleStores={visibleStores}
                selectedStore={selectedStore}
                showSearchButton={showSearchButton}
                onSearchClick={updateVisibleStores}
                onStoreClick={flyToStore}
            />

            {/* Map */}
            <main style={{ flex: 1, position: 'relative' }}>
                <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
            </main>
        </div>
    );
};

export default MarketFood;
