import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll Handling Function
  const handleNavigation = (e, targetId) => {
    e.preventDefault(); // 1. URL එක වෙනස් වීම වළක්වයි (Crash එක නවත්වයි)

    // 2. අපි ඉන්නේ Home Page ('/') එකේ ද කියලා බලනවා
    if (location.pathname === '/') {
      // Home Page එකේ නම්, කෙලින්ම Scroll කරන්න
      const id = targetId.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // අපි ඉන්නේ වෙන පිටුවක නම් (උදා: Art Portfolio), Home Page එකට යන්න
      navigate('/');
      // Home Page එකට ගිය පසු උඩටම Scroll වෙන්න App.js එකේ Logic එකක් දාලා තියෙන නිසා එය ඉබේම වෙයි.
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
          {/* සියලුම Links වලට handleNavigation එකතු කරන ලදි */}
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