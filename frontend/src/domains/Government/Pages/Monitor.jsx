import React from "react";
import Navbar from "@/shared/Components/Layout/Navbar/Navbar.jsx";
import Footer from "@/shared/Components/Layout/Footer/Footer.jsx";
import DataViewerPage from "@/domains/Government/features/Monitor/Components/DataViewer/DataViewerPage.jsx";


const Monitor = () => {
    return (
        <>
            <Navbar/>
            <main className="monitor-container">
                <DataViewerPage/>
            </main>
            <Footer/>

        </>
    )
}
export default Monitor