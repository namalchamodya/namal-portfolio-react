import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/landing.css';

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  
  // Navigation Hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle Menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 👇 Scroll Function
  const handleScrollToContact = (e) => {
    e.preventDefault(); // URL එකේ #contact වැටෙන එක නවත්වනවා (optional)
    setIsOpen(false);   // Mobile Menu එක වහනවා

    // අපි ඉන්නේ Home Page ('/') එකේ නෙවෙයි නම්, මුලින් Home එකට යන්න
    if (location.pathname !== '/') {
      navigate('/');
      // පිටුව මාරු වෙන්න පොඩි වෙලාවක් දීලා Scroll කරන්න
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    } else {
      // දැනටමත් Home එකේ නම් කෙලින්ම Scroll කරන්න
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="l-navbar" ref={navRef}>
      <div className="l-nav-container">
        {/* Logo */}
        <Link to="/" className="l-logo">
          NC<span>.</span>
        </Link>

        {/* Hamburger Icon (Mobile) */}
        <div className="l-menu-icon" onClick={toggleMenu}>
          <span className={isOpen ? 'bar open' : 'bar'}></span>
          <span className={isOpen ? 'bar open' : 'bar'}></span>
          <span className={isOpen ? 'bar open' : 'bar'}></span>
        </div>

        {/* Nav Links */}
        <ul className={isOpen ? 'l-nav-menu active' : 'l-nav-menu'}>
          <li className="l-nav-item">
            <Link to="/portfolio" className="l-nav-link" onClick={() => setIsOpen(false)}>Portfolio</Link>
          </li>
          <li className="l-nav-item">
            <Link to="/courses" className="l-nav-link" onClick={() => setIsOpen(false)}>Education</Link>
          </li>
          <li className="l-nav-item dropdown-trigger">
            <span className="l-nav-link">Arts & 3D ▼</span>
            <ul className="l-dropdown">
              <li><Link to="/3d-projects" onClick={() => setIsOpen(false)}>3D Gallery</Link></li>
              <li><Link to="/art-portfolio" onClick={() => setIsOpen(false)}>Digital Arts</Link></li>
            </ul>
          </li>
          <li className="l-nav-item dropdown-trigger">
            <span className="l-nav-link">Store ▼</span>
            <ul className="l-dropdown">
              {/* 👇 මෙන්න වෙනස්කම: Electronics Store Link එක දැම්මා */}
              <li><Link to="/store/electronics" onClick={() => setIsOpen(false)}>Electronics</Link></li>
              <li><a href="#software" onClick={() => setIsOpen(false)}>Software</a></li>
              <li><a href="#books" onClick={() => setIsOpen(false)}>Books</a></li>
            </ul>
          </li>
          <li className="l-nav-item">
            <a href="#blog" className="l-nav-link" onClick={() => setIsOpen(false)}>Blog</a>
          </li>
          
          {/* Mobile Only Contact Button */}
          <li className="l-nav-item mobile-cta">
            <a href="#contact" className="l-nav-btn" onClick={handleScrollToContact}>Contact Me</a>
          </li>
        </ul>

        {/* Desktop Contact Button */}
        <a href="#contact" className="l-nav-btn desktop-cta" onClick={handleScrollToContact}>Contact Me</a>
      </div>
    </nav>
  );
};

export default LandingNavbar;