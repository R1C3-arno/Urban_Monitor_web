import React from "react";
import './Branch.css'

import Navbar from "@/shared/Components/Layout/Navbar/Navbar.jsx";
import Footer from "@/shared/Components/Layout/Footer/Footer.jsx";

import {BranchMap} from "@/domains/Company/features/Branch-Managmenet/index.js";
import ReportBranch from "@/domains/Company/features/Branch-Managmenet/Components/ReportBranch/ReportBranch.jsx";

const Branch = () => {
    return (
        <>
        <Navbar/>
            <main className="branch-container">
                <div className="branch-map-container">
                    <BranchMap/>
                </div>
            </main>
            <Footer/>
        </>
    );
};

export default Branch;
