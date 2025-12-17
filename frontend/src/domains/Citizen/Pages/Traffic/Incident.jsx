import React, {useState} from 'react';
import './Incident.css'
import Navbar from "../../../../shared/Components/Layout/Navbar/Navbar.jsx";
import Footer from "../../../../shared/Components/Layout/Footer/Footer.jsx";
import IncidentMap from "@/domains/Citizen/features/Incident/Components/IncidentMap/IncidentMap.jsx";

const Incident = () => {
    return (
        <>
            <Navbar/>

            <main className="incident-container">
                <div className="incident-map-container">
                    <IncidentMap/>
                </div>
            </main>

            <Footer/>
        </>
    )
}

export default Incident