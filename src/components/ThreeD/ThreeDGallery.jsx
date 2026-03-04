import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModelViewerCard from './ModelViewerCard';
import LandingFooter from '../Landing/LandingFooter';

// 👇 Note the path: Up two folders (../..) to styles
import '../../styles/threed.css';

// 👇 LIST YOUR GLB FILES HERE
const MY_MODELS = [
  {
    id: 1,
    name: 'Clip Stand Design',
    file: process.env.PUBLIC_URL + '/models/round_clip_stand.glb',
    desc: 'Modern furniture design'
  },
  {
    id: 2,
    name: 'Frequency Light Sensor',
    file: process.env.PUBLIC_URL + '/models/circuit_1.glb',
    desc: 'Electronic sensor visualization'
  },
  {
    id: 3,
    name: 'ELIOT Stand for Emmanuels Lanka Pvt Ltd',
    file: process.env.PUBLIC_URL + '/models/eliot_stand 3 sidde v1.glb',
    desc: 'Retail display stand'
  },
  {
    id: 4,
    name: 'TFL for Emmanuels Lanka Pvt Ltd',
    file: process.env.PUBLIC_URL + '/models/ELIOT TFL.glb',
    desc: 'Branding concept'
  },
  // { 
  //   id: 5, 
  //   name: 'Measurement Table', 
  //   file: process.env.PUBLIC_URL + '/models/measurement_table.glb', 
  //   desc: 'Technical measurement table'
  // },
];

const ThreeDGallery = () => {
  useEffect(() => {
    // Set page title
    document.title = "Namal Chamodya | 3D Gallery";

    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="threed-page-container">
        <nav className="threed-navbar">
          <Link to="/" className="back-button">
            ← Back
          </Link>
          <h2>NC<span>.3D</span></h2>
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
      <LandingFooter />
    </>
  );
};

export default ThreeDGallery;