import React, {useState} from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
    const [menu, setMenu] = useState("home");
    const navigate = useNavigate();
    return (
        <div className='navbar'>
            <img src={assets.logo} alt="" className='logo' />
            <ul className="navbar-menu">
                <li onClick={()=>setMenu("home")} className={menu === "home" ? "active" : ""}>home</li>
                <li onClick={()=>setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</li>
                <li onClick={()=>setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</li>
                <li onClick={()=>setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</li>
            </ul>
            <div className="navbar-right">
                <img src={assets.search_icon} alt="" />
                <div className="navbar-invest">
                    <img src={assets.invest} alt="" />
                    <div className="dot"></div>
                </div>
                <button onClick={()=> navigate('/Login')} >sign in</button>
                <button onClick={()=> navigate('/Register')} >sign up</button>
            </div>
        </div>
    )
}

export default Navbar
