import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const projects = [
  { 
    id: 1, 
    title: 'Art & Design Portfolio', 
    description: 'Creative artwork using Photoshop, Clip Studio Paint, and traditional pencil drawing', 
    image: process.env.PUBLIC_URL + '/art.png', 
    alt: 'Art Portfolio', 
    href: '/art-portfolio', 
    tags: ['Photoshop', 'Clip Studio Paint', 'Pencil Drawing'] 
  },

  { 
    id: 2, 
    title: 'University Website', 
    description: 'Modern UI component library', 
    image: process.env.PUBLIC_URL + '/projece2.png', 
    alt: 'University Web', 
    href: 'https://github.com/namalchamodya/University-web', 
    tags: ['React', 'SCSS'] 
  },
  { 
    id: 3, 
    title: 'Namal-Chamodya web', 
    description: 'Dynamic portfolio builder', 
    image: process.env.PUBLIC_URL + '/namal_chamodya_web.png', 
    alt: 'Portfolio', 
    href: '#', 
    tags: ['React', 'DnD'] 
  },
  { 
    id: 4, 
    title: '3D Projects Gallery', 
    description: 'Collection of interactive 3D models',
    image: process.env.PUBLIC_URL + '/3d-product.png', 
    alt: '3D Projects', 
    href: '/3d-projects', // 👈 LINKS TO NEW PAGE
    tags: ['React', '3D Model', 'GLTF'] 
  },
  { 
    id: 5, 
    title: 'Electronics Projects', 
    description: 'IoT device prototypes', 
    image: process.env.PUBLIC_URL + '/electronics.png', 
    alt: 'Electronics', 
    href: '#', 
    tags: ['ESP32', 'IoT'] 
  },
  { 
    id: 6, 
    title: 'LabelStudio', 
    description: 'QR code and label generation app', 
    image: process.env.PUBLIC_URL + '/labelstudio.png', 
    alt: 'LabelStudio', 
    href: 'https://labelstudio.netlify.app/', 
    tags: ['React', 'QR Code', 'Labels'] 
  },
  { 
    id: 7, 
    title: 'Nova-med website', 
    description: 'Interactive 3D visualization', 
    image: process.env.PUBLIC_URL + '/nova_med.png', 
    alt: 'Nova-med', 
    href: '#', 
    tags: ['Three.js', 'WebGL'] 
  },

];

const INITIAL_COUNT = 4;

const Projects = () => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('.project-item');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [visibleProjects]);

  return (
    <section id="projects" className="section">
      <div className="section-header">
        <h2>PROJECTS</h2>
        <div className="accent-line"></div>
      </div>

      <div className="projects-container">
        {visibleProjects.map((project, index) => {
          // Check if link is internal (starts with /)
          const isInternal = project.href.startsWith('/');
          return (
            <div 
              className="project-item"
              key={project.id}
              style={{ transitionDelay: `${(index % INITIAL_COUNT) * 0.2}s` }}
            >
              <div className="project-image">
                <img src={project.image} alt={project.alt} />
                <div className="project-overlay">
                  <div className="overlay-content">
                    {isInternal ? (
                      <Link to={project.href}><h4>OPEN GALLERY</h4></Link>
                    ) : (
                      <a href={project.href} target="_blank" rel="noopener noreferrer">
                        <h4>VIEW PROJECT</h4>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="section-cta">
        {hasMore ? (
            <button className="btn primary-btn" onClick={() => setVisibleCount(c => c + 4)}>More Projects</button>
        ) : visibleCount > INITIAL_COUNT && (
            <button className="btn primary-btn" onClick={() => setVisibleCount(INITIAL_COUNT)}>Show Less</button>
        )}
      </div>
    </section>
  );
};

export default Projects;