import React from 'react';
import Navbar from "../../../../shared/Components/Layout/Navbar/Navbar.jsx";
import Footer from "../../../../shared/Components/Layout/Footer/Footer.jsx";
import FamilyTracker from "@/domains/Citizen/features/Emergency/Components/EmergencyMap/FamilyTracker.jsx";
import {Users} from "lucide-react";
import './FamilyTrackerPage.css';
const FamilyTrackerPage = () => {
    return (
        <>
            <Navbar/>
            <main className="family-page-container">
                <div className="family-page-wrapper">
                    <div className="family-page-header">
                        <button
                            className="back-button"
                            onClick={() => window.location.href = '/emergency'}
                        >
                            ← Back
                        </button>

                        <h1 className="family-page-title">
                            <Users />
                            Family Tracker
                        </h1>
                    </div>

                    <div className="family-map-container">
                        <FamilyTracker />
                    </div>
                </div>
            </main>

            <Footer/>
        </>
    );
};

export default FamilyTrackerPage;