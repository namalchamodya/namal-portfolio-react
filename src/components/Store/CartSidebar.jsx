import React from 'react';
import { useCart } from './CartContext';
import { useAuth } from '../Auth/AuthContext';
import '../../styles/store.css';

const CartSidebar = () => {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();

  // Simple string formatter for WhatsApp since prices might be LKR 1,200 as text
  const getSubtotal = () => {
    let total = 0;
    cartItems.forEach(item => {
      // Very basic parser just extracting numbers if possible for presentation logic, though string passes
      const priceStr = item.price.toString().replace(/[^0-9.]/g, '');
      const priceVal = parseFloat(priceStr);
      if(!isNaN(priceVal)) total += (priceVal * item.quantity);
    });
    return total;
  };

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let itemsText = cartItems.map((item, index) => {
      return `${index + 1}. *${item.name}* (Qty: ${item.quantity}) - ${item.price}`;
    }).join('\n');

    const userInfo = user ? `\n\n*Customer Info:*\nName: ${user.user_metadata?.full_name || user.email}` : `\n\n*Customer Info:*\nName: Not logged in`;

    const message = `Hi Namal, I would like to place an order for the following items:\n\n${itemsText}${userInfo}\n\nPlease let me know the total amount and payment details.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/94770311025?text=${encodedMessage}`, '_blank');
    
    // Optionally clear cart after checkout
    // clearCart();
  };

  return (
    <>
      <div className={`cart-backdrop ${isCartOpen ? 'open' : ''}`} onClick={toggleCart}></div>
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</h2>
          <button className="cart-close-btn" onClick={toggleCart}>&times;</button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-msg">Your cart is currently empty.</div>
          ) : (
            <ul className="cart-items-list">
              {cartItems.map(item => (
                <li key={item.id} className="cart-item">
                  <img src={item.images?.[0] || ''} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <span className="cart-item-price">{item.price}</span>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>🗑️</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
             <h3>Total (Est.): </h3>
             <h3>LKR {getSubtotal().toLocaleString()}</h3>
          </div>
          <button 
             className="btn-checkout-wa" 
             onClick={handleWhatsAppCheckout}
             disabled={cartItems.length === 0}
             style={{ width: '100%', background: '#25D366', color: '#fff', padding: '15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 'bold' }}
          >
            Checkout with WhatsApp
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;

