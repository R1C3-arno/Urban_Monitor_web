import React from "react";
import './Hero.css'
import hero_background from '../../../assets/background.jpg'

const Hero = ({ onScrollToProjects }) => {
    return (
        <div className="hero_container">
            <section className="hero-section">
                <div className="hero-content">
                    <span className="hero-subtitle">(OOP+DSA-Project)</span>
                    <h1 className="hero-title">
                        URBAN MONITOR<br/>
                        ALL IN ONE MAP
                    </h1>

                    <div className="hero-image-container">
                        <img src={hero_background} alt="Modern Architecture" className="hero-image"/>
                    </div>

                    <div className="hero-description">
                        <span className="description-subtitle">(OUR PROJECT)</span>
                        <div className="description-content">
                            <p>
                               URBAN MONITOR FOCUSES ON IMPLEMENTING MAP FOR SEVERAL FIELD TRAFFIC, SECURITY, WEATHER FORECASTER, DISASTER HANDLING, CREDIT SUPERMARKET
                            </p>
                            {/* 👉 NHẤN LÀ CUỘN XUỐNG PROJECT */}
                            <button className="cta-button" onClick={onScrollToProjects}>
                                What We Do
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Hero