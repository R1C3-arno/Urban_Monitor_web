import { TRAFFIC_LEVEL_COLORS} from "../../../../../../../shared/Constants/color.js";

const TramIcon = ({ level }) => {
    const color = TRAFFIC_LEVEL_COLORS[level] || "#3B82F6";

    return (
        <div className="traffic-icon-tram" style={{ background: color }}>
            Tram
        </div>
    );
};

export default TramIcon;
