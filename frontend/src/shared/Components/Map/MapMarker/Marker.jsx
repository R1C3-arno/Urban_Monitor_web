import { useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";

const BaseMarker = ({
                        map,
                        coords,
                        color = "#3B82F6",
                        popup,
                        element,
                        onClick = () => {}
                    }) => {
    useEffect(() => {
        if (!map || !coords) return;

        // tạo marker (nếu element là một factory function, gọi nó)
        const markerOpts = element ? { element } : { color };
        const marker = new maptilersdk.Marker(markerOpts).setLngLat(coords);

        // addTo trước rồi mới query element
        marker.addTo(map);

        // lấy element sau khi add
        const el = marker.getElement();
        if (!el) {
            console.warn("[BaseMarker] marker.getElement() returned falsy for coords:", coords);
        } else {
            // style giúp nhận biết cliable
            el.style.cursor = "pointer";

            // debug
            console.log("[BaseMarker] attached marker element for", coords, "el:", el);

            // attach listener
            const handler = (ev) => {
                // optionally stop propagation so map click doesn't immediately close popup
                if (ev && ev.stopPropagation) ev.stopPropagation();
                try {
                    onClick();
                } catch (err) {
                    console.error("[BaseMarker] onClick handler error:", err);
                }
            };
            el.addEventListener("click", handler);

            // cleanup removes listener
            const cleanup = () => {
                try {
                    el.removeEventListener("click", handler);
                } catch (e) {}
            };

            // also remove marker on cleanup
            return () => {
                cleanup();
                marker.remove();
            };
        }

        // fallback cleanup if el missing (still remove marker)
        return () => {
            try { marker.remove(); } catch (e) {}
        };
    }, [map, coords, color, element, onClick]);

    return null;
};

export default BaseMarker;
