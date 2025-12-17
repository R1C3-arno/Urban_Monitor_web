import React from 'react';
import Navbar from "../../../../shared/Components/Layout/Navbar/Navbar.jsx";
import Footer from "../../../../shared/Components/Layout/Footer/Footer.jsx";
import EmergencyAmbulance from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/EmergencyAmbulance.jsx";
import './EmergencyAmbulancePage.css';
import {Ambulance} from "lucide-react";

const EmergencyAmbulancePage = () => {
    return (
        <>
            <Navbar/>
            <main className="ambulance-page-container">
                <div className="ambulance-page-wrapper">
                    <div className="ambulance-page-header">
                        <button
                            className="back-button"
                            onClick={() => window.location.href = '/emergency'}
                        >
                            ← Back
                        </button>
                        <h1 className="ambulance-page-title">
                            <Ambulance />
                            Emergency Ambulance
                        </h1>
                    </div>

                    <div className="ambulance-map-container">
                        <EmergencyAmbulance />
                    </div>
                </div>
            </main>

            <Footer/>
        </>
    );
};

export default EmergencyAmbulancePage;