import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from '../Auth/AuthContext';
import StoreNavbar from './StoreNavbar';
import LandingFooter from '../Landing/LandingFooter';
import '../../styles/store.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);

  React.useEffect(() => {
    document.title = 'Namal Chamodya | Cart';
    window.scrollTo(0, 0);
  }, []);

  /* ── helpers ── */
  const getSubtotal = () => {
    let total = 0;
    cartItems.forEach(item => {
      const priceVal = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
      if (!isNaN(priceVal)) total += priceVal * item.quantity;
    });
    return total;
  };

  const handleWhatsApp = () => {
    if (cartItems.length === 0) return;

    const lines = cartItems
      .map((item, i) => `${i + 1}. *${item.name}* (Qty: ${item.quantity}) — ${item.price}`)
      .join('\n');

    const userInfo = user
      ? `\n\n*Customer Info:*\nName: ${user.user_metadata?.full_name || user.email}`
      : '\n\n*Customer:* Guest (not logged in)';

    const estLine =
      getSubtotal() > 0 ? `\n\n*Estimated Total:* LKR ${getSubtotal().toLocaleString()}` : '';

    const msg = `Hi Namal, I'd like to place an order:\n\n${lines}${estLine}${userInfo}\n\nPlease confirm the total and payment details. Thank you!`;

    window.open(`https://wa.me/94770311025?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(true);
  };

  /* ── empty cart state ── */
  if (cartItems.length === 0 && !sent) {
    return (
      <div className="store-page">
        <StoreNavbar />
        <div className="cart-page-empty">
          <div className="cart-page-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>Add some items from our store first.</p>
          <button className="cart-page-back-btn" onClick={() => navigate('/store/electronics')}>
            Browse Store
          </button>
        </div>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="store-page">
      <StoreNavbar />

      <div className="cart-page-wrapper">
        {/* ─── Header ─── */}
        <div className="cart-page-header">
          <div>
            <h1 className="cart-page-title">
              Your <span className="highlight">Cart</span>
            </h1>
            <p className="cart-page-subtitle">
              {cartItems.reduce((a, i) => a + i.quantity, 0)} item
              {cartItems.reduce((a, i) => a + i.quantity, 0) !== 1 ? 's' : ''} ready to order
            </p>
          </div>
          <button className="cart-page-continue" onClick={() => navigate(-1)}>
            ← Continue Shopping
          </button>
        </div>

        <div className="cart-page-body">
          {/* ─── Items ─── */}
          <div className="cart-page-items">
            {cartItems.map(item => (
              <div key={item.id} className="cpi-card">
                <div className="cpi-img-wrap">
                  <img src={item.images?.[0] || ''} alt={item.name} className="cpi-img" />
                </div>

                <div className="cpi-info">
                  <span className="cpi-category">{item.category}</span>
                  <h3 className="cpi-name">{item.name}</h3>
                  <span className="cpi-unit-price">Unit price: {item.price}</span>
                </div>

                <div className="cpi-controls">
                  <div className="cpi-quantity">
                    <button
                      className="cpi-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="cpi-qty-val">{item.quantity}</span>
                    <button
                      className="cpi-qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <span className="cpi-line-total">
                    {(() => {
                      const v = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
                      return isNaN(v)
                        ? item.price
                        : `LKR ${(v * item.quantity).toLocaleString()}`;
                    })()}
                  </span>

                  <button className="cpi-remove" onClick={() => removeFromCart(item.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Clear all */}
            <button className="cart-page-clear" onClick={clearCart}>
              Clear all items
            </button>
          </div>

          {/* ─── Summary ─── */}
          <aside className="cart-page-summary">
            <h2 className="cps-title">Order Summary</h2>

            <div className="cps-rows">
              {cartItems.map(item => (
                <div key={item.id} className="cps-row">
                  <span className="cps-row-name">
                    {item.name} ×{item.quantity}
                  </span>
                  <span className="cps-row-price">
                    {(() => {
                      const v = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
                      return isNaN(v)
                        ? item.price
                        : `LKR ${(v * item.quantity).toLocaleString()}`;
                    })()}
                  </span>
                </div>
              ))}
            </div>

            <div className="cps-divider" />

            {getSubtotal() > 0 && (
              <div className="cps-total">
                <span>Estimated Total</span>
                <span className="cps-total-val">LKR {getSubtotal().toLocaleString()}</span>
              </div>
            )}

            <p className="cps-note">
              Final price will be confirmed on WhatsApp. Prices may vary based on availability.
            </p>

            <button
              className="cps-checkout-btn"
              onClick={handleWhatsApp}
              disabled={cartItems.length === 0}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Send Order via WhatsApp
            </button>

            {sent && (
              <p className="cps-sent-msg">
                ✅ Message opened! Check WhatsApp to complete your order.
              </p>
            )}
          </aside>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
};

export default CartPage;
