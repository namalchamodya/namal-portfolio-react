import React, { useEffect, useRef } from 'react';

const Contact = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const hiddenElements = sectionRef.current.querySelectorAll('.fade-in');
      hiddenElements.forEach((el) => observer.observe(el));
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="contact" className="section" style={{ position: 'relative', zIndex: 10, padding: '80px 5%' }} ref={sectionRef}>
      
      {/* Glass Effect Overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        backdropFilter: 'blur(10px)',
        zIndex: -1
      }}></div>

      <div className="section-header fade-in">
        <h2 style={{color: '#fff'}}>CONTACT</h2>
        <div className="accent-line"></div>
      </div>

      <div className="contact-container">
        
        {/* Left Side */}
        <div className="contact-info fade-in">
          <h3 style={{color: 'var(--primary-color)'}}>GET IN TOUCH</h3>
          <p style={{color: '#ccc'}}>
            Interested in working together? Feel free to reach out using the form or through my social media channels.
          </p>

          <div className="contact-details">
            <div className="contact-item">
              <i className="fas fa-envelope" style={{color: 'var(--primary-color)', marginRight:'15px'}}></i>
              <p style={{color:'#fff', margin:0}}>namalcg12@gmail.com</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt" style={{color: 'var(--primary-color)', marginRight:'15px'}}></i>
              <p style={{color:'#fff', margin:0}}>Paranawatta, Boossa, LK</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone" style={{color: 'var(--primary-color)', marginRight:'15px'}}></i>
              <p style={{color:'#fff', margin:0}}>(+94) 77 0311 025</p>
            </div>
          </div>

          <div className="contact-social">
            <a href="#" style={{color:'#fff', fontSize:'1.5rem', marginRight:'15px'}}><i className="fab fa-github"></i></a>
            <a href="#" style={{color:'#fff', fontSize:'1.5rem', marginRight:'15px'}}><i className="fab fa-linkedin"></i></a>
            <a href="#" style={{color:'#fff', fontSize:'1.5rem'}}><i className="fab fa-instagram"></i></a>
          </div>
        </div>

        {/* Right Side */}
        <div className="contact-form fade-in">
          <form style={{background: 'rgba(255,255,255,0.05)', padding:'30px', borderRadius:'10px'}}>
            <div className="form-group">
              <label style={{color:'#ddd'}}>Name</label>
              <input type="text" style={{background:'rgba(0,0,0,0.5)', border:'1px solid #333', color:'#fff'}} required />
            </div>
            <div className="form-group">
              <label style={{color:'#ddd'}}>Email</label>
              <input type="email" style={{background:'rgba(0,0,0,0.5)', border:'1px solid #333', color:'#fff'}} required />
            </div>
            <div className="form-group">
              <label style={{color:'#ddd'}}>Subject</label>
              <input type="text" style={{background:'rgba(0,0,0,0.5)', border:'1px solid #333', color:'#fff'}} required />
            </div>
            <div className="form-group">
              <label style={{color:'#ddd'}}>Message</label>
              <textarea rows="4" style={{background:'rgba(0,0,0,0.5)', border:'1px solid #333', color:'#fff'}} required></textarea>
            </div>
            <button className="btn primary-btn" style={{width:'100%'}}>Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;