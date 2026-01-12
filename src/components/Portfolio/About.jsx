import React from 'react';

const About = () => {

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="section">
      <div className="section-header">
        <h2>ABOUT</h2>
        <div className="accent-line"></div>
      </div>

      <div className="about-container">
        <div className="about-image scale-in">
          <div className="image-container">
            <img src={process.env.PUBLIC_URL + "/dp3.png"} alt="Namal Chamodya" />
            <div className="accent-circle"></div>
          </div>
        </div>

        <div className="about-content fade-in">
          <h3>MY UNIVERSE</h3>
          <p>
            Welcome to my personal space. I’m a thinker. 
            While I work as an Electronic and IoT Design Engineer, this portfolio is an 
            open exploration of my ideas and the way I perceive the future.
          </p>

          <h3>ENDLESS CURIOSITY</h3>
          <p>
            I am a lifelong learner fascinated by the intersection of AI, robotics, electronics, 
            and design. My passion lies in connecting these diverse fields to build, create, 
            and discover things that push the boundaries of what is possible.
          </p>

          <h3>SHARING KNOWLEDGE</h3>
          <p>
            Beyond building, I am an ICT instructor who loves to teach. I believe innovation 
            is best when shared, so I dedicate my time to mentoring others and simplifying 
            complex tech for the next generation of thinkers.
          </p>

          <div className="about-cta">
          <button 
            onClick={() => scrollToSection('contact')} 
            className="btn primary-btn"
          >
            Get In Touch
          </button>
            <a href="https://drive.google.com/uc?export=download&id=1hlrlZhvsy6O0gI_DEU4OTbyg4KSAx3gC" className="btn secondary-btn" target='blank' rel="noopener noreferrer">Download CV</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;