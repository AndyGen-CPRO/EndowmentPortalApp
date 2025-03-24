import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../utils/auth';

const Home = () => {
  const token = getToken();

  return (
    <div>
      <div>
        <h1>Welcome to the Donor Portal</h1>
        <p>Please register or log in to continue</p>
        <div>
          {/* Hides register and log in buttons if logged in */}
          {!token ? (
            <>
              <Link to="/register">
                <button>Sign Up</button>
              </Link>
              <Link to="/login">
                <button>Log In</button>
              </Link>
            </>
          ) : (
            <Link to="/portfolio">
              <button>Continue to your Endowment Portfolios</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
