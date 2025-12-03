import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ELECTRONICS_DATA } from './data/electronicsData';
import StoreNavbar from './StoreNavbar';
import LandingFooter from '../Landing/LandingFooter';
import ProductModal from './ProductModal'; // 👈 Import Modal
import '../../styles/store.css';

const ElectronicsStore = () => {
  const [items, setItems] = useState(ELECTRONICS_DATA);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['All', ...new Set(ELECTRONICS_DATA.map(item => item.category))];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let filtered = ELECTRONICS_DATA;
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
      
      {/* 1. New Navbar */}
      <StoreNavbar />

      <div className="store-layout">
        
        {/* Sidebar Filters */}
        <aside className="store-sidebar">
          <div className="filter-box">
            <h3 className="filter-title">Search</h3>
            <input 
              type="text" 
              className="search-input"
              placeholder="Search items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <h3 className="filter-title">Category</h3>
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
                // 👇 Click කළාම Modal එක ඕපන් කරනවා
                <div 
                  key={item.id} 
                  className="prod-card" 
                  onClick={() => setSelectedProduct(item)}
                >
                  <span className="prod-badge">{item.category}</span>
                  
                  <div className="prod-image">
                    <img src={item.images[0]} alt={item.name} />
                  </div>
                  
                  <div className="prod-details">
                    <h3 className="prod-title">{item.name}</h3>
                    <div className="prod-rating">⭐⭐⭐⭐⭐</div>
                    
                    <div className="prod-footer">
                      <span className="price">{item.price}</span>
                      <button className="btn-add">View</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{color:'#aaa', width:'100%'}}>No items found.</div>
            )}
          </div>
        </main>

      </div>

      <LandingFooter />

      {/* 👇 Modal Popup Component */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

    </div>
  );
};

export default ElectronicsStore;