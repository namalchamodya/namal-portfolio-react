import React from 'react';
import useSkillProgress from '../hooks/useSkillProgress';

const Skills = () => {
  useSkillProgress();

  return (
    <section id="skills" className="section">
      <div className="section-header">
        <h2>SKILLS</h2>
        <div className="accent-line"></div>
      </div>

      <div className="skills-container">

        <div className="skill-category">
          <h3>DEVELOPMENT</h3>
          <div className="skills-grid">
            <div className="skill-item fade-in">
              <div className="skill-icon">
                <i className="fab fa-python"></i>
              </div>
              <h4>Python</h4>
              <div className="skill-bar">
                <div className="skill-progress" data-progress="80"></div>
              </div>
            </div>

            <div className="skill-item fade-in">
              <div className="skill-icon">
                <i className="fab fa-js"></i>
              </div>
              <h4>JavaScript</h4>
              <div className="skill-bar">
                <div className="skill-progress" data-progress="70"></div>
              </div>
            </div>

            <div className="skill-item fade-in">
              <div className="skill-icon">
                <i className="fab fa-node-js"></i>
              </div>
              <h4>Node.js</h4>
              <div className="skill-bar">
                <div className="skill-progress" data-progress="60"></div>
              </div>
            </div>

            <div className="skill-item fade-in">
              <div className="skill-icon">
                <i className="fab fa-html5"></i>
              </div>
              <h4>HTML5 & CSS3</h4>
              <div className="skill-bar">
                <div className="skill-progress" data-progress="98"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="skill-category">
          <h3>DESIGN</h3>
          <div className="skills-grid">
            <div className="skill-item fade-in">
              <div className="skill-icon">
                <i className="fab fa-figma"></i>
              </div>
              <h4>Figma</h4>
              <div className="skill-bar">
                <div className="skill-progress" data-progress="92"></div>
              </div>
            </div>

            <div className="skill-item fade-in">
              <div className="skill-icon">
                <i className="fas fa-palette"></i>
              </div>
              <h4>UI/UX Design</h4>
              <div className="skill-bar">
                <div className="skill-progress" data-progress="88"></div>
              </div>
            </div>

            <div className="skill-item fade-in">
              <div className="skill-icon">
                <i className="fas fa-cube"></i>
              </div>
              <h4>3D Modeling</h4>
              <div className="skill-bar">
                <div className="skill-progress" data-progress="80"></div>
              </div>
            </div>

            <div className="skill-item fade-in">
              <div className="skill-icon">
                <i className="fas fa-paint-brush"></i>
              </div>
              <h4>Digital Art</h4>
              <div className="skill-bar">
                <div className="skill-progress" data-progress="85"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="skill-category">
          <h3>TOOLS & TECHNOLOGIES</h3>
          <div className="skills-grid">
            <div className="skill-item fade-in">
              <div className="skill-icon">
                <i className="fas fa-cubes"></i>
              </div>
              <h4>Three.js</h4>
              <div className="skill-bar">
                <div className="skill-progress" data-progress="88"></div>
              </div>
            </div>

            <div className="skill-item fade-in">
              <div className="skill-icon">
                <i className="fab fa-sass"></i>
              </div>
              <h4>SASS/SCSS</h4>
              <div className="skill-bar">
                <div className="skill-progress" data-progress="95"></div>
              </div>
            </div>

            <div className="skill-item fade-in">
              <div className="skill-icon">
                <i className="fab fa-git-alt"></i>
              </div>
              <h4>Git & GitHub</h4>
              <div className="skill-bar">
                <div className="skill-progress" data-progress="90"></div>
              </div>
            </div>

            <div className="skill-item fade-in">
              <div className="skill-icon">
                <i className="fas fa-database"></i>
              </div>
              <h4>MongoDB</h4>
              <div className="skill-bar">
                <div className="skill-progress" data-progress="82"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Skills;
