import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="section">
      <div className="section-header">
        <h2>CONTACT</h2>
        <div className="accent-line"></div>
      </div>

      <div className="contact-container">
        <div className="contact-info fade-in">
          <h3>GET IN TOUCH</h3>
          <p>
            Interested in working together? Feel free to reach out using the form or through my social media channels.
          </p>

          <div className="contact-details">
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <p>namalcg12@.gmailcom</p>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <p>Paranawatta, Boossa, LK</p>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-phone"></i>
              </div>
              <p>(+94) 77 0311 025</p>
            </div>
          </div>

          <div className="contact-social">
            <a href="https://github.com/namalchamodya" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
            <a href="https://www.linkedin.com/in/namalchamodya" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-dribbble"></i></a>
            <a href="https://www.instagram.com/na_mal_chamo_d_ya/" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
            <a href="https://www.facebook.com/namal.chamodya.2025/" target="_blank" rel="noreferrer"><i className="fab fa-facebook"></i></a>
          </div>
        </div>

        <div className="contact-form fade-in">
          <form id="contact-form" action="https://formsubmit.co/namalcg12@gmail.com" method="POST">
            <input type="hidden" name="_subject" value="Portfolio Contact Form" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" required />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="6" required></textarea>
            </div>

            <button type="submit" className="btn primary-btn">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
