import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Footer from './components/Footer';

// Import Pages
import MainContent from './components/MainContent';
import ThreeDGallery from './components/ThreeD/ThreeDGallery';
import ArtPortfolio from './components/ArtPortfolio';
import CoursesLanding from './components/Courses/CoursesLanding';

// Styles & Scripts
import { setupGSAP } from './utils/gsapSetup';
import BlackHoleBackground from './components/BlackHoleBackground/BlackHoleBackground.jsx';
import './styles/blackhole.css';
import './styles/style.css';

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Loader Logic
    const t = setTimeout(() => setLoading(false), 1200);

    // GSAP Setup
    const animationTimer = setTimeout(() => {
      setupGSAP();
      window.scrollTo(0, 0);
    }, 100);

    return () => {
      clearTimeout(t);
      clearTimeout(animationTimer);
    };
  }, [location.pathname]);

  // Black Hole
  const isSpecialPage = 
    location.pathname === '/3d-projects' || 
    location.pathname === '/art-portfolio' ||
    location.pathname === '/courses';

  return (
    <>
      {!isSpecialPage && <BlackHoleBackground />}

      {loading && <Loader />}
      <Cursor />

      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/3d-projects" element={<ThreeDGallery />} />
        <Route path="/art-portfolio" element={<ArtPortfolio />} />
        
        
        <Route path="/courses" element={<CoursesLanding />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;