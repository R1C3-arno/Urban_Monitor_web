import React from 'react';
import Navbar from "../../../../shared/Components/Layout/Navbar/Navbar.jsx";
import Footer from "../../../../shared/Components/Layout/Footer/Footer.jsx";
import EmergencyFire from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/EmergencyFire.jsx";
import {Flame} from "lucide-react";
import './EmergencyFirePage.css';
const EmergencyFirePage = () => {
    return (
        <>
            <Navbar/>
            <main className="fire-page-container">
                <div className="fire-page-wrapper">
                    <div className="fire-page-header">
                        <button
                            className="back-button"
                            onClick={() => window.location.href = '/emergency'}
                        >
                            ← Back
                        </button>

                        <h1 className="fire-page-title">
                            <Flame />
                            Fire Emergency
                        </h1>
                    </div>

                    <div className="fire-map-container">
                        <EmergencyFire />
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    );
};

export default EmergencyFirePage;