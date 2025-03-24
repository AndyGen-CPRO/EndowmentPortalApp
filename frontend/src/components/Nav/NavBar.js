import React from "react";
import { useNavigate, Link } from 'react-router-dom';
import { removeToken, removeRole, getToken } from "../../utils/auth";
import logo from "./cfcab-logo.png"

const Navbar = () => {
    const token = getToken();
    const navigate = useNavigate();
    
    const logOut = () => {
        removeToken();
        removeRole();
        navigate('');
    }

    return (
        <header>
            <nav>
                <div>
                    <Link to="/">
                        <img src={logo} width="90" alt="cfcab-logo"/>
                    </Link>
                </div>
                {token && (
                    <div className="logout-btn">
                        <button onClick={logOut}>Log Out</button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
