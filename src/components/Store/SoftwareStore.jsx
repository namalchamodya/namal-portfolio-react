import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';

import LandingFooter from '../Landing/LandingFooter';
import ProductModal from './ProductModal';
import StoreTabs from './StoreTabs';
import '../../styles/store.css';

const SoftwareStore = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['All', ...new Set(allProducts.map(item => item.category))];

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchSoftwareData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (data && !error) {
          const softwareCats = ['Desktop Apps', 'Web Apps', 'Templates', 'Scripts'];
          const filteredSoftware = data.filter(item => softwareCats.includes(item.category));
          setAllProducts(filteredSoftware);
          setItems(filteredSoftware);
        } else if (error) {
          console.error("Error querying software:", error.message);
        }
      } catch (err) {
        console.error("Error fetching software:", err);
      }
      setLoading(false);
    };

    fetchSoftwareData();
  }, []);

  useEffect(() => {
    // Set page title
    document.title = "Namal Chamodya | Software Store";

    let filtered = allProducts;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setItems(filtered);
  }, [selectedCategory, searchTerm, allProducts]);

  return (
    <div className="store-page">


      {/* Unique Header for Software */}
      <div className="store-header" style={{alignItems: 'center', padding: '40px 20px', textAlign: 'center', color: '#fff'}}>
        <h2>Digital <span className="highlight">Software</span></h2>
        <p>Premium Applications, Source Codes, and Web Templates.</p>
      </div>

      <StoreTabs />

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
            {loading ? (
              <div style={{ color: '#fff', width: '100%', padding: '20px', textAlign: 'center', gridColumn: '1/-1' }}>
                <h3>Loading software...</h3>
              </div>
            ) : items.length > 0 ? (
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