import React from 'react';
import useNavScroll from '../hooks/useNavScroll';

const Navbar = () => {
  const { scrolled, menuOpen, toggleMenu, closeMenu } = useNavScroll();

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#home', label: 'Courses' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="logo">
        <a href="#home">NC<span>.</span></a>
      </div>

      <div className="nav-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
        <span></span>
        <span></span>
      </div>

      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        {navLinks.map((l) => (
          <li key={l.href}>
            <a href={l.href} onClick={closeMenu}>{l.label}</a>
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
