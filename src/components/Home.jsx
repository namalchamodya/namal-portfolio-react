import React from 'react';
import BlackHoleBackground from './BlackHoleBackground/BlackHoleBackground';
const Home = () => {
  return (
    <section id="home" className="section">
      <BlackHoleBackground />
      
      <div className="home-content fade-in">
        <div className="text-reveal">
          <h1>
            NAMAL
            <br />
            CHAMODYA<span>.</span>
          </h1>
        </div>
        <div className="subtitle">
          <p>CREATIVE DEVELOPER & DESIGNER</p>
        </div>
        <div className="home-description">
          <p>Crafting immersive digital experiences through code and design.</p>
        </div>
        <div className="cta-buttons">
          <a href="#projects" className="btn primary-btn">View Projects</a>
          <a href="#contact" className="btn secondary-btn">Get In Touch</a>
        </div>
      </div>
      <div className="scroll-indicator">
        <p>SCROLL DOWN</p>
        <div className="scroll-arrow">
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>
    </section>
  );
};

export default Home;