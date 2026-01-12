import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/store.css'; 

const StoreNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isElectronics = location.pathname.includes('electronics');
  const isBooks = location.pathname.includes('books');
  const isSoftware = location.pathname.includes('software');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="store-navbar">
      <div className="store-nav-container">
        
        {/* 1. Mobile Menu Icon (Left) */}
        <div className="store-menu-icon" onClick={toggleMenu}>
          <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
          <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
          <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
        </div>

        {/* 2. Mobile Logo (Visible ONLY on Mobile due to CSS) */}
        <Link to="/store/electronics" className="mobile-nav-logo">
          NC<span className="highlight">.</span> Store
        </Link>

        {/* 3. Desktop Navigation (Visible ONLY on Desktop) */}
        <div className="desktop-nav-items">
            <div className="nav-left">
                <button className="btn-back" onClick={() => navigate('/')}>← Home</button>
            </div>

            <div className="nav-center">
                <Link 
                    to="/store/electronics" 
                    className={`store-nav-link ${isElectronics ? 'active' : ''}`}
                >
                    Electronics
                </Link>
                
                <Link 
                    to="/store/software" 
                    className={`store-nav-link ${isSoftware ? 'active' : ''}`}
                >
                    Software
                </Link>

                <Link 
                    to="/store/books" 
                    className={`store-nav-link ${isBooks ? 'active' : ''}`}
                >
                    Books
                </Link>
            </div>

            <div className="nav-right">
                <button className="btn-login" onClick={() => alert("Login Modal Opening...")}>
                    Login
                </button>
            </div>
        </div>

        {/* 4. Mobile Side Panel (Same as before) */}
        <div className={`store-side-panel ${isMenuOpen ? 'open' : ''}`}>
            <div className="panel-header">
                <h3>Menu</h3>
                <button className="close-btn" onClick={toggleMenu}>&times;</button>
            </div>
            
            <div className="panel-links">
                <Link 
                    to="/store/electronics" 
                    className={`panel-link ${isElectronics ? 'active' : ''}`}
                    onClick={toggleMenu}
                >
                    🔌 Electronics
                </Link>
                <Link 
                    to="/store/software" 
                    className={`panel-link ${isSoftware ? 'active' : ''}`}
                    onClick={toggleMenu}
                >
                    💻 Software
                </Link>
                <Link 
                    to="/store/books" 
                    className={`panel-link ${isBooks ? 'active' : ''}`}
                    onClick={toggleMenu}
                >
                    📚 Books
                </Link>
            </div>

            <div className="panel-actions">
                <button className="btn-login full-width" onClick={() => alert("Login")}>
                    Login / Sign Up
                </button>
                <button className="btn-back full-width" onClick={() => navigate('/')}>
                    ← Back to Home
                </button>
            </div>
        </div>

        {isMenuOpen && <div className="menu-backdrop" onClick={toggleMenu}></div>}

      </div>
    </nav>
  );
};

export default StoreNavbar;