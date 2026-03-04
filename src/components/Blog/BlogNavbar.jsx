import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginProfileButton from '../Auth/LoginProfileButton';
import '../../styles/store.css';

const StoreNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="store-navbar">
      <div className="store-nav-container">

        <div className="nav-left">
          <button className="btn-back" onClick={() => navigate('/')}>← Home</button>
        </div>

        <div className="nav-right">
          <LoginProfileButton />
        </div>

      </div>
    </nav>
  );
};

export default StoreNavbar;