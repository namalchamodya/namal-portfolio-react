import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html, ContactShadows } from '@react-three/drei';
import { Link } from 'react-router-dom';
import ModelItem from './ModelItem';
import '../styles/threed.css';

// ---------------------------------------------------------
// CONFIGURATION: Add your new models here
// Place .glb files in the "public/models/" folder
// ---------------------------------------------------------
const MODELS = [
  { id: 1, title: 'Abstract Chair', file: '/models/chair.glb', scale: 2 },
  { id: 2, title: 'Neon Shoe', file: '/models/shoe.glb', scale: 1.5 },
  { id: 3, title: 'Gold Ring', file: '/models/ring.glb', scale: 1.8 },
  { id: 4, title: 'Robot Head', file: '/models/robot.glb', scale: 1.2 },
];

const Loader = () => (
  <Html center>
    <div className="canvas-loader">Loading 3D...</div>
  </Html>
);

const ThreeDProjects = () => {
  return (
    <section className="threeD-section">
      {/* Navigation Header */}
      <div className="threeD-nav">
        <Link to="/" className="back-btn">← Back to Portfolio</Link>
      </div>

      <div className="section-header">
        <h2>3D Laboratory</h2>
        <div className="accent-line"></div>
        <p>Interactive 3D Assets • Drag to Rotate • Scroll to Zoom</p>
      </div>

      <div className="threeD-gallery">
        {MODELS.map((m) => (
          <div key={m.id} className="threeD-item">
            <div className="threeD-card-header">
              <h3>{m.title}</h3>
            </div>
            
            <div className="threeD-canvas-wrapper">
              <Canvas 
                camera={{ position: [0, 2, 5], fov: 45 }} 
                shadows
                dpr={[1, 2]} // Optimizes pixel ratio for performance
              >
                {/* Lighting Setup */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                
                {/* Environment wrapper for realistic reflections */}
                <Environment preset="city" />

                {/* The Model with Suspense for loading state */}
                <Suspense fallback={<Loader />}>
                  <ModelItem path={m.file} scale={m.scale} />
                  <ContactShadows position={[0, -1.4, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#000000" />
                </Suspense>

                {/* Controls: Rotate (Left Click), Pan (Right Click), Zoom (Scroll) */}
                <OrbitControls 
                  enablePan={false} 
                  minDistance={2} 
                  maxDistance={10} 
                  autoRotate={false}
                />
              </Canvas>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThreeDProjects;