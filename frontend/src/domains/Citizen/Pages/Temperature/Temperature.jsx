import React, {useState} from 'react';
import './Temperature.css'
import Navbar from "../../../../shared/Components/Layout/Navbar/Navbar.jsx";
import Footer from "../../../../shared/Components/Layout/Footer/Footer.jsx";
import AirQuality from "@/domains/Citizen/features/Temperature/Components/TemperatureMap/AirQuality.jsx";


const Temperature = () => {
    return (
        <>
            <Navbar/>

            <main className="temperature-container">
                <div className="temperature-map-container">
                    <AirQuality/>
                </div>
            </main>

            <Footer/>
        </>
    )
}

export default Temperature