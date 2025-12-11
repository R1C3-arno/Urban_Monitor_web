/**
 * BranchPopUp.jsx - With Custom Color Palette & Rounded Corners
 *
 * Tận dụng:
 * ✅ Custom color palette
 * ✅ Rounded corners
 * ✅ Non-solid backgrounds
 * ✅ UI Shared Components
 */

import React, { useState, useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import ReactDOMServer from "react-dom/server";
import './BranchPopUp.css';

// ============================================
// IMPORT UI SHARED COMPONENTS
// ============================================
import PopupFrame from "@/shared/Components/UI/PopUpFrame/PopUpFrame.jsx";
import Card from "@/shared/Components/UI/Card/Card.jsx";

// ============================================
// COLOR PALETTE
// ============================================
const COLORS = {
    primary: '#9CC6DB',
    secondary: '#FCF6D9',
    success: '#ED985F',
    error: '#C1785A',
    warning: '#E3E3E3',
};

// ============================================
// HELPER FUNCTION - Format Currency
// ============================================
const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);
};

// ============================================
// COMPONENT: InfoRow
// Reusable row component với color scheme
// ============================================
const InfoRow = ({ label, value, highlight = false }) => (
    <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: `1px solid ${COLORS.warning}20`,
        fontSize: "13px",
    }}>
        <span style={{
            fontWeight: "600",
            color: COLORS.secondary,
        }}>
            {label}
        </span>
        <span style={{
            color: highlight ? COLORS.success : COLORS.primary,
            fontWeight: highlight ? "700" : "500",
        }}>
            {value}
        </span>
    </div>
);

// ============================================
// COMPONENT: BranchInfoSection
// Hiển thị thông tin chi nhánh
// ============================================
const BranchInfoSection = ({ branch }) => {
    const profitValue = Number(branch.monthlyProfit ?? 0);

    return (
        <div style={{
            background: `${COLORS.primary}08`, // Non-solid primary
            padding: "12px",
            borderRadius: "12px", // Bo tròn
            border: `1px solid ${COLORS.primary}20`,
            marginBottom: "12px",
        }}>
            <h4 style={{
                margin: "0 0 10px 0",
                fontSize: "13px",
                fontWeight: "700",
                color: COLORS.primary,
            }}>
                Thông tin chi nhánh
            </h4>

            <div style={{ marginTop: "-4px" }}>
                <InfoRow label="Loại" value={branch.branchType || "RETAIL"} />
                <InfoRow label="Quản lý" value={branch.manager ?? "N/A"} />
                <InfoRow label="Nhân viên" value={`${Number(branch.employeeCount ?? 0)} người`} />
                <InfoRow label="Tồn kho" value={Number(branch.currentStock ?? 0)} />
                <InfoRow label="Nhu cầu" value={Number(branch.demand ?? 0)} />
                <InfoRow label="Doanh thu" value={formatCurrency(Number(branch.monthlyRevenue ?? 0))} />
                <InfoRow label="Chi phí" value={formatCurrency(Number(branch.monthlyExpense ?? 0))} />
                <InfoRow
                    label="Lợi nhuận"
                    value={formatCurrency(profitValue)}
                    highlight={true}
                />
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    fontSize: "13px",
                }}>
                    <span style={{ fontWeight: "600", color: COLORS.secondary }}>Địa chỉ</span>
                    <span style={{ color: COLORS.primary, textAlign: "right" }}>{branch.address || "N/A"}</span>
                </div>
            </div>
        </div>
    );
};

// ============================================
// COMPONENT: OptimizationSection (Method2)
// ============================================
const OptimizationSection = ({ optimization }) => {
    if (!optimization) return null;

    return (
        <div style={{
            background: `${COLORS.secondary}08`, // Non-solid secondary
            padding: "12px",
            borderRadius: "12px", // Bo tròn
            border: `1px solid ${COLORS.secondary}20`,
            marginBottom: "12px",
        }}>
            <h4 style={{
                margin: "0 0 10px 0",
                fontSize: "13px",
                fontWeight: "700",
                color: COLORS.secondary,
            }}>
                📊 Tối ưu hoá vận hành (Method2)
            </h4>

            <div style={{ marginTop: "-4px" }}>
                <InfoRow label="Chiến lược" value={optimization.strategy || "N/A"} />
                <InfoRow label="Lợi nhuận dự đoán" value={formatCurrency(optimization.expectedProfit || 0)} />
                <InfoRow label="Nhu cầu dự báo" value={Number(optimization.predictedDemand || 0)} />
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    fontSize: "13px",
                }}>
                    <span style={{ fontWeight: "600", color: COLORS.secondary }}>Điểm hiệu quả</span>
                    <span style={{ color: COLORS.primary }}>{Number(optimization.performanceScore || 0)}/100</span>
                </div>
            </div>
        </div>
    );
};

