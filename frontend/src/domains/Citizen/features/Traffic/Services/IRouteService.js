// Domain/Services/IRouteService.js
export class IRouteService {
    async findRoute(startId, endId, algorithm) {
        throw new Error('Must implement');
    }
}

// Data/Repositories/RouteRepository.js
export class RouteRepository extends IRouteService {
    constructor(dsaService) {
        super();
        this._dataSource = dsaService;
    }

    async findRoute(startId, endId, algorithm) {
        const rawData = await this._dataSource.findRoute(startId, endId, algorithm);
        return routeMapper.toDomain(rawData);
    }
}

// ✅ Benefits:
// - UI doesn't know about API details
// - Easy to swap data sources (API → Mock)
// - Testable in isolation