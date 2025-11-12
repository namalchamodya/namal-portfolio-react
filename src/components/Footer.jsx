import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">
          <h2>NC<span>.</span></h2>
          <p>© 2025 Namal Chamodya. All Rights Reserved.</p>
        </div>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
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
