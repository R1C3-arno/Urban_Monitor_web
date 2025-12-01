import Projects from "..//components/Project/Project.jsx";
import Navbar from "../../shared/Components/Layout/Navbar/Navbar.jsx"
import Footer from "../../shared/Components/Layout/Footer/Footer.jsx"
import Hero from "../Components/Hero/Hero.jsx";
import Button from "../../shared/Components/UI/Button/Button.jsx";


export default function General() {
    return (
        <>
            <Navbar />
            <Hero />
            <Projects />
            <Footer />
        </>
    )
}





