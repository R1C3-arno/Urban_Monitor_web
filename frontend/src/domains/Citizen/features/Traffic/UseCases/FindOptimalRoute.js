// Domain/UseCases/FindOptimalRoute.js
export class FindOptimalRoute {
    constructor(routeRepository) {
        this._repository = routeRepository;
    }

    async execute(start, end, algorithm = 'dijkstra') {
        // Validate inputs
        if (!start || !end) throw new Error('Invalid nodes');

        // Delegate to repository
        const route = await this._repository.findRoute(start, end, algorithm);

        // Business logic (if any)
        if (!route.isValid()) {
            throw new Error('No valid route found');
        }

        return route;
    }
}

// ✅ Benefits:
// - Algorithm choice decoupled from UI
// - Easy to add new algorithms
// - Follows Open/Closed Principle