import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Loader from './components/Loader';
import Cursor from './components/Cursor';

// Import Pages (Correct Paths)
import LandingPage from './components/Landing/LandingPage.jsx';
import Footer from './components/Portfolio/Footer';
import MainContent from './components/Portfolio/MainContent'; 
import ThreeDGallery from './components/ThreeD/ThreeDGallery';
import ArtPortfolio from './components/ArtPortfolio';
import CoursesLanding from './components/Courses/CoursesLanding';
import CoursePlayer from './components/Courses/CoursePlayer';

import { setupGSAP } from './utils/gsapSetup';
import BlackHoleBackground from './components/BlackHoleBackground/BlackHoleBackground.jsx';
import './styles/blackhole.css';
import './styles/style.css';

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Loader එක තත්පර 1.2 කින් අනිවාර්යයෙන්ම අයින් කරන්න
    const t = setTimeout(() => setLoading(false), 1200);
    
    const animationTimer = setTimeout(() => {
      try {
        setupGSAP();
      } catch (e) {
        console.log("GSAP setup error (ignored):", e);
      }
      window.scrollTo(0, 0);
    }, 100);

    return () => { clearTimeout(t); clearTimeout(animationTimer); };
  }, [location.pathname]);

  const isPlayerPage = location.pathname.startsWith('/course/');

  // Landing Page ('/') එකෙත් Black Hole එක ඕන නෑ (එතන වෙනම එකක් තියෙනවා)
  const isSpecialPage = 
    location.pathname === '/' ||
    location.pathname === '/3d-projects' || 
    location.pathname === '/art-portfolio' ||
    location.pathname === '/courses' ||
    isPlayerPage;

  // Footer එක පෙන්විය යුත්තේ Portfolio පිටුවේ පමණයි
  const showGlobalFooter = location.pathname === '/portfolio';

  return (
    <>
      {/* BlackHole පෙන්වන්නේ අවශ්‍ය තැන්වල විතරයි */}
      {!isSpecialPage && <BlackHoleBackground />}
      
      {loading && <Loader />}
      
      {!isPlayerPage && <Cursor />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/portfolio" element={<MainContent />} />
        <Route path="/3d-projects" element={<ThreeDGallery />} />
        <Route path="/art-portfolio" element={<ArtPortfolio />} />
        <Route path="/courses" element={<CoursesLanding />} />
        <Route path="/course/:id" element={<CoursePlayer />} />
      </Routes>

      {showGlobalFooter && <Footer />}
    </>
  );
}

export default App;