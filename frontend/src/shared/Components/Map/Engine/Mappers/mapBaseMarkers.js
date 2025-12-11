/**
 * Generic marker mapper used by all features.
 * createElement(type, level, item) returns DOM element (or null to use color)
 */
export const mapBaseMarkers = (items = [], onClick = () => {}, createElement) => {
    if (!Array.isArray(items)) return [];

    return items.map(item => ({
        id: item.id,
        coords: item.coords,
        element: typeof createElement === "function" ? createElement(item.type, item.level, item) : undefined,
        // fallback color if createElement not provided
        color: item.color || undefined,
        onClick: () => onClick?.(item),
    }));
};
