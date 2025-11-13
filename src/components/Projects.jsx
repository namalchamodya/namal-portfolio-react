import React, { useState } from 'react';

const projects = [
  { id: 1, title: 'IMMERSIVE AUDIO VISUALIZER', description: 'Interactive 3D visualization of audio frequencies using WebGL and Three.js', image: '/campus.jpg', alt: 'Immersive Audio Visualizer screenshot', href: '#', tags: ['Three.js', 'WebGL', 'JavaScript', 'Web Audio API'] },
  { id: 2, title: 'University Website', description: 'A modern UI component library inspired by neomorphism design principles', image: '/projece2.png', alt: 'University Website preview', href: 'https://github.com/namalchamodya/University-web', tags: ['React', 'SCSS', 'Storybook', 'Figma'] },
  { id: 3, title: 'Portfolio Builder', description: 'Dynamic portfolio builder with drag & drop sections', image: '/portfolio.png', alt: 'Portfolio Builder preview', href: '#', tags: ['React', 'DnD', 'CSS'] },
  { id: 4, title: 'Task Manager', description: 'Lightweight task manager with local persistence', image: '/tasks.png', alt: 'Task Manager preview', href: '#', tags: ['React', 'LocalStorage'] },
  { id: 5, title: 'Chart Dashboard', description: 'Data visualization dashboard with interactive charts', image: '/charts.png', alt: 'Chart Dashboard preview', href: '#', tags: ['React', 'Recharts'] },
  { id: 6, title: 'Auth Starter', description: 'Starter kit with JWT auth flow', image: '/auth.png', alt: 'Auth Starter preview', href: '#', tags: ['Node', 'Express', 'JWT'] },
];

const INITIAL_COUNT = 4;

const Projects = () => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

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
        {visibleProjects.map((project) => (
          <div className="project-item fade-in" key={project.id}>
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
