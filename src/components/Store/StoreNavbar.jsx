import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { useCart } from './CartContext';
import LoginProfileButton from '../Auth/LoginProfileButton';
import '../../styles/store.css';

/* Professional shopping-bag SVG icon */
const CartIcon = () => (
    <svg
        className="cart-svg-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);

const StoreNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { cartItems } = useCart();

    const isElectronics = location.pathname.includes('electronics');
    const isBooks = location.pathname.includes('books');
    const isSoftware = location.pathname.includes('software');
    const isCart = location.pathname.includes('cart');

    const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);

    const handleOpenCart = () => {
        setIsMenuOpen(false);
        navigate('/store/cart');
    };

    return (
        <nav className="store-navbar">
            <div className="store-nav-container">

                {/* 1. Mobile Menu Icon (Left) */}
                <div className="store-menu-icon" onClick={toggleMenu}>
                    <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
                    <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
                    <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
                </div>

                {/* 2. Mobile Logo */}
                <Link to="/store/electronics" className="mobile-nav-logo">
                    NC<span className="highlight">.</span> Store
                </Link>

                {/* 2b. Mobile Cart Button */}
                <button
                    className={`mobile-cart-icon-btn ${isCart ? 'cart-active' : ''}`}
                    onClick={handleOpenCart}
                    aria-label="View Cart"
                >
                    <CartIcon />
                    {totalQty > 0 && (
                        <span className="cart-badge">{totalQty}</span>
                    )}
                </button>

                {/* 3. Desktop Navigation */}
                <div className="desktop-nav-items">
                    <div className="nav-left">
                        <button className="btn-back" onClick={() => navigate('/')}>← Home</button>
                    </div>

                    <div className="nav-center">
                        <Link
                            to="/store/electronics"
                            className={`store-nav-link ${isElectronics ? 'active' : ''}`}
                        >
                            Electronics
                        </Link>

                        <Link
                            to="/store/software"
                            className={`store-nav-link ${isSoftware ? 'active' : ''}`}
                        >
                            Software
                        </Link>

                        <Link
                            to="/store/books"
                            className={`store-nav-link ${isBooks ? 'active' : ''}`}
                        >
                            Books
                        </Link>
                    </div>

                    <div className="nav-right" style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                            className={`cart-icon-btn ${isCart ? 'cart-active' : ''}`}
                            onClick={handleOpenCart}
                            aria-label="View Cart"
                        >
                            <CartIcon />
                            {totalQty > 0 && (
                                <span className="cart-badge">{totalQty}</span>
                            )}
                        </button>
                        <LoginProfileButton />
                    </div>
                </div>
            </div>

            {/* 4. Mobile Side Panel */}
            {ReactDOM.createPortal(
                <>
                    <div className={`store-side-panel ${isMenuOpen ? 'open' : ''}`}>
                        <div className="panel-header">
                            <h3>Menu</h3>
                            <button className="close-btn" onClick={toggleMenu}>&times;</button>
                        </div>

                        <div className="panel-links">
                            <Link
                                to="/store/electronics"
                                className={`panel-link ${isElectronics ? 'active' : ''}`}
                                onClick={toggleMenu}
                            >
                                🔌 Electronics
                            </Link>
                            <Link
                                to="/store/software"
                                className={`panel-link ${isSoftware ? 'active' : ''}`}
                                onClick={toggleMenu}
                            >
                                💻 Software
                            </Link>
                            <Link
                                to="/store/books"
                                className={`panel-link ${isBooks ? 'active' : ''}`}
                                onClick={toggleMenu}
                            >
                                📚 Books
                            </Link>
                        </div>

                        <div className="panel-actions">
                            <button
                                className="btn-back full-width"
                                onClick={handleOpenCart}
                                style={{ marginBottom: '10px', background: '#ffc107', color: '#000', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <CartIcon />
                                View Cart {totalQty > 0 ? `(${totalQty})` : ''}
                            </button>
                            <LoginProfileButton />
                            <button className="btn-back full-width" onClick={() => { navigate('/'); setIsMenuOpen(false); }}>
                                ← Back to Home
                            </button>
                        </div>
                    </div>

                    {isMenuOpen && <div className="menu-backdrop" onClick={toggleMenu}></div>}
                </>,
                document.body
            )}
        </nav>
    );
};

export default StoreNavbar;