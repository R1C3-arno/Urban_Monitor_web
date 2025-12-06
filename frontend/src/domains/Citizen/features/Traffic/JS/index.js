//barrel export

/**
 * Traffic Feature - Barrel Exports
 * Centralized exports for easy importing
 * Usage: import { useTrafficData, TrafficIncident } from '@/features/Traffic'
 */

// ==================== COMPONENTS ====================
export { default as TrafficMap } from '../Components/TrafficMap/TrafficMap.jsx';
export { default as TrafficCircle } from '../Components/TrafficCircle/TrafficCircle.jsx';
export { default as GeolocationControl } from  '../../../../../shared/Components/Map/GeolocationControl/GeolocationControl.jsx'


// ==================== HOOKS ====================
export { useTrafficData } from '../Hooks/useTrafficData.js';

// ==================== MODELS ====================
export { TrafficIncident } from '../Models/TrafficIncident.js';
export { TrafficZone } from '../Models/TrafficZone.js';

// ==================== SERVICES ====================
export { ITrafficDataSource, createTrafficDataSource } from '../Services/ITrafficDataSource.js';
export { TrafficAPIService } from '../Services/TrafficAPIService.js';
export { TrafficMockService } from '../Services/TrafficMockService.js';

// ==================== MAPPERS ====================
export {
    mapToIncidents,
    mapToZones,
    filterByLevel,
    sortByPriority,
    groupByLevel,
} from '../Mappers/trafficDataMapper.js';

export {
    mapIncidentToMarker,
    mapIncidentsToMarkers,
    createUserLocationMarker,
} from '../Mappers/trafficMarkerMapper.js';

export {
    mapZoneToCircle,
    mapZonesToCircles,
    zonesToGeoJSON,
} from '../Mappers/trafficCircleMapper.js';

// ==================== CONFIG ====================
export {
    TRAFFIC_MAP_CONFIG,
    GEOLOCATION_CONFIG,
    CIRCLE_CONFIG,
    TRAFFIC_LEVELS,
    TRAFFIC_COLORS,
    TRAFFIC_IMAGES,
    TRAFFIC_API_CONFIG,
    MOCK_CONFIG,
    POPUP_CONFIG,
    VALIDATION_RULES,
    ERROR_MESSAGES,
} from '../Config/trafficConfig.js';