import React, {useState} from 'react';
import './Market.css'
import Navbar from "../../../../shared/Components/Layout/Navbar/Navbar.jsx";
import Footer from "../../../../shared/Components/Layout/Footer/Footer.jsx";
import MarketFood from "@/domains/Citizen/features/Market/Components/MarketMap/MarketFood.jsx";
import MarketPharmacy from "@/domains/Citizen/features/Market/Components/MarketMap/MarketPharmacy.jsx";



const Market = () => {
    return (
        <>
            <Navbar/>

            <main className="market-container">
                <div className="market-map-container">
                    <MarketFood/>
                </div>
                <div className="market-map-container">
                    <MarketPharmacy/>
                </div>

            </main>

            <Footer/>
        </>
    )
}

export default Market