import './App.css'


import Branch from "@/domains/Company/Pages/Branch/Branch.jsx";
import General from "@/General/Pages/General.jsx";
import {Routes, Route} from "react-router-dom";
import Incident from "@/domains/Citizen/Pages/Traffic/Incident.jsx";
import Disaster from "@/domains/Citizen/Pages/Disaster/Disaster.jsx";
import Emergency from "@/domains/Citizen/Pages/Emergency/Emergency.jsx";
import Market from "@/domains/Citizen/Pages/Market/Market.jsx";
import Temperature from "@/domains/Citizen/Pages/Temperature/Temperature.jsx";
import Utility from "@/domains/Citizen/Pages/Utility/Utility.jsx";
import EmergencyAmbulancePage from "@/domains/Citizen/Pages/Emergency/EmergencyAmbulancePage.jsx";
import EmergencyCrimePage from "@/domains/Citizen/Pages/Emergency/EmergencyCrimePage.jsx";
import EmergencyFirePage from "@/domains/Citizen/Pages/Emergency/EmergencyFirePage.jsx";
import FamilyTrackerPage from "@/domains/Citizen/Pages/Emergency/FamilyTrackerPage.jsx";
import Monitor from "@/domains/Government/Pages/Monitor.jsx";



function App() {
    return (
        <>

            <Routes>
                <Route path="/" element={<General/>}/>
                <Route path="/branch" element={<Branch/>}/>
                <Route path="/incident" element={<Incident/>}/>
                <Route path="/disaster" element={<Disaster/>}/>
                <Route path="/emergency" element={<Emergency/>}/>
                <Route path="/market" element={<Market/>}/>
                <Route path="/temperature" element={<Temperature/>}/>
                <Route path="/utility" element={<Utility/>}/>
                <Route path="/emergencyAmbulance" element={<EmergencyAmbulancePage/>}/>
                <Route path="/emergencyCrime" element={<EmergencyCrimePage/>}/>
                <Route path="/emergencyFire" element={<EmergencyFirePage/>}/>
                <Route path="/trackFamily" element={<FamilyTrackerPage/>}/>
                <Route path="/monitor" element={<Monitor/>}/>
            </Routes>


        </>
    )
}

export default App;
