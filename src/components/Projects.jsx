import React, { useState, useEffect } from 'react';

const projects = [
  { id: 1, title: 'Nova-med website', description: 'Interactive 3D visualization of audio frequencies using WebGL and Three.js', image: '/nova_med.png', alt: 'Nova-med web screenshot', href: '#', tags: ['Three.js', 'WebGL', 'JavaScript', 'Web Audio API'] },
  { id: 2, title: 'University Website', description: 'A modern UI component library inspired by neomorphism design principles', image: '/projece2.png', alt: 'University Website preview', href: 'https://github.com/namalchamodya/University-web', tags: ['React', 'SCSS', 'Storybook', 'Figma'] },
  { id: 3, title: 'Namal-Chamodya web', description: 'Dynamic portfolio builder with drag & drop sections', image: '/namal_chamodya_web.png', alt: 'Portfolio Builder preview', href: '#', tags: ['React', 'DnD', 'CSS'] },
  { id: 4, title: '3D Projects', description: 'Collection of interactive 3D models',image: '/3d-product.png', alt: '3D Projects preview', href: '#threeD-section',tags: ['React', 'Three.js', 'GLTF'] },
  
  { id: 5, title: 'Chart Dashboard', description: 'Data visualization dashboard with interactive charts', image: '/charts.png', alt: 'Chart Dashboard preview', href: '#', tags: ['React', 'Recharts'] },
  { id: 6, title: 'Auth Starter', description: 'Starter kit with JWT auth flow', image: '/auth.png', alt: 'Auth Starter preview', href: '#', tags: ['Node', 'Express', 'JWT'] },
];

const INITIAL_COUNT = 4;

const Projects = () => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  useEffect(() => {
    // 1. Create the observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add the 'visible' class when the item enters the screen
          entry.target.classList.add('visible');
          // Stop observing once animated
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 }); // Trigger when 10% of the item is visible

    // 2. Observe all project items
    const items = document.querySelectorAll('.project-item');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [visibleProjects]); // Re-run this when "Load More" is clicked

  const loadMore = () => {
    setVisibleCount((c) => Math.min(c + INITIAL_COUNT, projects.length));
  };

  const showLess = () => {
    setVisibleCount(INITIAL_COUNT);
  };

  return (
    <section id="projects" className="section">
      <div className="section-header">
        <h2>PROJECTS</h2>
        <div className="accent-line"></div>
      </div>

      <div className="projects-container">
        {visibleProjects.map((project, index) => (
          <div 
            className="project-item" // Removed 'fade-in', logic is now handled by observer
            key={project.id}
            // This delay ensures they pop in one by one (0s, 0.2s, 0.4s...)
            style={{ transitionDelay: `${(index % INITIAL_COUNT) * 0.2}s` }}
          >
            <div className="project-image">
              <img src={project.image} alt={project.alt} />
              <div className="project-overlay">
                <div className="overlay-content">
                  <a href={project.href} target="_blank" rel="noopener noreferrer">
                    <h4>VIEW PROJECT</h4>
                  </a>
                </div>
              </div>
            </div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-cta">
        {hasMore ? (
          <button className="btn primary-btn" onClick={loadMore}>
            More Projects
          </button>
        ) : visibleCount > INITIAL_COUNT ? (
          <button className="btn primary-btn" onClick={showLess}>
            Show Less
          </button>
        ) : null}
      </div>
    </section>
  );
};

export default Projects;