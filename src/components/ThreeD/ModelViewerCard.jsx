import React from 'react';

const ModelViewerCard = ({ src, alt }) => {
  return (
    // This class 'model-wrapper' is used by Cursor.jsx to know when to hide!
    <div className="model-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <model-viewer
        src={src}
        alt={alt}
        loading="eager" 
        camera-controls
        auto-rotate
        shadow-intensity="1"
        camera-orbit="45deg 55deg 2.5m"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {/* Loading State */}
        <div slot="poster" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          color: 'white',
          background: 'radial-gradient(circle, #222 0%, #000 100%)',
          fontFamily: 'sans-serif'
        }}>
          Loading 3D Object...
        </div>

        {/* Error State */}
        <div slot="error" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          color: '#ff4d4d',
          background: '#000',
          textAlign: 'center'
        }}>
          <div>
            <strong>Error</strong>
            <p style={{ fontSize: '0.8rem' }}>Check file path</p>
          </div>
        </div>
      </model-viewer>
    </div>
  );
};

export default ModelViewerCard;