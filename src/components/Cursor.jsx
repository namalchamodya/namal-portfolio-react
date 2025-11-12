import React, { useEffect, useRef } from 'react';

const Cursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    const move = (e) => {
      const { clientX, clientY } = e;
      cursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
      follower.style.transform = `translate(${clientX}px, ${clientY}px)`;
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-follower" ref={followerRef}></div>
    </>
  );
};

export default Cursor;
