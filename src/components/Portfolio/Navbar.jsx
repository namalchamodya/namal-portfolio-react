import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// 👇 මෙන්න වෙනස්කම: පියවර දෙකක් ආපස්සට යන්න ඕනේ (../../)
import useNavScroll from '../../hooks/useNavScroll';

const Navbar = () => {
  const { scrolled, menuOpen, toggleMenu, closeMenu } = useNavScroll();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '/courses', label: 'Courses' }, 
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' }
  ];

  const handleNavigation = (e, targetHref) => {
    e.preventDefault();
    closeMenu();

    if (targetHref.startsWith('/')) {
      navigate(targetHref);
    } 
    else if (targetHref.startsWith('#')) {
      if (location.pathname !== '/portfolio') {
        navigate('/portfolio');
        setTimeout(() => {
          const id = targetHref.replace('#', '');
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        const id = targetHref.replace('#', '');
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="logo">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
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
            <a href={l.href} onClick={(e) => handleNavigation(e, l.href)}>
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