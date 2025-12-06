

//hàm tính khoản cách 2 điểm
import {isValidPoint} from "./point.js";

export const calculateDistance = (point1, point2) => {
    if (!isValidPoint(point1) || !isValidPoint(point2)) {
        throw new Error("Points must have x and y as numbers");
    }
    return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) +
        Math.pow(point2.y - point1.y, 2)
    );
};