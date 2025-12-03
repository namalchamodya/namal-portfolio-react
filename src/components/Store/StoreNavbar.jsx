import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/store.css'; 

const StoreNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="store-navbar">
      <div className="store-nav-container">
        
        {/* Left: Back Button */}
        <div className="nav-left">
          <button className="btn-back" onClick={() => navigate('/')}>
            ← Back
          </button>
        </div>

        {/* Center: Heading */}
        <div className="nav-center">
          <Link to="/store/electronics" className="store-logo">
            NC<span className="highlight">.</span> Electronics
          </Link>
        </div>

        {/* Right: Login Button */}
        <div className="nav-right">
          <button className="btn-login" onClick={() => alert("Login Modal Opening...")}>
            Login
          </button>
        </div>

      </div>
    </nav>
  );
};

export default StoreNavbar;