import React from "react";
import { useNavigate, Link } from 'react-router-dom';
import { removeToken, removeRole, getToken } from "../../utils/auth";
import logo from "./cfcab-logo.png"

const Navbar = ({ userToken, onLogOut }) => {
    const navigate = useNavigate();

    return (
        <header>
            <nav>
                <div>
                    <Link to="/">
                        <img src={logo} width="90" alt="cfcab-logo"/>
                    </Link>
                </div>

                <div className="menu-btns">
                    <div>
                        <button onClick={() => navigate('endowment-calculator')}>Endowment Calculator</button>
                    </div>

                    {userToken && (
                        <div>
                            <button onClick={() => {onLogOut(); navigate('')}}>Log Out</button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
