import React from 'react';

const About = () => {
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
          <h3>WHERE IT ALL BEGAN</h3>
          <p>
            I'm a creative developer and designer with a passion for building immersive digital
            experiences that blur the line between art and technology. With over 6 years of experience,
            I blend technical expertise with creative vision.
          </p>

          <h3>A DIGITAL JOURNEY</h3>
          <p>
            My approach is holistic—focused on the intersection of design, development, and user experience.
            I create work that looks stunning, performs exceptionally, and forms memorable interactions.
          </p>

          <h3>ART & CODE</h3>
          <p>
            When I'm not coding, I'm exploring new creative techniques, contributing to open-source,
            or mentoring upcoming designers and developers—always evolving at the forefront of innovation.
          </p>

          <div className="about-cta">
            <a href="#contact" className="btn primary-btn">Get In Touch</a>
            <a href="https://drive.google.com/uc?export=download&id=1hlrlZhvsy6O0gI_DEU4OTbyg4KSAx3gC" className="btn secondary-btn" target='blank' rel="noopener noreferrer">Download CV</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

