import React, {useState} from "react";
import './Project.css'
import Map from '../../../shared/Components/Map/BaseMap/Map.jsx'
import MapPopUp from "../../../shared/Components/Map/MapPopUp/PopUp.jsx";

import {projects, markers} from "../../JS/project.js"


const Projects = () => {
    const handleMapClick = (event) => {
    };
    return (
        <section className="projects-section">
            {projects.map((project, i) => (
                <div key={project.id} className="project-item">
                    <div className="project-headrr">
                        <h3 className="project-title">{project.title}</h3>
                        <span className="project-tag">{project.tag}</span>
                    </div>
                    <div className="project-map">
                        <Map
                            center={project.center}
                            zoom={project.zoom}
                            markers={markers}
                            onMapClick={handleMapClick}
                            styleUrl=""
                        >
                            {({map}) => (
                                <MapPopUp
                                    map={map}
                                    coords={[106.7, 10.7]}
                                    title="Marker A"
                                >
                                    <p>Thông tin tọa độ: 106.7, 10.7</p>
                                </MapPopUp>
                            )}
                        </Map>
                    </div>
                </div>
            ))}
        </section>
    );
}
export default Projects;