import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/artportfolio.css';
import LandingFooter from './Landing/LandingFooter';


const ARTWORKS = [
  { id: 1, type: 'graphic', src: process.env.PUBLIC_URL + '/art/digital-art.png', title: 'Brand Identity', price: '$50' },
  { id: 2, type: 'pencil', src: process.env.PUBLIC_URL + '/art/pencil-art.jpg', title: 'Portrait Sketch', price: '$30' },
  { id: 3, type: 'graphic', src: process.env.PUBLIC_URL + '/art/Namal_ict.png', title: 'Social Media Kit', price: '$80' },
  { id: 4, type: 'graphic', src: process.env.PUBLIC_URL + '/art/all designs.jpg', title: 'Realistic Eye', price: '$45' },
  { id: 5, type: 'graphic', src: process.env.PUBLIC_URL + '/art/2027 al 2.png', title: 'Logo Concept', price: '$100' },
  { id: 6, type: 'pencil', src: process.env.PUBLIC_URL + '/art/art2.png', title: 'Figure Drawing', price: '$40' },
];

const ArtPortfolio = () => {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Set page title
    document.title = "Namal Chamodya | Art & Designs";
    
    window.scrollTo(0, 0);
  }, []);

  const filteredArt = filter === 'all' 
    ? ARTWORKS 
    : ARTWORKS.filter(art => art.type === filter);

  return (
    <div className="art-page">
      {/* --- Navbar Area --- */}
      <nav className="art-nav">
        <Link to="/" className="art-back-btn">← Back to Home</Link>
        <h2>NC<span>.ART</span></h2>
      </nav>

      {/* --- Hero Section --- */}
      <header className="art-hero">
        <div className="art-hero-content">
          <h1>Curious What I've <span className="highlight">Created?</span></h1>
          <p>Blending clarity and creativity. Explore my gallery of graphic designs and traditional pencil drawings.</p>
          <div className="art-stats">
            <div>
              <h3>50+</h3>
              <span>Projects</span>
            </div>
            <div>
              <h3>20+</h3>
              <span>Happy Clients</span>
            </div>
          </div>
          <button className="cta-button" onClick={() => document.getElementById('pricing').scrollIntoView()}>
            Buy Art & Designs
          </button>
        </div>
        <div className="art-hero-image">
           <img src={process.env.PUBLIC_URL + '/art.png'} alt="Hero Art" />
        </div>
      </header>

      {/* --- Gallery Section --- */}
      <section className="art-gallery">
        <div className="gallery-header">
          <h3>Selected Work</h3>
          <div className="filter-tabs">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
            <button className={filter === 'graphic' ? 'active' : ''} onClick={() => setFilter('graphic')}>Graphic Design</button>
            <button className={filter === 'pencil' ? 'active' : ''} onClick={() => setFilter('pencil')}>Pencil Arts</button>
          </div>
        </div>

        <div className="gallery-grid">
          {filteredArt.map((item) => (
            <div key={item.id} className="gallery-item fade-in-up">
              <img src={item.src} alt={item.title} />
              <div className="item-overlay">
                <h4>{item.title}</h4>
                <p>{item.price}</p>
                <button className="buy-btn">Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Pricing / Offers Section (Reference Image Style) --- */}
      <section id="pricing" className="art-pricing">
        <div className="section-title">
          <h3>Simple Packages for <span className="highlight">Every Stage</span></h3>
          <p>Choose the perfect plan for your creative needs.</p>
        </div>

        <div className="pricing-cards">
          {/* Card 1: Basic */}
          <div className="price-card">
            <h4>Pencil Sketch</h4>
            <h2>$30<span>/ start</span></h2>
            <ul>
              <li>High Quality Scan</li>
              <li>A4 / A3 Size</li>
              <li>Realistic Shading</li>
            </ul>
            <button className="price-btn">Order Now</button>
          </div>

          {/* Card 2: Featured (Orange) */}
          <div className="price-card featured">
            <div className="popular-badge">Most Popular</div>
            <h4>Graphic Design</h4>
            <h2>$100<span>/ project</span></h2>
            <ul>
              <li>Logo & Branding</li>
              <li>Social Media Posts</li>
              <li>Unlimited Revisions</li>
              <li>Source Files Included</li>
            </ul>
            <button className="price-btn white-btn">Get Started</button>
          </div>

          {/* Card 3: Premium */}
          <div className="price-card">
            <h4>Full Portfolio</h4>
            <h2>$250<span>/ bundle</span></h2>
            <ul>
              <li>Custom Illustrations</li>
              <li>Commercial Rights</li>
              <li>Priority Support</li>
            </ul>
            <button className="price-btn">Contact Me</button>
          </div>
        </div>
      </section>

      {/* --- Contact Section --- */}
      <section className="art-contact">
        <div className="  -box">
          <h2>Ready to make something amazing?</h2>
          <p>Let's collaborate on your next project.</p>
          <a href="mailto:namalcg12@gmail.com" className="big-contact-btn">
            Let's Create ➔
          </a>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
};

export default ArtPortfolio;