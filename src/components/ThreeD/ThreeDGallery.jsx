import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModelViewerCard from './ModelViewerCard';

// 👇 Note the path: Up two folders (../..) to styles
import '../../styles/threed.css'; 

// 👇 LIST YOUR GLB FILES HERE
const MY_MODELS = [
  { 
    id: 1, 
    name: 'Abstract Chair', 
    file: process.env.PUBLIC_URL + '/models/round_clip_stand.glb', 
    desc: 'Modern Furniture Design' 
  },
  { 
    id: 2, 
    name: 'Neon Shoe', 
    file: process.env.PUBLIC_URL + '/models/circuit_1.glb', 
    desc: 'Product Visualization' 
  },
  { 
    id: 3, 
    name: 'Gold Ring', 
    file: process.env.PUBLIC_URL + '/models/eliot_stand 3 sidde v1.glb', 
    desc: 'Jewelry Rendering' 
  },
  { 
    id: 4, 
    name: 'Robot Head', 
    file: process.env.PUBLIC_URL + '/models/ELIOT TFL.glb', 
    desc: 'Character Concept' 
  },
];

const ThreeDGallery = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="threed-page-container">
      <nav className="threed-navbar">
        <Link to="/" className="back-button">
          ← Back to Portfolio
        </Link>

        <div>
        <p style={{ color: '#aaa', marginTop: '10px', textAlign: 'center' }}>
        Drag to Rotate • Scroll to Zoom
        </p>
      </div>
      
        <h2>3D Laboratory</h2>

      </nav>



      <div className="threed-grid">
        {MY_MODELS.map((item) => (
          <div key={item.id} className="threed-card">
            <div className="model-display">
              <ModelViewerCard src={item.file} alt={item.name} />
            </div>
            <div className="project-details">
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreeDGallery;