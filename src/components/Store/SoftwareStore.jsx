import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SOFTWARE_DATA } from './data/softwareData';
import StoreNavbar from './StoreNavbar';
import LandingFooter from '../Landing/LandingFooter';
import ProductModal from './ProductModal';
import '../../styles/store.css';

const SoftwareStore = () => {
  const [items, setItems] = useState(SOFTWARE_DATA);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['All', ...new Set(SOFTWARE_DATA.map(item => item.category))];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Set page title
    document.title = "Namal Chamodya | Software Store";

    let filtered = SOFTWARE_DATA;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setItems(filtered);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="store-page">
      <StoreNavbar />

      {/* Unique Header for Software */}
      <div className="store-header" style={{alignItems: 'center', padding: '40px 20px', textAlign: 'center', color: '#fff'}}>
        <h2>Digital <span className="highlight">Software</span></h2>
        <p>Premium Applications, Source Codes, and Web Templates.</p>
      </div>

      <div className="store-layout">
        
        {/* Sidebar */}
        <aside className="store-sidebar">
          <div className="filter-box">
            <h3 className="filter-title">Search Software</h3>
            <input 
              type="text" className="search-input" placeholder="Find apps, scripts..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-box">
            <h3 className="filter-title">Categories</h3>
            <ul className="category-list">
              {categories.map((cat, index) => (
                <li 
                  key={index} 
                  className={selectedCategory === cat ? 'active' : ''}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="store-products">
          <div className="products-grid">
            {items.length > 0 ? (
              items.map((item) => (
                <div 
                  key={item.id} 
                  className="prod-card" 
                  onClick={() => setSelectedProduct(item)}
                >
                  <span className="prod-badge" style={{backgroundColor: '#007bff', color: '#fff'}}>
                    {item.category}
                  </span>
                  
                  <div className="prod-image">
                    <img src={item.images[0]} alt={item.name} />
                  </div>
                  
                  <div className="prod-details">
                    <h3 className="prod-title">{item.name}</h3>
                    <p style={{fontSize:'0.8rem', color:'#888', marginBottom:'10px'}}>Version: {item.version}</p>
                    
                    <div className="prod-footer">
                      <span className="price">{item.price}</span>
                      <button className="btn-add" style={{background:'#007bff', color:'#fff'}}>View Details</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{color:'#aaa', width:'100%'}}>No software found.</div>
            )}
          </div>
        </main>

      </div>

      <LandingFooter />

      {/* Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

    </div>
  );
};

export default SoftwareStore;