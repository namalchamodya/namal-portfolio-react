import React, { useEffect, useRef, useState } from 'react';

const Cursor = () => {
  const rocketRef = useRef(null);
  const [isMoving, setIsMoving] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef(null);
  
  // State to hold the trail particles
  const [trail, setTrail] = useState([]);
  // Ref to throttle particle creation for performance
  const lastParticleTime = useRef(0);

  useEffect(() => {
    const rocket = rocketRef.current;

    const move = (e) => {
      const { clientX, clientY } = e;
      // Move the rocket
      rocket.style.transform = `translate(${clientX}px, ${clientY}px)`;
      
      // Handle thrust animation
      setIsMoving(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 100);

      // --- TRAIL LOGIC WITH OFFSET ---
      const now = Date.now();
      // Throttle particle creation to max one every 30ms
      if (now - lastParticleTime.current > 30) {
        lastParticleTime.current = now;
        
        // Calculate offset for the thrust
        // (due to -45deg rotation on a 24px body)
        const thrustOffsetX = 15; 
        const thrustOffsetY = 15;

        const newParticle = { 
          id: now, 
          x: clientX + thrustOffsetX, 
          y: clientY + thrustOffsetY 
        };
        
        // Add new particle to the state
        setTrail(prevTrail => [...prevTrail, newParticle]);
        
        // Set timer to remove the particle after 500ms (matches CSS animation)
        setTimeout(() => {
          setTrail(prev => prev.filter(p => p.id !== newParticle.id));
        }, 500); // This is the lifespan of the particle
      }
      // --- END TRAIL LOGIC ---
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = target.matches('a, button, .btn, [role="button"], input[type="submit"], input[type="button"], .clickable, .project-item, .skill-item, .nav-links a, .social-icons a');
      setIsHovering(isClickable);
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      const isClickable = target.matches('a, button, .btn, [role="button"], input[type="submit"], input[type="button"], .clickable, .project-item, .skill-item, .nav-links a, .social-icons a');
      if (isClickable) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // Empty dependency array is correct

  return (
    <>
      {/* 1. The Rocket Cursor */}
      <div className={`rocket-cursor ${isHovering ? 'hover' : ''}`} ref={rocketRef}>
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {isHovering ? (
            // Pointer cursor design
            <>
              <path d="M12 2L20 20H4L12 2Z" fill="#FFC107"/>
              <path d="M12 4L18 18H6L12 4Z" fill="#004E98"/>
              <circle cx="12" cy="12" r="2" fill="#FFE66D"/>
              <path d="M10 20L12 24L14 20" fill="#FF4500" opacity="0.8"/>
            </>
          ) : (
            // Default rocket design
            <>
              <path d="M12 2L15 9H9L12 2Z" fill="#FF6B35"/>
              <path d="M9 9H15V15H9V9Z" fill="#004E98"/>
              <path d="M10 15V18L12 16L14 18V15H10Z" fill="#FF6B35"/>
              <circle cx="11" cy="11" r="1" fill="#FFE66D"/>
              <circle cx="13" cy="13" r="1" fill="#FFE66D"/>
              {/* Thrust fire */}
              {isMoving && (
                <g className="thrust-fire">
                  <path d="M10 18L12 24L14 18" fill="#FF4500" opacity="0.8"/>
                  <path d="M10.5 18L12 22L13.5 18" fill="#FFD700" opacity="0.9"/>
                  <path d="M11 18L12 20L13 18" fill="#FFF" opacity="0.7"/>
                </g>
              )}
            </>
          )}
        </svg>
      </div>

      {/* 2. The Trail Particles */}
      {trail.map(p => (
        <div
          key={p.id}
          className="rocket-trail"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
          }}
        />
      ))}
    </>
  );
};

export default Cursor;