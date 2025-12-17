import React from 'react';
import Navbar from "../../../../shared/Components/Layout/Navbar/Navbar.jsx";
import Footer from "../../../../shared/Components/Layout/Footer/Footer.jsx";
import EmergencyCrime from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/EmergencyCrime.jsx";
import {Siren} from "lucide-react";
import './EmergencyCrimePage.css';
const EmergencyCrimePage = () => {
    return (
        <>
            <Navbar/>
            <main className="crime-page-container">
                <div className="crime-page-wrapper">
                    <div className="crime-page-header">
                        <button
                            className="back-button"
                            onClick={() => window.location.href = '/emergency'}
                        >
                            ← Back
                        </button>

                        <h1 className="crime-page-title">
                            <Siren />
                            Crime Reports
                        </h1>
                    </div>

                    <div className="crime-map-container">
                        <EmergencyCrime />
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    );
};

export default EmergencyCrimePage;