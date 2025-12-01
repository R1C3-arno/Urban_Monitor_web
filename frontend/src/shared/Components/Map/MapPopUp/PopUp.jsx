import React, {useState,useRef,useEffect} from "react";
import Card from "../../UI/Card/Card.jsx";
import './PopUp.css';

const MapPopUp = ({ map, coords, title, children }) => {
    const [pixel, setPixel] = useState([0, 0]);
    const [open, setOpen] = useState(false);

    // Cập nhật pixel mỗi lần map di chuyển
    useEffect(() => {
        if (!map) return;

        const updatePixel = () => {
            const p = map.project(coords); // [x, y] pixel
            setPixel(p);
        };

        updatePixel();
        map.on('move', updatePixel);
        map.on('zoom', updatePixel);

        return () => {
            map.off('move', updatePixel);
            map.off('zoom', updatePixel);
        };
    }, [map, coords]);

    // Render marker click
    useEffect(() => {
        if (!map) return;

        const el = document.createElement('div');
        el.className = 'marker';
        el.addEventListener('click', () => setOpen(!open));

        const marker = new maptilersdk.Marker({ element: el })
            .setLngLat(coords)
            .addTo(map);

        return () => marker.remove();
    }, [map, coords, open]);

    if (!open) return null;

    return (
        <div
            className="marker-popup"
            style={{
                left: pixel[0],
                top: pixel[1],
                transform: 'translate(-50%, -100%)', // đặt phía trên marker
                position: 'absolute',
                pointerEvents: 'auto',
            }}
        >
            <Card title={title}>
                {children}
            </Card>
        </div>
    );
};
export default MapPopUp;