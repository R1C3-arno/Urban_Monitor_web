import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './shared/Components/Layout/Navbar/Navbar.jsx'
import Hero from './General/Components/Hero/Hero.jsx'
import Project from "./General/Components/Project/Project.jsx";
import Button from './shared/Components/UI/Button/Button.jsx'
import Card from './shared/Components/UI/Card/Card.jsx'
import Test from './Test.jsx'
import General from "./General/Pages/General.jsx";
import ImageLayout_Left from "./domains/Citizen/Layouts/ImageLayout_Left.jsx";
import ReportAccident from "./domains/Citizen/features/Traffic/Components/ReportAccident/ReportAccident.jsx";
import Traffic from "./domains/Citizen/Pages/Traffic/Traffic.jsx";
import Map from "./shared/Components/Map/BaseMap/Map.jsx";


const App = () => {
    return (

        <div>
            <Traffic />
        </div>







        /*
        <div>
            <Traffic />
        </div>

         */


    )
}
export default App