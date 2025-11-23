import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const projects = [
  { 
    id: 1, 
    title: 'Digital Art Gallery', 
    description: 'Pencil portraits and digital illustrations', 
    image: process.env.PUBLIC_URL + '/art.png', 
    alt: 'Digital Art', 
    href: '#', 
    tags: ['Photoshop', 'Clip Studio', 'Drawing'] 
  },
  { 
    id: 2, 
    title: 'University Website', 
    description: 'Modern responsive university website', 
    image: process.env.PUBLIC_URL + '/projece2.png', 
    alt: 'University Web', 
    href: 'https://github.com/namalchamodya/University-web', 
    tags: ['React', 'CSS'] 
  },
  { 
    id: 3, 
    title: 'Namal-Chamodya web', 
    description: 'Dynamic portfolio builder', 
    image: process.env.PUBLIC_URL + '/namal_chamodya_web.png', 
    alt: 'Portfolio', 
    href: '#', 
    tags: ['React', 'DnD', 'Three.js'] 
  },
  { 
    id: 4, 
    title: '3D Projects Gallery', 
    description: 'Click to view my collection of 3D models',
    image: process.env.PUBLIC_URL + '/3d-product.png', 
    alt: '3D Projects', 
    href: '/3d-projects',
    tags: ['Blender', 'SolidWorks', 'Three.js'] 
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
    title: 'Nova-med website', 
    description: 'Interactive 3D visualization', 
    image: process.env.PUBLIC_URL + '/nova_med.png', 
    alt: 'Nova-med', 
    href: '#', 
    tags: ['Three.js', 'WebGL', 'React'] 
  },
  { 
    id: 7, 
    title: 'LabelStudio', 
    description: 'Generate custom QR codes with various options', 
    image: process.env.PUBLIC_URL + '/labelstudio.png', 
    alt: 'QR Code Generator', 
    href: 'https://labelstudio.netlify.app/', 
    tags: ['React', 'QR Code', 'Web App'] 
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