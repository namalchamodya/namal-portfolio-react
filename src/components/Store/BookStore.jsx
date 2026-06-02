import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';

import LandingFooter from '../Landing/LandingFooter';
import ProductModal from './ProductModal';
import StoreTabs from './StoreTabs';
import '../../styles/store.css';

const BookStore = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Scroll to top and fetch data on load
  useEffect(() => {
    document.title = "Namal Chamodya | Knowledge Base";
    window.scrollTo(0, 0);

    const fetchBooksData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (data && !error) {
          const bookCats = ['Books', 'Tutes', 'Past Papers', 'Model Papers', 'Monthly Tests'];
          const filteredBooks = data.filter(item => bookCats.includes(item.category));
          setAllProducts(filteredBooks);
          setItems(filteredBooks);
        } else if (error) {
          console.error("Error query books:", error.message);
        }
      } catch (err) {
        console.error("Error fetching books:", err);
      }
      setLoading(false);
    };

    fetchBooksData();
  }, []);

  // Filter Logic
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

  // Click Handler
  const handleItemClick = (item) => {
    if (item.type === 'paper') {
      if (item.downloadLink && item.downloadLink !== '#') {
        window.open(item.downloadLink, '_blank');
      } else {
        alert("Download link not available yet.");
      }
    } else {
      setSelectedProduct(item);
    }
  };

  return (
    <div className="store-page">


      {/* Hero Header */}
      <div className="store-header" style={{alignItems: 'center', padding: '40px 20px', textAlign: 'center'}}>
        <h2>Knowledge <span className="highlight">Base</span></h2>
        <p>E-Books, Study Materials, and Research Publications.</p>
      </div>

      <StoreTabs />

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

          {/* Main Categories */}
          <div className="filter-box">
            <h3 className="filter-title">Materials</h3>
            <ul className="category-list">
              <li className={selectedCategory === 'All' ? 'active' : ''} onClick={() => setSelectedCategory('All')}>All Materials</li>
              <li className={selectedCategory === 'Books' ? 'active' : ''} onClick={() => setSelectedCategory('Books')}>📚 Books</li>
              <li className={selectedCategory === 'Tutes' ? 'active' : ''} onClick={() => setSelectedCategory('Tutes')}>📝 Tutes</li>
            </ul>
          </div>

          {/* Paper Categories (Separated as requested) */}
          <div className="filter-box">
            <h3 className="filter-title">Exam Papers</h3>
            <ul className="category-list">
              <li className={selectedCategory === 'Past Papers' ? 'active' : ''} onClick={() => setSelectedCategory('Past Papers')}>📄 Past Papers</li>
              <li className={selectedCategory === 'Model Papers' ? 'active' : ''} onClick={() => setSelectedCategory('Model Papers')}>📑 Model Papers</li>
              <li className={selectedCategory === 'Monthly Tests' ? 'active' : ''} onClick={() => setSelectedCategory('Monthly Tests')}>📊 Monthly Tests</li>
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="store-products">
          
          {/* Dynamic Title */}
          <h2 style={{color:'#fff', marginBottom:'20px', borderLeft:'4px solid #ffc107', paddingLeft:'15px'}}>
            {selectedCategory === 'All' ? 'All Resources' : selectedCategory}
          </h2>

          <div className="products-grid">
            {loading ? (
              <div style={{ color: '#fff', width: '100%', padding: '20px', textAlign: 'center', gridColumn: '1/-1' }}>
                <h3>Loading resources...</h3>
              </div>
            ) : items.length > 0 ? (
              items.map((item) => (
                <div 
                  key={item.id} 
                  className="prod-card" 
                  onClick={() => handleItemClick(item)}
                >
                  <span className="prod-badge" style={{
                      backgroundColor: item.type === 'paper' ? '#007bff' : 
                                       item.category === 'Tutes' ? '#28a745' : '#ffc107',
                      color: '#fff'
                  }}>
                    {item.category}
                  </span>
                  
                  <div className="prod-image">
                    <img src={item.images[0]} alt={item.name} />
                  </div>
                  
                  <div className="prod-details">
                    <h3 className="prod-title">{item.name}</h3>
                    
                    <div className="prod-footer">
                      <span className="price">{item.price}</span>
                      <button className="btn-add">
                        {item.type === 'paper' ? 'Download ⬇' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{color:'#aaa', width:'100%', padding:'20px'}}>
                <h3>No items found in this category.</h3>
              </div>
            )}
          </div>
        </main>

      </div>

      <LandingFooter />

      {/* Modal for Books/Tutes */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

    </div>
  );
};

export default BookStore;