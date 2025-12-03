import React, { useEffect, useRef } from 'react';

const SpaceBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars = [];
    const numStars = 800;
    const speed = 2; // Star speed

    // Create Stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * width
      });
    }

    const animate = () => {
      // Background Color (Deep Space Black)
      ctx.fillStyle = '#050505'; 
      ctx.fillRect(0, 0, width, height);

      // Star Center
      const cx = width / 2;
      const cy = height / 2;

      stars.forEach((star) => {
        // Move star closer
        star.z -= speed;

        // Reset star if it passes screen
        if (star.z <= 0) {
          star.x = Math.random() * width - width / 2;
          star.y = Math.random() * height - height / 2;
          star.z = width;
        }

        // Project 3D position to 2D
        const x = (star.x / star.z) * width + cx;
        const y = (star.y / star.z) * height + cy;
        const size = (1 - star.z / width) * 2.5; // Size depends on distance

        // Draw Star (Gold/White Tint)
        const alpha = (1 - star.z / width);
        ctx.fillStyle = `rgba(255, 240, 200, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size > 0 ? size : 0, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // Behind everything
      }} 
    />
  );
};

export default SpaceBackground;