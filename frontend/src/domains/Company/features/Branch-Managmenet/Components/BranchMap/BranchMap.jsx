import React, { useState,useCallback } from "react";
import Map from "@/shared/Components/Map/BaseMap/Map.jsx";
import BranchMarker from "../BranchMarker/BranchMarker.jsx";
import BranchCircle from "../BranchCircle/BranchCircle.jsx";
import BranchPopUp from "../BranchPopUp/BranchPopUp.jsx";
import { useBranchData } from "../../Hooks/useBranchData.js";
import { BRANCH_MAP_CONFIG } from "../../Config/branchConfig.js";
import "./BranchMap.css";
import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error(" Error Boundary caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div style={{ color: "red" }}>Error: {this.state.error?.message}</div>;
        }
        return this.props.children;
    }
}

const BranchMap = () => {
    const [map, setMap] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);

    const handleBranchClick = useCallback((branch) => {
        setSelectedBranch(branch);
    }, []);

    const { markers, circles, loading, error } = useBranchData({
        useMock: false,  // ← Dùng API
        autoFetch: true,
        onBranchClick: handleBranchClick,  // ← Pass callback
    });



    if (loading) {
        return (
            <div className="branch-map-loading">
                <p>Đang tải dữ liệu chi nhánh...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="branch-map-error">
                <p> {error}</p>
            </div>
        );
    }

    return (
        <div className="branch-map">
            <Map
                center={BRANCH_MAP_CONFIG.DEFAULT_CENTER}
                zoom={BRANCH_MAP_CONFIG.DEFAULT_ZOOM}
                getMap={setMap}
                height="700px"
            />

            {map && (
                <>
                    <BranchCircle map={map} data={circles} />
                    <BranchMarker map={map} data={markers} />
                    {selectedBranch && (
                        <BranchPopUp
                            map={map}
                            branch={selectedBranch}
                            onClose={() => setSelectedBranch(null)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default BranchMap;
