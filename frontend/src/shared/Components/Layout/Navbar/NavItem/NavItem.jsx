import React from "react";

const NavItem = ({ children, onClick }) => {
    return (
        <li className="nav-item" onClick={onClick}>
            {children}
        </li>
    );
};

export default NavItem;
