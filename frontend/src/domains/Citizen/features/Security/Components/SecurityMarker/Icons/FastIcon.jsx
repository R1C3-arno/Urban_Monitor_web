import { TRAFFIC_LEVEL_COLORS} from "../../../../../../../shared/Constants/color.js";

const FastIcon = ({ level }) => {
    const color = TRAFFIC_LEVEL_COLORS[level] || "#3B82F6";

    return (
        <div className="traffic-icon-fast" style={{ background: color }}>
            Fast
        </div>
    );
};

export default FastIcon;
