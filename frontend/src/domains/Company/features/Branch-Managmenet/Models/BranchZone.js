import { CIRCLE_CONFIG, BRANCH_COLORS } from "../Config/branchConfig.js";

export class BranchZone {
    constructor({ id, center, radius, level, opacity = CIRCLE_CONFIG.OPACITY }) {
        this._id = id;
        this._center = center;
        this._radius = radius;
        this._level = level;
        this._opacity = opacity;
        this._coords = this._generateCircleCoords();
        Object.freeze(this);
    }

    get id() { return this._id; }
    get center() { return this._center; }
    get radius() { return this._radius; }
    get level() { return this._level; }
    get coords() { return this._coords; }
    get opacity() { return this._opacity; }
    get color() { return BRANCH_COLORS[this._level] || "#3B82F6"; }

    _generateCircleCoords() {
        const coords = [];
        const segments = CIRCLE_CONFIG.SEGMENTS;
        const [lng, lat] = this._center;
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * 2 * Math.PI;
            const dx = (this._radius / 111320) * Math.cos(angle);
            const dy = (this._radius / 110540) * Math.sin(angle);
            coords.push([lng + dx, lat + dy]);
        }
        
        return coords;
    }

    toJSON() {
        return {
            id: this._id,
            center: this._center,
            radius: this._radius,
            level: this._level,
            coords: this._coords,
            color: this.color,
            opacity: this._opacity,
        };
    }

    static fromBranch(branch, radiusByLevel = CIRCLE_CONFIG.RADIUS_BY_LEVEL) {
        const radius = radiusByLevel[branch.performanceLevel] || 200;
        return new BranchZone({
            id: `zone-${branch.id}`,
            center: branch.coords,
            radius,
            level: branch.performanceLevel,
        });
    }
}
