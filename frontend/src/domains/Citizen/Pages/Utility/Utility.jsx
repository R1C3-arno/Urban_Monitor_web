import React, {useState} from 'react';
import './Utility.css'
import Navbar from "../../../../shared/Components/Layout/Navbar/Navbar.jsx";
import Footer from "../../../../shared/Components/Layout/Footer/Footer.jsx";
import UtilityMap from "@/domains/Citizen/features/Utility/Components/UtilityMap/UtilityMap.jsx";


const Utility = () => {
    return (
        <>
            <Navbar/>

            <main className="utility-container">
                <div className="utility-map-container">
                    <UtilityMap/>
                </div>

            </main>

            <Footer/>
        </>
    )
}

export default Utility