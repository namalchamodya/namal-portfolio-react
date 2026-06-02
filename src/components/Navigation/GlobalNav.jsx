import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../Store/CartContext';
import LoginProfileButton from '../Auth/LoginProfileButton';
import '../../styles/globalNav.css';

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

const NavIcon = ({ d, d2 }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', marginRight: '10px' }}>
        <path d={d} />
        {d2 && <path d={d2} />}
    </svg>
);

const Icons = {
    Home: () => <NavIcon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" d2="M9 22V12h6v10" />,
    Course: () => <NavIcon d="M22 10v6M2 10l10-5 10 5-10 5z" d2="M6 12v5c3 3 9 3 12 0v-5" />,
    Book: () => <NavIcon d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" d2="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />,
    Store: () => <NavIcon d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" d2="M20 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />,
    Art: () => <NavIcon d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.68-.27-1.3-.7-1.75-.44-.45-.44-1.15.01-1.6.43-.43 1.03-.65 1.63-.65H18c2.76 0 5-2.24 5-5 0-4.42-4.93-8-11-8zm-4.5 9c-.83 0-1.5-.67-1.5-1.5S6.67 8 7.5 8 9 8.67 9 9.5 8.33 11 7.5 11zm4.5-4c-.83 0-1.5-.67-1.5-1.5S11.17 4 12 4s1.5.67 1.5 1.5S12.83 7 12 7zm4.5 4c-.83 0-1.5-.67-1.5-1.5S15.17 8 16 8s1.5.67 1.5 1.5S16.83 11 16 11z" />,
    Blog: () => <NavIcon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" d2="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />,
    Briefcase: () => <NavIcon d="M16 21v-2a4 4 0 0 0-4-4H5c-1.1 0-2 .9-2 2v2" d2="M21 8H3v10c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8zm-9 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" />,
    Phone: () => <NavIcon d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
    Software: () => <NavIcon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" d2="M2 10h20M12 2v20" />,
    Electronics: () => <NavIcon d="M18 10h3M18 14h3M3 10h3M3 14h3M10 3v3M14 3v3M10 18v3M14 18v3" d2="M8 8h8v8H8z" />,
    Box3D: () => <NavIcon d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" d2="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />,
    Exam: () => <NavIcon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" d2="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
};

const GlobalNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Cart Context (safe to use globally because CartProvider wraps the app, assuming it does)
    const { cartItems } = useCart();
    const totalQty = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                closeMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleScrollToContact = (e) => {
        e.preventDefault();
        closeMenu();

        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        } else {
            const contactSection = document.getElementById('contact');
            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Determine current section to show contextual links
    const isStore = location.pathname.startsWith('/store');
    const isCourses = location.pathname.startsWith('/course');
    const isLanding = location.pathname === '/';
    const isArts = location.pathname.startsWith('/3d-projects') || location.pathname.startsWith('/art-portfolio');

    return (
        <nav className="global-navbar" ref={navRef}>
            <div className="global-nav-container">
                {/* Mobile Hamburger */}
                <div className="global-menu-icon" onClick={toggleMenu}>
                    <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
                    <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
                    <span className={isMenuOpen ? 'bar open' : 'bar'}></span>
                </div>

                {/* Logo */}
                <Link to="/" className="global-logo" onClick={closeMenu}>
                    NC<span className="highlight">.</span>
                </Link>

                {/* Desktop Global Links */}
                <ul className="global-desktop-links">
                    <li><Link to="/">Home</Link></li>
                    <li className="dropdown-trigger">
                        <Link to="/courses?tab=all">Courses ▼</Link>
                        <ul className="global-dropdown">
                            <li><Link to="/courses?tab=all">All Courses</Link></li>
                            <li><Link to="/courses?tab=my">My Courses</Link></li>
                            <li><Link to="/courses?tab=exams">Exams</Link></li>
                        </ul>
                    </li>
                    <li className="dropdown-trigger">
                        <Link to="/art-portfolio">Arts & 3D ▼</Link>
                        <ul className="global-dropdown">
                            <li><Link to="/3d-projects">3D Gallery</Link></li>
                            <li><Link to="/art-portfolio">Digital Arts</Link></li>
                        </ul>
                    </li>
                    <li className="dropdown-trigger">
                        <Link to="/store/electronics">Store ▼</Link>
                        <ul className="global-dropdown">
                            <li><Link to="/store/electronics">Electronics</Link></li>
                            <li><Link to="/store/software">Software</Link></li>
                            <li><Link to="/store/books">Books</Link></li>
                        </ul>
                    </li>
                    <li><Link to="/blog">Blog</Link></li>
                </ul>

                {/* Right Side Actions */}
                <div className="global-nav-actions">
                    {isStore && (
                        <button className="cart-icon-btn" onClick={() => navigate('/store/cart')}>
                            <CartIcon />
                            {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
                        </button>
                    )}
                    <LoginProfileButton />
                </div>
            </div>

            {/* Side Panel for Mobile/Desktop Drawer */}
            <div className={`global-side-panel ${isMenuOpen ? 'open' : ''}`}>
                <div className="side-panel-header">
                    <h2>Menu</h2>
                    <button className="close-btn" onClick={closeMenu}>&times;</button>
                </div>
                
                <div className="side-panel-content">
                    {/* Contextual Sub-links based on current route */}
                    {isStore && (
                        <div className="side-panel-section">
                            <h3>Store Categories</h3>
                            <Link to="/store/electronics" onClick={closeMenu} className={location.pathname.includes('electronics') ? 'active' : ''}><Icons.Electronics /> Electronics</Link>
                            <Link to="/store/software" onClick={closeMenu} className={location.pathname.includes('software') ? 'active' : ''}><Icons.Software /> Software</Link>
                            <Link to="/store/books" onClick={closeMenu} className={location.pathname.includes('books') ? 'active' : ''}><Icons.Book /> Books</Link>
                        </div>
                    )}
                    
                    {(isLanding || isArts) && (
                        <div className="side-panel-section">
                            <h3>Arts & 3D</h3>
                            <Link to="/3d-projects" onClick={closeMenu} className={location.pathname.includes('3d-projects') ? 'active' : ''}><Icons.Box3D /> 3D Gallery</Link>
                            <Link to="/art-portfolio" onClick={closeMenu} className={location.pathname.includes('art-portfolio') ? 'active' : ''}><Icons.Art /> Digital Arts</Link>
                        </div>
                    )}

                    {isCourses && (
                        <div className="side-panel-section">
                            <h3>Courses</h3>
                            <Link to="/courses?tab=all" onClick={closeMenu} className={location.search.includes('tab=all') || (!location.search && location.pathname === '/courses') ? 'active' : ''}><Icons.Course /> All Courses</Link>
                            <Link to="/courses?tab=my" onClick={closeMenu} className={location.search.includes('tab=my') ? 'active' : ''}><Icons.Book /> My Courses</Link>
                            <Link to="/courses?tab=exams" onClick={closeMenu} className={location.search.includes('tab=exams') ? 'active' : ''}><Icons.Exam /> Exams</Link>
                        </div>
                    )}

                    {/* General Links */}
                    <div className="side-panel-section">
                        <h3>Main Menu</h3>
                        <Link to="/" onClick={closeMenu} className={location.pathname === '/' ? 'active' : ''}><Icons.Home /> Home</Link>
                        <Link to="/courses" onClick={closeMenu} className={location.pathname.startsWith('/course') || location.pathname === '/profile' || location.pathname === '/exams' ? 'active' : ''}><Icons.Course /> Education</Link>
                        <Link to="/store/electronics" onClick={closeMenu} className={location.pathname.startsWith('/store') ? 'active' : ''}><Icons.Store /> Store</Link>
                        <Link to="/blog" onClick={closeMenu} className={location.pathname === '/blog' ? 'active' : ''}><Icons.Blog /> Blog</Link>
                        <Link to="/portfolio" onClick={closeMenu}><Icons.Briefcase /> Portfolio</Link>
                        <a href="#contact" onClick={handleScrollToContact}><Icons.Phone /> Contact Me</a>
                    </div>
                </div>
            </div>

            {/* Backdrop overlay */}
            {isMenuOpen && <div className="menu-backdrop" onClick={closeMenu}></div>}
        </nav>
    );
};

export default GlobalNav;
