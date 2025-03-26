import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import "./App.css";
import Home from './components/Home/HomePage';
import Navbar from './components/Nav/NavBar';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Portfolio from './components/Portfolio/PortfolioPage';
import AddPledge from './components/Portfolio/AddPledgePage';
import EndowmentCalculator from './components/Portfolio/EndowmentCalculator';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/add-pledge" element={<AddPledge />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
