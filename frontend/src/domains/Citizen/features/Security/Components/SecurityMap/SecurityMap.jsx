import React, { useState } from "react";
import Map from "../../../../../../shared/Components/Map/BaseMap/Map.jsx";
import { SecurityMarker } from "../SecurityMarker/SecurityMarker.jsx";
import MapPopUp from "../../../../../../shared/Components/Map/MapPopUp/PopUp.jsx";
import SecurityPopup from "../SecurityPopup/SecurityPopup.jsx";
import { useSecurityData } from "../../Hooks/useSecurityData.js";
import ReportSecurity from "../ReportSecurity/ReportSecurity.jsx";

const SecurityMap = () => {
    const [map, setMap] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);

    const { markers, loading, error } = useSecurityData({
        useMock: true,
        autoFetch: true,
        onReportClick: (report) => setSelectedReport(report),
    });

    if (loading) return <div>Đang tải dữ liệu an ninh...</div>;
    if (error) return <div>❌ {error}</div>;

    return (
        <div className="security-map-container">
            <Map
                center={[10.77, 106.69]}
                zoom={13}
                markers={markers}
                getMap={setMap}
            />

            {/* ✅ POPUP */}
            {selectedReport && map && (
                <MapPopUp
                    map={map}
                    coords={[selectedReport.lng, selectedReport.lat]}
                    onClose={() => setSelectedReport(null)}
                >
                    <SecurityPopup data={selectedReport} />
                </MapPopUp>
            )}

            {/* ✅ REPORT BUTTON */}
            <ReportSecurity />
        </div>
    );
};

export default SecurityMap;
