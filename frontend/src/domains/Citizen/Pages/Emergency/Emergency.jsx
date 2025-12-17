import React from 'react';
import './Emergency.css'
import Navbar from "../../../../shared/Components/Layout/Navbar/Navbar.jsx";
import Footer from "../../../../shared/Components/Layout/Footer/Footer.jsx";
import {Ambulance,Siren,FireExtinguisher,Users,Hospital,Phone,ShieldUser} from "lucide-react";

const emergencyServices = [
    {
        id: 'ambulance',
        title: 'Emergency Ambulance',
        icon: <Ambulance />,
        description: 'Medical emergencies, accidents, health crises',
        color: '#ff4444',
        hotline: '115',
        path: '/emergencyAmbulance'
    },
    {
        id: 'crime',
        title: 'Crime Reports',
        icon: <Siren />,
        description: 'Criminal activities, suspicious behavior, theft',
        color: '#ff0000',
        hotline: '113',
        path: '/emergencyCrime'
    },
    {
        id: 'fire',
        title: 'Fire Emergency',
        icon: <FireExtinguisher />,
        description: 'Fire incidents, smoke, gas leaks',
        color: '#ff4400',
        hotline: '114',
        path: '/emergencyFire'
    },
    {
        id: 'family',
        title: 'Family Tracker',
        icon: <Users />,
        description: 'Track family members location in real-time',
        color: '#3498db',
        hotline: null,
        path: '/trackFamily'
    }
];

const Emergency = () => {
    // Force full page reload to clear WebGL context
    const handleNavigate = (path) => {
        window.location.href = path;
    };

    return (
        <>
            <Navbar/>

            <main className="emergency-hub-container">
                <div className="emergency-hub-header">
                    <h1>
                        <Hospital />
                        Emergency Services
                    </h1>
                    <p>Select a service to view real-time emergency information</p>
                </div>

                <div className="emergency-cards-grid">
                    {emergencyServices.map((service) => (
                        <div
                            key={service.id}
                            className="emergency-card"
                            style={{ '--card-color': service.color }}
                            onClick={() => handleNavigate(service.path)}
                        >
                            <div className="emergency-card-icon">
                                {service.icon}
                            </div>
                            <h2 className="emergency-card-title">
                                {service.title}
                            </h2>
                            <p className="emergency-card-description">
                                {service.description}
                            </p>
                            {service.hotline && (
                                <div className="emergency-card-hotline">
                                    <Phone />
                                    Hotline: <strong>{service.hotline}</strong>
                                </div>
                            )}
                            <div className="emergency-card-button">
                                View Map →
                            </div>
                        </div>
                    ))}
                </div>

                <div className="emergency-hub-footer">
                    <div className="emergency-hotlines">
                        <h3>
                            <Phone />
                            Emergency Hotlines
                        </h3>
                        <div className="hotline-list">
                            <span>
                                <Ambulance />
                                Ambulance: <strong>115</strong></span>
                            <span>
                                <ShieldUser />
                                Police: <strong>113</strong></span>
                            <span>
                                <FireExtinguisher />
                                Fire: <strong>114</strong></span>
                        </div>
                    </div>
                </div>
            </main>

            <Footer/>
        </>
    )
}

export default Emergency