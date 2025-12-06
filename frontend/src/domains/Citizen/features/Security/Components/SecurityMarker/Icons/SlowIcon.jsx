import { TRAFFIC_LEVEL_COLORS} from "../../../../../../../shared/Constants/color.js";

const SlowIcon = ({ level }) => {
    const color = TRAFFIC_LEVEL_COLORS[level] || "#3B82F6";

    return (
        <div className="traffic-icon-slow" style={{ background: color }}>
            slow
        </div>
    );
};

export default SlowIcon;
