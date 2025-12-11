import { TRAFFIC_LEVEL_COLORS } from "../../../../../../../shared/Constants/color.js";

/**
 * BikeIcon - Motorcycle/bike incident indicator
 */
const BikeIcon = ({ level }) => {
    const color = TRAFFIC_LEVEL_COLORS[level] || "#10B981";

    return (
        <div className="traffic-icon traffic-icon-bike" style={{ background: color }}>
            🏍️
        </div>
    );
};

export default BikeIcon;