// Lo cái khung gắn với vị trí GPS
import "./PopUp.css";
import { useEffect, useState } from "react"

/**
 * Khugn thuần
 *
 */
const MapPopUp = ({ map, coords, children, onClose }) => {
    const [pixel, setPixel] = useState([0, 0]);

    useEffect(() => {
        if (!map || !coords) return;
        console.log("[MapPopUp] project coords:", coords);
        const p = map.project(coords);
        console.log("[MapPopUp] pixel:", p);
        setPixel([p.x, p.y]);

        const updatePixel = () => {
            const p = map.project(coords);
            setPixel([p.x, p.y]);
        };

        updatePixel();
        map.on("move", updatePixel);
        map.on("zoom", updatePixel);

        return () => {
            map.off("move", updatePixel);
            map.off("zoom", updatePixel);
        };
    }, [map, coords]);

    if (!coords) return null;

    return (
        <div
            className="map-popup-wrapper"
            style={{
                left: pixel[0],
                top: pixel[1],
            }}
        >
            <div className="map-popup-inner">
                <button className="popup-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default MapPopUp;