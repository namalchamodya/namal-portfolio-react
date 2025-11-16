import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { setupGSAP } from './utils/gsapSetup';

import BlackHoleBackground from './components/BlackHoleBackground/BlackHoleBackground.jsx';
import './styles/blackhole.css';
import './styles/style.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loader; you can remove delay or hook to actual asset loading
    const t = setTimeout(() => setLoading(false), 1200);
    setupGSAP();
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* 👇 Render background first so it sits behind everything */}
      <BlackHoleBackground />

      {loading && <Loader />}
      <Cursor />
      <Navbar />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <Home />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </div>

      <Footer />
    </>
  );
}

export default App;


