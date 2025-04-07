import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from 'react-router-dom';
import "./App.css";
import Home from './components/Home/HomePage';
import Navbar from './components/Nav/NavBar';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import ResetPassword from './components/Auth/ResetPassword';
import ForgotPassword from './components/Auth/ForgotPassword';
import Portfolio from './components/Portfolio/PortfolioPage';
import AddPledge from './components/Portfolio/AddPledgePage';
import EndowmentCalculator from './components/EndowmentCalculator/EndowmentCalculatorPage';

import { getToken, removeToken } from './utils/auth';

function App() {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUserToken(token);
    }
  }, []);

  const handleLogIn = (token) => {
    setUserToken(token);
  };

  const handleLogOut = () => {
    setUserToken(null);
    removeToken();
  };

  return (
    <div className="App">
      <Router>
        <Navbar 
        userToken={userToken} 
        onLogOut={handleLogOut}
        />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/login" element={<Login onLogIn={handleLogIn} token={userToken} />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/add-pledge" element={<AddPledge />} />
            <Route path="/endowment-calculator" element={<EndowmentCalculator />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
