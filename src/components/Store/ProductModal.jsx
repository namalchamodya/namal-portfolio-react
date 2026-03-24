import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useAuth } from '../Auth/AuthContext';
import '../../styles/store.css';

const ProductModal = ({ product, onClose }) => {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    onClose();
  };

  const handleChatNow = () => {
    const userInfo = user ? `\n\n*Customer Info:*\nName: ${user.user_metadata?.full_name || user.email}` : '';
    const message = `Hi Namal, I am interested in buying: *${product.name}* (${product.price}).${userInfo}\n\nCould you please provide more details?`;
    window.open(`https://wa.me/94770311025?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Modal Content (Stop click propagation so clicking inside doesn't close it) */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button Icon */}
        <button className="modal-close-btn" onClick={onClose}>
          ✖
        </button>

        <div className="modal-body">
          
          {/* Left: Images */}
          <div className="modal-gallery">
            <div className="modal-main-img">
              <img src={mainImage} alt={product.name} />
            </div>
            <div className="modal-thumbnails">
              {product.images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt="thumb" 
                  className={mainImage === img ? 'active' : ''}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Right: Details (Centered Text) */}
          <div className="modal-info">
            <span className="modal-cat">{product.category}</span>
            <h2>{product.name}</h2>
            <h3 className="modal-price">{product.price}</h3>
            
            <p className="modal-desc">{product.description}</p>

            <div className="modal-features">
              <h4>Key Features:</h4>
              <ul>
                {product.features.map((feat, i) => <li key={i}>{feat}</li>)}
              </ul>
            </div>

            <div className="modal-actions">
              <button className="btn-buy-now" onClick={handleAddToCart}>
                 Add to Cart
              </button>
              <button className="btn-chat" onClick={handleChatNow}>Chat on WhatsApp</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductModal;