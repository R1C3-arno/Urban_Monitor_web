import React, {useState, useRef,useEffect} from "react";
import './Navbar.css'
import logo_dark from '../../../../assets/logo_dark.png'
import logo from '../../../../assets/logo.png'
import Button from "../../UI/Button/Button.jsx";
import Login from "../../UI/Login/Login.jsx";
import Register from "../../UI/Register/Register.jsx";
import {useNavigate} from "react-router-dom";
import Circle from "../../UI/Circle/Circle.jsx";


const Navbar = () => {
    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [openUserMenu, setOpenUserMenu] = useState(false);

    const navigate = useNavigate();

    const homeRef = useRef(null);
    const aboutRef = useRef(null);
    const featureRef = useRef(null);

    // thông tin user
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });


    const scrollTo = (ref) => {
        ref?.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const handleLoginSuccess = (data) => {
        const userData = {
            name: data.name || "User",
            email: data.email,
            avatar: data.avatar || null
        };

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setOpenLogin(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setOpenUserMenu(false);
        navigate('/');
    };

    const getUserInitials = (name) => {
        if (!name) return "U";
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <nav className="nav_container">


                <img src={logo} alt="" className='logo_dark'/>

                <ul className="navbar-menu">
                    <li className="nav-item" onClick={() => navigate("/")}>Home</li>
                    <li className="nav-item" onClick={() => scrollTo(aboutRef)}>About</li>
                    <li className="nav-item" onClick={() => navigate("/?scroll=projects")}>Features</li>


                    <li
                        className="nav-item nav-menu-wrapper"
                        onMouseEnter={() => setOpenMenu(true)}
                        onMouseLeave={() => setOpenMenu(false)}
                    >
                        Menu ▾

                        {openMenu && (
                            <ul className="dropdown-menu">
                                <li onClick={() => navigate("/branch")}>Logistics</li>
                                <li onClick={() => navigate("/incident")}>Incident</li>
                                <li onClick={() => navigate("/disaster")}>Disaster</li>
                                <li onClick={() => navigate("/emergency")}>Emergency</li>
                                <li onClick={() => navigate("/market")}>Market</li>
                                <li onClick={() => navigate("/temperature")}>Temperature</li>
                                <li onClick={() => navigate("/utility")}>Utility</li>
                                <li onClick={() => navigate("/monitor")}>View Data</li>

                            </ul>
                        )}
                    </li>
                </ul>

                <div className="nav-actions">
                    {user ? (
                        <div
                            className="user-avatar-wrapper"
                            onMouseEnter={() => setOpenUserMenu(true)}
                            onMouseLeave={() => setOpenUserMenu(false)}
                        >
                            <Circle size="small" clickable>
                                {user.avatar ? (
                                    <img src={user.avatar} alt="avatar" />
                                ) : (
                                    <strong>{getUserInitials(user.name)}</strong>
                                )}
                            </Circle>



                            {openUserMenu && (
                                <ul className="dropdown-menu user-menu">
                                    <li onClick={() => navigate("/profile")}>Profile</li>
                                    <li onClick={handleLogout}>Logout</li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => setOpenLogin(true)}
                        >
                            Login
                        </Button>
                    )}
                </div>

            </nav>
            <Login
                isOpen={openLogin}
                onClose={() => setOpenLogin(false)}
                onOpenRegister={() => {
                    setOpenLogin(false);
                    setOpenRegister(true);
                }}
                onSubmit={handleLoginSuccess}
            />
            <Register
                isOpen={openRegister}
                onClose={() => setOpenRegister(false)}
                onOpenLogin={() => {
                    setOpenRegister(false);
                    setOpenLogin(true);
                }}
                onSubmit={(data) => {
                    console.log("REGISTER:", data);
                    setOpenRegister(false);
                }}
            />
        </>
    )
}

export default Navbar;