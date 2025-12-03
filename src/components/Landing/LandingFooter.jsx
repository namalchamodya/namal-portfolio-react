import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/landing.css';

const LandingFooter = () => {
  return (
    <footer className="l-footer">
      <div className="l-footer-container">
        
        {/* Column 1: Brand & About */}
        <div className="l-footer-col">
          <h2 className="l-footer-logo">NC<span>.</span></h2>
          <p className="l-footer-text">
            Innovating the digital future. Your one-stop hub for Technology, 
            Education, and Creative Arts.
          </p>
          <div className="l-socials">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="l-footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/courses">Academy</Link></li>
            <li><Link to="/art-portfolio">Art Gallery</Link></li>
          </ul>
        </div>

        {/* Column 3: Store & Resources */}
        <div className="l-footer-col">
          <h3>Store & Blog</h3>
          <ul>
            <li><a href="#electronics">Electronic Modules</a></li>
            <li><a href="#software">Source Codes</a></li>
            <li><a href="#blog">Tech Articles</a></li>
            <li><a href="#books">E-Books</a></li>
          </ul>
        </div>

        {/* Column 4: Contact & Newsletter */}
        <div className="l-footer-col">
          <div className="footer-newsletter">
            <h3>Stay Updated</h3>
            <p className="newsletter-text">Subscribe to get the latest updates on courses and products.</p>
            <form className="l-newsletter-form">
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

      </div>

      <div className="l-footer-bottom">
        <p>&copy; 2025 Namal Chamodya. All Rights Reserved.</p>
        <div className="l-footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;