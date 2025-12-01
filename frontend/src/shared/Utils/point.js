// tọa đổ
export const createPoint = (x, y) => ({ x, y });
//check
export const isValidPoint = (point) => {
    return point && typeof point.x === 'number' && typeof point.y === 'number';
};