import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (e, targetId) => {
    e.preventDefault();

    if (location.pathname === '/portfolio' || location.pathname === '/') {
      const id = targetId.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/portfolio');
      setTimeout(() => {
        const id = targetId.replace('#', '');
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">
          <h2>NC<span>.</span></h2>
          <p>© 2025 Namal Chamodya. All Rights Reserved.</p>
        </div>

        <div className="footer-links">
          <a href="#home" onClick={(e) => handleNavigation(e, '#home')}>Home</a>
          <a href="#about" onClick={(e) => handleNavigation(e, '#about')}>About</a>
          <a href="#projects" onClick={(e) => handleNavigation(e, '#projects')}>Projects</a>
          <a href="#skills" onClick={(e) => handleNavigation(e, '#skills')}>Skills</a>
          <a href="#contact" onClick={(e) => handleNavigation(e, '#contact')}>Contact</a>
        </div>

        <div className="footer-newsletter">
          <h3>Stay Updated</h3>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button type="submit">Subscribe</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;