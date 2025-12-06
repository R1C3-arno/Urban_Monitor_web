export const ensureRingClosed = (coords) => {
    if (!Array.isArray(coords) || coords.length < 3) return null;

    const first = coords[0];
    const last = coords[coords.length - 1];

    if (first[0] !== last[0] || first[1] !== last[1]) {
        return [...coords, first];
    }
    return coords;
};

export const normalizeCoords = (coords = []) => {
    if (!Array.isArray(coords)) return [];
    return coords.map(([a, b]) => {
        if (Math.abs(a) <= 90 && Math.abs(b) > 90) {
            return [b, a];
        }
        return [a, b];
    });
};
