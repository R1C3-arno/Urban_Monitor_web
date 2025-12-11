import Projects from "../components/Project/Project.jsx";
import Navbar from "../../shared/Components/Layout/Navbar/Navbar.jsx";
import Footer from "../../shared/Components/Layout/Footer/Footer.jsx";
import Hero from "../Components/Hero/Hero.jsx";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./General.css";

export default function General() {
    const projectRef = useRef(null);
    const location = useLocation();

    const OFFSET = 150;
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const scrollTarget = params.get("scroll");

        if (scrollTarget === "projects") {
            setTimeout(() => {
                const top = projectRef.current?.offsetTop || 0;

                window.scrollTo({
                    top: top - OFFSET,
                    behavior: "smooth",
                });
            }, 200);
        }
    }, [location]);

    const scrollToProjects = () => {
        const top = projectRef.current?.offsetTop || 0;

        window.scrollTo({
            top: top - OFFSET,
            behavior: "smooth",
        });
    };

    return (
        <>
            <Navbar />
            <Hero onScrollToProjects={scrollToProjects} />

            <div ref={projectRef}>
                <Projects />
            </div>

            <Footer />
        </>
    );
}
