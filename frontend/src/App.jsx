import './App.css'

import Traffic from "./domains/Citizen/Pages/Traffic/Traffic.jsx";
import Branch from "@/domains/Company/Pages/Branch/Branch.jsx";
import General from "@/General/Pages/General.jsx";
import {Routes, Route} from "react-router-dom";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<General/>}/>
                <Route path="/traffic" element={<Traffic/>}/>
                <Route path="/branch" element={<Branch/>}/>
            </Routes>
        </>
    )
}

export default App;
