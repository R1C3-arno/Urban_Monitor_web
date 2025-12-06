import { TRAFFIC_LEVEL_COLORS } from "../../../../../../shared/Constants/color.js";

/**
 * Tạo DOM element custom cho marker giao thông
 */
import {createTrafficMarkerElement} from "./trafficMarker.factory.jsx";

/**
 * Convert API → Marker data cho Map.jsx
 */
export const TrafficMarker = (apiData = [], onSelect = () => {}) => {
    if (!Array.isArray(apiData)) return [];
    return apiData.map(item => ({
        id: item.id,

        //maptiler lng lat
        coords: [item.lng, item.lat],

        // ✅ dùng element thay vì color mặc định
        element: createTrafficMarkerElement(item.type,item.level),

        onClick: () => onSelect(item),
    }));
};


/*
✅ BACKEND GIỮ NGUYÊN (KHÔNG CẦN SỬA)

Backend gửi đúng như bạn ghi là OK:

{
  "id": 1,
  "lat": 10.77,
  "lng": 106.69,
  "level": "HIGH"
}
 */