// ============================================
// COMPONENT: Method1Section
// ============================================
const Method1Section = ({ method1Data }) => {
    if (!method1Data) return null;

    return (
        <div style={{
            background: `${COLORS.success}15`, // Non-solid success
            padding: "12px",
            borderRadius: "12px", // Bo tròn
            border: `2px solid ${COLORS.success}40`,
            marginBottom: "12px",
        }}>
            <h4 style={{
                margin: "0 0 10px 0",
                fontSize: "13px",
                fontWeight: "700",
                color: COLORS.success,
            }}>
                 Method1 Optimization (Supply Chain)
            </h4>

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: `1px solid ${COLORS.success}30`,
                fontSize: "12px",
            }}>
                <span style={{ fontWeight: "600", color: COLORS.success }}>Total Cost</span>
                <span style={{ fontWeight: "700", color: COLORS.success }}>{method1Data.tc.toFixed(2)}</span>
            </div>

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: `1px solid ${COLORS.success}30`,
                fontSize: "12px",
            }}>
                <span style={{ fontWeight: "600", color: COLORS.success }}>Lot Size (Q)</span>
                <span style={{ color: COLORS.success }}>{method1Data.q.toFixed(2)}</span>
            </div>

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: `1px solid ${COLORS.success}30`,
                fontSize: "12px",
            }}>
                <span style={{ fontWeight: "600", color: COLORS.success }}>Production (P)</span>
                <span style={{ color: COLORS.success }}>{method1Data.p.toFixed(2)}</span>
            </div>

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                fontSize: "12px",
            }}>
                <span style={{ fontWeight: "600", color: COLORS.success }}>Safety Factor (K1)</span>
                <span style={{ color: COLORS.success }}>{method1Data.k1.toFixed(4)}</span>
            </div>
        </div>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================

const BranchPopUp = ({ map, branch, onClose }) => {
    const popupRef = useRef(null);
    const [method1Data, setMethod1Data] = useState(null);

    // ============================================
    // EFFECT 1: Fetch Method1 data
    // ============================================
    useEffect(() => {
        if (!branch?.id) return;

        const fetchData = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/company/method1/branches/${branch.id}/latest`
                );
                const data = await res.json();
                setMethod1Data(data);
                console.log(" Method1 data:", data);
            } catch (e) {
                console.error("Log Error: Failed to load method1 data:", e);
            }
        };

        fetchData();
    }, [branch]);

    // ============================================
    // EFFECT 2: Create popup with React components
    // ============================================
    useEffect(() => {
        if (!map || !branch) {
            console.warn("Log Warning: Missing map or branch");
            return;
        }

        const lng = branch.longitude;
        const lat = branch.latitude;

        if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
            console.warn("Log Warning Invalid coordinates:", { lat, lng });
            return;
        }

        console.log("Log: Opening popup at:", [lng, lat]);

        try {
            // ============================================
            // BUILD POPUP CONTENT USING REACT COMPONENTS
            // ============================================

            // Create React component for popup content
            const PopupContent = () => (
                <div style={{
                    maxWidth: "420px",
                    maxHeight: "500px",
                    overflowY: "auto",
                    paddingRight: "6px",
                    fontSize: "13px",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    background: "none",
                    color:"none",
                    padding: "12px",
                    borderRadius: "14px", // Bo tròn
                }}>

                    {/* HEADER */}
                    <div style={{
                        marginBottom: "12px",
                        paddingBottom: "10px",
                        borderBottom: `2px solid ${COLORS.primary}30`,
                    }}>
                        <h3 style={{
                            margin: "0 0 6px 0",
                            fontSize: "16px",
                            fontWeight: "700",
                            color: COLORS.primary,
                        }}>
                            {branch.branchName || branch.name || "Unknown"}
                        </h3>
                        <span style={{
                            display: "inline-block",
                            background: COLORS.success,
                            color: "white",
                            padding: "4px 10px",
                            borderRadius: "6px", // Bo tròn
                            fontSize: "11px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                        }}>
                            {branch.performanceLevel || "AVERAGE"}
                        </span>
                    </div>

                    {/* BRANCH IMAGE */}
                    {branch.image && (
                        <img
                            src={branch.image}
                            alt={branch.branchName}
                            style={{
                                width: "100%",
                                height: "160px",
                                objectFit: "cover",
                                borderRadius: "10px", // Bo tròn
                                marginBottom: "12px",
                                border: `1px solid ${COLORS.primary}20`,
                            }}
                        />
                    )}

                    {/* BRANCH INFO SECTION */}
                    <BranchInfoSection branch={branch} />

                    {/* METHOD2 OPTIMIZATION SECTION */}
                    {branch.optimization && (
                        <OptimizationSection optimization={branch.optimization} />
                    )}

                    {/* METHOD1 OPTIMIZATION SECTION */}
                    {method1Data && <Method1Section method1Data={method1Data} />}
                </div>
            );

            // ============================================
            // CONVERT REACT COMPONENT TO HTML STRING
            // ============================================

            // Render React component to HTML string
            const htmlContent = ReactDOMServer.renderToString(<PopupContent />);

            // ============================================
            // CREATE MAPTILER POPUP
            // ============================================

            const popup = new maptilersdk.Popup({
                closeButton: true,
                closeOnClick: false,
                offset: [0, -15],
            })
                .setLngLat([lng, lat])
                .setHTML(htmlContent)
                .addTo(map);

            popup.on("close", () => {
                console.log("🔍 Popup closed");
                if (onClose) onClose();
            });

            popupRef.current = popup;

            return () => {
                if (popupRef.current) {
                    popupRef.current.remove();
                }
            };
        } catch (error) {
            console.error("❌ Error creating popup:", error);
        }
    }, [map, branch, onClose]);

    return null;
};

export default BranchPopUp;