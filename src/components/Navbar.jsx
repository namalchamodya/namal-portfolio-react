import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useNavScroll from '../hooks/useNavScroll';

const Navbar = () => {
  const { scrolled, menuOpen, toggleMenu, closeMenu } = useNavScroll();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '/courses', label: 'Courses' }, // 👈 මෙන්න අලුත් ලින්ක් එක
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' }
  ];

  const handleNavigation = (e, targetHref) => {
    e.preventDefault();
    closeMenu();

    // 1. පිටුවකට යන ලින්ක් එකක් නම් (උදා: /courses)
    if (targetHref.startsWith('/')) {
      navigate(targetHref);
    } 
    // 2. Scroll ලින්ක් එකක් නම් (උදා: #about)
    else if (targetHref.startsWith('#')) {
      // Home Page එකේ නැත්නම්, මුලින්ම Home එකට යන්න
      if (location.pathname !== '/') {
        navigate('/');
        // පිටුව මාරු වීමට පොඩි වෙලාවක් දීලා Scroll කරන්න
        setTimeout(() => {
          const id = targetHref.replace('#', '');
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        // දැනටමත් Home එකේ නම් කෙලින්ම Scroll කරන්න
        const id = targetHref.replace('#', '');
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="logo">
        <a href="#home" onClick={(e) => handleNavigation(e, '#home')}>
          NC<span>.</span>
        </a>
      </div>

      <div className="nav-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
        <span></span>
        <span></span>
      </div>

      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        {navLinks.map((l, index) => (
          <li key={index}>
            <a 
              href={l.href} 
              onClick={(e) => handleNavigation(e, l.href)}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="social-icons">
        <a href="https://github.com/namalchamodya" target="_blank" rel="noreferrer">
          <i className="fab fa-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/namalchamodya" target="_blank" rel="noreferrer">
          <i className="fab fa-linkedin"></i>
        </a>
        <a href="https://www.instagram.com/na_mal_chamo_d_ya/" target="_blank" rel="noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;