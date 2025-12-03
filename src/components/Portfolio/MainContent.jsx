import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import About from './About';
import Projects from './Projects';
import Skills from './Skills';
import Contact from './Contact';

const MainContent = () => {
  useEffect(() => {
    // Ensure we start at the top so animations trigger correctly
    window.scrollTo(0, 0);
    
    // Optional safety: If GSAP fails, manually reveal content after a delay
    const t = setTimeout(() => {
        const hiddenElements = document.querySelectorAll('.fade-in');
        hiddenElements.forEach(el => el.classList.add('visible'));
    }, 500);
    
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Navbar />
      {/* Added min-height to ensure the container takes up space 
         even if animations are slow to load 
      */}
      <div className="container" style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <Home />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </div>
    </>
  );
};

export default MainContent;