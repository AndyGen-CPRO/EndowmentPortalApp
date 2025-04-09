import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../utils/auth';

const Home = () => {
  const token = getToken();

  return (
    <div>
      <div>
        <h1>Welcome to the Donor Portal</h1>
        <div>
          {/* Hides register and log in buttons if logged in */}
          {!token ? (
            <>
              <p>Please register or log in to continue</p>
              <Link to="/register">
                <button className="proceed-button">Register</button>
              </Link>
              <Link to="/login">
                <button className="proceed-button">Log In</button>
              </Link>
            </>
          ) : (
            <>
              <p>You are currently logged in.</p>
              <Link to="/portfolio">
                <button>Continue to your Endowment Portfolio</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
