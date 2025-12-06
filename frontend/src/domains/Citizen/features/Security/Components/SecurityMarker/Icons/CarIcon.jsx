import { TRAFFIC_LEVEL_COLORS} from "../../../../../../../shared/Constants/color.js";

const CarIcon = ({ level }) => {
    const color = TRAFFIC_LEVEL_COLORS[level] || "#3B82F6";

    return (
        <div className="traffic-icon-car" style={{ background: color }}>
            🚗
        </div>
    );
};

export default CarIcon;
