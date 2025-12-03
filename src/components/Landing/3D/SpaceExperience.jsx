import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls, Environment, Float } from '@react-three/drei';
import Astronaut from './Astronaut'; // 👈 Import Astronaut

const SpaceExperience = () => {
  return (
    <div className="three-d-container">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        {/* 1. ආලෝකකරණය */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffc107" />
        
        {/* 2. පසුබිම (තද කළු) */}
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 5, 25]} />

        {/* 3. තරු ගොඩක් */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* 4. අභ්‍යවකාශගාමියා (පසුබිමේ පාවෙනවා) */}
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
             <Astronaut />
          </Float>
          <Environment preset="city" />
        </Suspense>

        {/* 5. Camera Controls (Optional) */}
         <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.2} />
      </Canvas>
    </div>
  );
};

export default SpaceExperience;