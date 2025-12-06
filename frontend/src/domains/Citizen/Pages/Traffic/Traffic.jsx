import React, {useState} from 'react';
import './Traffic.css'
import Navbar from "../../../../shared/Components/Layout/Navbar/Navbar.jsx";
import Footer from "../../../../shared/Components/Layout/Footer/Footer.jsx";
import Map from "../../../../shared/Components/Map/BaseMap/Map.jsx";
import TrafficMap from "../../features/Traffic/Components/TrafficMap/TrafficMap.jsx";
import ImageModal from "../../../../shared/Components/UI/ImageModal/ImageModal.jsx";
import Alert from "../../../../shared/Components/UI/Alert/Alert.jsx";
import ybrookie from "../../../../assets/ybrookie.jpg";
import ReportAccident from "../../features/Traffic/Components/ReportAccident/ReportAccident.jsx";

const Traffic = () => {
    return (
        <>
            <Navbar/>

            <main className="traffic-container">
                <div className="traffic-map-container">
                    <TrafficMap/>
                </div>
                <div className="traffic-report-button-container">
                    <ReportAccident />
                </div>
            </main>

            <Footer/>
        </>
    )
}

export default Traffic