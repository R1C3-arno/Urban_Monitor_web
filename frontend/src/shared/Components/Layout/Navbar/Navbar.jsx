import React from "react";
import './Navbar.css'
import logo_dark from '../../../../assets/logo_dark.png'
import logo from '../../../../assets/logo.png'
import Button from "../../UI/Button/Button.jsx";
const Navbar = () => {
    return (
        <nav className="nav_container">

            <img src={logo} alt="" className='logo_dark'/>

            <ul className="navbar-menu">
                <li className="nav-item">Home</li>
                <li className="nav-item">About</li>
                <li className="nav-item">Features</li>
            </ul>

            <div className="nav-actions">
                <Button variant="primary" size="lg">
                    Login
                </Button>
            </div>

        </nav>
    )
}

export default Navbar;