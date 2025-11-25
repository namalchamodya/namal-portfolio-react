import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Footer from './components/Footer';

// Import Pages
import MainContent from './components/MainContent';
import ThreeDGallery from './components/ThreeD/ThreeDGallery';
import ArtPortfolio from './components/ArtPortfolio'; // 👈 අලුත් පිටුව Import කළා

// Styles & Scripts
import { setupGSAP } from './utils/gsapSetup';
import BlackHoleBackground from './components/BlackHoleBackground/BlackHoleBackground.jsx';
import './styles/blackhole.css';
import './styles/style.css';

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // 1. Loader Logic
    const t = setTimeout(() => setLoading(false), 1200);

    // 2. GSAP Animation Setup
    // Scroll එක උඩටම ගන්නවා route එක මාරු වුනාම
    const animationTimer = setTimeout(() => {
      setupGSAP();
      window.scrollTo(0, 0);
    }, 100);

    return () => {
      clearTimeout(t);
      clearTimeout(animationTimer);
    };
  }, [location.pathname]);

  // 👇 විශේෂිත පිටු හඳුනාගැනීම (Black Hole අවශ්‍ය නැති පිටු)
  const isSpecialPage = 
    location.pathname === '/3d-projects' || 
    location.pathname === '/art-portfolio';

  return (
    <>
      {/* 'isSpecialPage' එක බොරු (false) නම් විතරක් Black Hole එක පෙන්වන්න.
         ඒ කියන්නේ 3D සහ Art පිටු වලදී Black Hole එක පේන්නේ නෑ.
      */}
      {!isSpecialPage && <BlackHoleBackground />}

      {loading && <Loader />}
      <Cursor />

      <Routes>
        {/* Main Home Page */}
        <Route path="/" element={<MainContent />} />
        
        {/* 3D Gallery Page */}
        <Route path="/3d-projects" element={<ThreeDGallery />} />

        {/* 👇 අලුත් Art Portfolio Page Route එක */}
        <Route path="/art-portfolio" element={<ArtPortfolio />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;