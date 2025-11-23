import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Footer from './components/Footer';

// Import Pages
import MainContent from './components/MainContent';
import ThreeDGallery from './components/ThreeD/ThreeDGallery';

// Styles & Scripts
import { setupGSAP } from './utils/gsapSetup';
import BlackHoleBackground from './components/BlackHoleBackground/BlackHoleBackground.jsx';
import './styles/blackhole.css';
import './styles/style.css';

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // 1. Loader Logic (runs once)
    const t = setTimeout(() => setLoading(false), 1200);

    // 2. GSAP Animation Setup
    // We wrap this in a small timeout to ensure the DOM elements 
    // (like Home, About) are fully rendered before we try to animate them.
    const animationTimer = setTimeout(() => {
      setupGSAP();
      // Force scroll to top on route change to ensure triggers work
      window.scrollTo(0, 0);
    }, 100);

    return () => {
      clearTimeout(t);
      clearTimeout(animationTimer);
    };
  }, [location.pathname]); // 👈 CRITICAL FIX: Re-run when path changes

  return (
    <>
      {/* Persistent Background */}
      <BlackHoleBackground />

      {loading && <Loader />}
      <Cursor />

      <Routes>
        {/* Main Portfolio Page */}
        <Route path="/" element={<MainContent />} />
        
        {/* New 3D Gallery Page */}
        <Route path="/3d-projects" element={<ThreeDGallery />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;