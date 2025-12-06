import { createRoot } from "react-dom/client";

import CarIcon from "./icons/CarIcon.jsx";
import BikeIcon from "./icons/BikeIcon.jsx";
import AccidentIcon from "./icons/AccidentIcon.jsx";
import JamIcon from "./icons/JamIcon.jsx";
import SlowIcon from "./icons/SlowIcon.jsx";
import FastIcon from "./icons/FastIcon.jsx";

const ICON_MAP = {
    CAR: CarIcon,
    BIKE: BikeIcon,
    ACCIDENT: AccidentIcon,
    JAM: JamIcon,
    SLOW: SlowIcon,
    FAST: FastIcon,
};

export const createTrafficMarkerElement = (type, level) => {
    const el = document.createElement("div");
    const root = createRoot(el);

    const IconComponent = ICON_MAP[type] || CarIcon;

    root.render(<IconComponent level={level} />);

    return el;
};
