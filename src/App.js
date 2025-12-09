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

// Import Course Pages
import CoursesLanding from './components/Courses/CoursesLanding';
import CoursePlayer from './components/Courses/CoursePlayer';

// Import Store Pages
import ElectronicsStore from './components/Store/ElectronicsStore';
import BookStore from './components/Store/BookStore';
import SoftwareStore from './components/Store/SoftwareStore';

// Blog pages
import BlogFeed from './components/Blog/BlogFeed';

import { setupGSAP } from './utils/gsapSetup';
import BlackHoleBackground from './components/BlackHoleBackground/BlackHoleBackground.jsx';
import './styles/blackhole.css';
import './styles/style.css';

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
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


  const isSpecialPage = 
    location.pathname === '/' ||
    location.pathname === '/3d-projects' || 
    location.pathname === '/art-portfolio' ||
    location.pathname === '/courses' ||
    location.pathname.startsWith('/store/') ||
    isPlayerPage;

  const showGlobalFooter = location.pathname === '/portfolio';

  return (
    <>
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
        <Route path="/store/electronics" element={<ElectronicsStore />} />
        <Route path="/store/books" element={<BookStore />} />
        <Route path="/store/software" element={<SoftwareStore />} />
        <Route path="/blog" element={<BlogFeed />} />
        {/* <Route path="/store/electronics/:id" element={<ProductDetails />} /> */}
      </Routes>

      {showGlobalFooter && <Footer />}
    </>
  );
}

export default App;