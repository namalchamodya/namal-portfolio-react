import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ELECTRONICS_DATA } from './data/electronicsData';
import { supabase } from '../../supabase';
import StoreNavbar from './StoreNavbar';
import LandingFooter from '../Landing/LandingFooter';
import ProductModal from './ProductModal';
import '../../styles/store.css';

const ElectronicsStore = () => {
  const [items, setItems] = useState([]);
  const [allProducts, setAllProducts] = useState(ELECTRONICS_DATA); // fallback data
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['All', ...new Set(allProducts.map(item => item.category))];

  useEffect(() => {
    // Set page title
    document.title = "Namal Chamodya | Electronics Store";

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Fetch from Supabase
    const fetchStoreData = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (data && data.length > 0 && !error) {
          const nonElectronicsCats = ['Desktop Apps', 'Web Apps', 'Templates', 'Scripts', 'Books', 'Tutes', 'Past Papers', 'Model Papers', 'Monthly Tests'];
          const electronicsData = data.filter(item => !nonElectronicsCats.includes(item.category));
          setAllProducts(electronicsData);
          setItems(electronicsData);
        } else {
          // Fallback if no supabase table configured yet
          setAllProducts(ELECTRONICS_DATA);
          setItems(ELECTRONICS_DATA);
        }
      } catch (err) {
        setAllProducts(ELECTRONICS_DATA);
        setItems(ELECTRONICS_DATA);
      }
    };

    fetchStoreData();
  }, []);

  useEffect(() => {
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

      {/* 1. New Navbar */}
      <StoreNavbar />

      <div className="store-header" style={{ alignItems: 'center', padding: '40px 20px', textAlign: 'center', color: '#fff' }}>
        <h2>Electronics <span className="highlight">Components</span></h2>
        <p>Arduino, Sensors, Modules, PCBs, and DIY Kits.</p>
      </div>

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
              <div style={{ color: '#aaa', width: '100%' }}>No items found.</div>
            )}
          </div>
        </main>

      </div>

      <LandingFooter />

      {/*  Modal Popup Component */}
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