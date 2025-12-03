import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const Astronaut = () => {
  const ref = useRef();
  
  // Public URL එකකින් Model එක ගන්නවා (ඔබට ඔබේම එකක් දාන්න පුළුවන්)
  const { scene } = useGLTF('https://modelviewer.dev/shared-assets/models/Astronaut.glb');

  useFrame((state) => {
    if (ref.current) {
      // සෙමින් කැරකෙන්න (Rotate)
      ref.current.rotation.y += 0.005;
      ref.current.rotation.z += 0.002;
      
      // උඩ පහළ පාවෙන්න (Float)
      ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2 - 2; // -2 මගින් පහළට ගත්තා
    }
  });

  return (
    <primitive 
      ref={ref} 
      object={scene} 
      scale={2} 
      position={[2, -2, 0]} // දකුණු පැත්තේ පහළින් තියන්න
      rotation={[0.5, -0.5, 0]}
    />
  );
};

export default Astronaut;