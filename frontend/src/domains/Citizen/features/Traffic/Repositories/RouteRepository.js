export class RouteRepository {
    constructor(dsaService, mapper) {
        this._dataSource = dsaService;
        this._mapper = mapper;
    }

    async findRoute(startId, endId, algorithm) {
        // 1. Call API
        const rawData = await this._dataSource.findRoute(startId, endId, algorithm);

        // 2. Transform to domain model
        const route = this._mapper.toDomain(rawData);

        // 3. Validate
        if (!route.isValid()) {
            throw new Error('Invalid route received');
        }

        return route;
    }
}