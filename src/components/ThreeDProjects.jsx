// src/components/ThreeDProjects.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ModelItem from './ModelItem';
import '../styles/threed.css';

// List your GLB models in public/models
const MODELS = [
  { id: 1, title: 'Chair', file: '/models/chair.glb', scale: 1.2 },
  { id: 2, title: 'Shoe', file: '/models/shoe.glb', scale: 1.0 },
  { id: 3, title: 'Ring', file: '/models/ring.glb', scale: 1.5 },
];

const ThreeDProjects = () => {
  return (
    <section className="threeD-section">
      <div className="section-header">
        <h2>3D Projects</h2>
        <div className="accent-line"></div>
      </div>

      <div className="threeD-gallery">
        {MODELS.map((m) => (
          <div key={m.id} className="threeD-item">
            <h3>{m.title}</h3>
            <div className="threeD-container">
              <Canvas camera={{ position: [0, 1.5, 3.5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Environment preset="studio" />
                <OrbitControls enableZoom={true} />
                <ModelItem path={m.file} scale={m.scale} />
              </Canvas>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThreeDProjects;
