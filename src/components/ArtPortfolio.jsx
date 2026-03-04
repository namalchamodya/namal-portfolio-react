import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/artportfolio.css';
import LandingFooter from './Landing/LandingFooter';

const ARTWORKS = [
  { id: 1, type: 'graphic', src: process.env.PUBLIC_URL + '/art/digital-art.png', title: 'Digital Art Package', price: '$50' },
  { id: 2, type: 'pencil', src: process.env.PUBLIC_URL + '/art/pencil-art.jpg', title: 'Pencil Drawing', price: '$30' },
  { id: 3, type: 'graphic', src: process.env.PUBLIC_URL + '/art/Namal_ict.png', title: 'Social Media Flyer', price: '$30' },
  { id: 4, type: 'graphic', src: process.env.PUBLIC_URL + '/art/all designs.jpg', title: 'Social Media Kit', price: '$80' },
  { id: 5, type: 'graphic', src: process.env.PUBLIC_URL + '/art/2027 al 2.png', title: 'Social Media Marketing', price: '$100' },
  { id: 6, type: 'pencil', src: process.env.PUBLIC_URL + '/art/art2.png', title: 'Figure Drawing', price: '$30' },
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

  // Helper function to handle WhatsApp redirection
  const handleWhatsApp = (itemTitle = '', isEmail = false) => {
    // If specific email option is needed in logic, it can be handled here, 
    // but default is WhatsApp as requested for buttons.
    const phoneNumber = '94770311025'; // Sri Lanka code +94
    const message = itemTitle 
      ? `Hi, I would like to order/discuss the: ${itemTitle}` 
      : `Hi, I'm interested in your art and designs.`;
    
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="art-page">
      {/* --- Navbar Area --- */}
      <nav className="art-nav">
        <Link to="/" className="art-back-btn">← Home</Link>
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
          <button className="cta-button" onClick={() => handleWhatsApp('General Art Inquiry')}>
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
                <button className="buy-btn" onClick={() => handleWhatsApp(item.title)}>
                  Buy Now
                </button>
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
            <button className="price-btn" onClick={() => handleWhatsApp('Pencil Sketch Package ($30)')}>
              Order Now
            </button>
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
            <button className="price-btn white-btn" onClick={() => handleWhatsApp('Graphic Design Package ($100)')}>
              Get Started
            </button>
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
            <button className="price-btn" onClick={() => handleWhatsApp('Full Portfolio Bundle ($250)')}>
              Contact Me
            </button>
          </div>
        </div>
      </section>

      {/* --- Contact Section --- */}
      <section className="art-contact">
        <div className="contact-box">
          <h2>Ready to make something amazing?</h2>
          <p>Let's collaborate on your next project.</p>
          {/* Option to send WhatsApp message provided here, matching the other buttons */}
          <button 
            className="big-contact-btn" 
            onClick={() => handleWhatsApp('New Project Collaboration')}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', textDecoration: 'underline' }}
          >
            Let's Create ➔
          </button>
          <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
             Or email: <a href="mailto:namalcg12@gmail.com" style={{ color: '#fff' }}>namalcg12@gmail.com</a>
          </div>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
};

export default ArtPortfolio;