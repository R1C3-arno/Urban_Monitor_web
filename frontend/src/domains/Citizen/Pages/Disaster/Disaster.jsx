import React, {useState} from 'react';
import './Disaster.css'
import Navbar from "../../../../shared/Components/Layout/Navbar/Navbar.jsx";
import Footer from "../../../../shared/Components/Layout/Footer/Footer.jsx";

import VietnamDisasterMonitor
    from "@/domains/Citizen/features/Disaster/Components/DisasterMap/VietnamDisasterMonitor.jsx";



const Disaster = () => {
    return (
        <>
            <Navbar/>

            <main className="disaster-container">
                <div className="disaster-map-container">
                    <VietnamDisasterMonitor/>
                </div>

            </main>

            <Footer/>
        </>
    )
}

export default Disaster