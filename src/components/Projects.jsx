import React from 'react';

const Projects = () => {
  return (
    <section id="projects" className="section">
      <div className="section-header">
        <h2>PROJECTS</h2>
        <div className="accent-line"></div>
      </div>

      <div className="projects-container">
        <div className="project-item fade-in">
          <div className="project-image">
            <img src="/campus.jpg" alt="Immersive Audio Visualizer" />
            <div className="project-overlay">
              <div className="overlay-content">
                <a href=""><h4>VIEW PROJECT</h4></a>
              </div>
            </div>
          </div>
          <div className="project-info">
            <h3>IMMERSIVE AUDIO VISUALIZER</h3>
            <p>Interactive 3D visualization of audio frequencies using WebGL and Three.js</p>
            <div className="project-tags">
              <span>Three.js</span>
              <span>WebGL</span>
              <span>JavaScript</span>
              <span>Web Audio API</span>
            </div>
          </div>
        </div>

        <div className="project-item fade-in">
          <div className="project-image">
            <img src="/projece2.png" alt="Neomorphic UI System" />
            <div className="project-overlay">
              <div className="overlay-content">
                <h4>VIEW PROJECT</h4>
              </div>
            </div>
          </div>
          <div className="project-info">
            <h3>NEOMORPHIC UI SYSTEM</h3>
            <p>A modern UI component library inspired by neomorphism design principles</p>
            <div className="project-tags">
              <span>React</span>
              <span>SCSS</span>
              <span>Storybook</span>
              <span>Figma</span>
            </div>
          </div>
        </div>

        <div className="project-item reverse fade-in">
          <div className="project-image">
            <img src="/campus.jpg" alt="Virtual Gallery Experience" />
            <div className="project-overlay">
              <div className="overlay-content">
                <h4>VIEW PROJECT</h4>
              </div>
            </div>
          </div>
          <div className="project-info">
            <h3>VIRTUAL GALLERY EXPERIENCE</h3>
            <p>A virtual 3D art gallery with customizable exhibition spaces and interactive elements</p>
            <div className="project-tags">
              <span>Three.js</span>
              <span>React</span>
              <span>WebGL</span>
              <span>GLSL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-cta">
        <a href="#" className="btn primary-btn">View All Projects</a>
      </div>
    </section>
  );
};

export default Projects;
