import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter';
import SpaceBackground from './3D/SpaceBackground';
import Contact from '../Portfolio/Contact'; 
import '../../styles/landing.css'; 

// 👇 Courses Data Import කරන්න
import { COURSES_DATA } from '../Courses/data/coursesData';

const LandingPage = () => {
  useEffect(() => {
    // Set page title
    document.title = "Namal Chamodya | Official Web";

    window.scrollTo(0, 0);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.l-fade-in').forEach(el => observer.observe(el));
  }, []);

  // ✅ Auto Updates Logic:
  const latestCourses = [...COURSES_DATA].reverse().slice(0, 2).map(course => ({
    id: `course-${course.id}`,
    tag: 'Course',
    title: course.title,
    date: 'New Release',
    img: course.thumbnail,
    link: `/course/${course.id}` // link for each course
  }));

  // Manual Updates (Products / Art)
  const otherUpdates = [
    { 
      id: 'prod-1', 
      tag: 'Product', 
      title: 'Arduino Starter Kit - Restocked', 
      date: '5 days ago',
      img: 'https://images.unsplash.com/photo-1555664424-778a184335ec?q=80&w=1000&auto=format&fit=crop',
      link: '#store'
    }
  ];


  const allUpdates = [...latestCourses, ...otherUpdates];

  return (
    <div className="landing-page">
      <SpaceBackground />
      <LandingNavbar />

      {/* --- Hero Section --- */}
      <header className="l-hero l-fade-in">
        <div className="l-hero-content">
          <span className="l-badge">Welcome to the Official Hub</span>
          <h1 className="l-title">
            Discover <span className="l-highlight">Innovation</span> <br />
            & Creativity
          </h1>
          <p className="l-desc">
          Explore my personal ecosystem of Engineering, Education, and Digital Art. 
          Whether you are here to learn, buy, or be inspired—you've found the right place.          </p>
          <div className="l-hero-btns">
            <Link to="/portfolio" className="l-btn primary">View Portfolio</Link>
            <Link to="/store/electronics" className="l-btn secondary">Visit Store</Link>
          </div>
        </div>
      </header>

      {/* --- 3D Showcase --- */}
      <section className="l-section showcase-section l-fade-in">
        <div className="showcase-container">
            <div className="showcase-text">
                <h2 className="l-section-title">Featured <span className="l-highlight">3D Creation</span></h2>
                {/* <h3>⚠️ CRITICAL ADVICE:</h3>
                <p>
                    A fully rigged and animated 3D model designed for game engines. 
                    Modeled in Blender, textured in Substance Painter.
                </p> */}
                <div style={{ 
                    borderLeft: '4px solid #f39c12', 
                    paddingLeft: '15px', 
                    margin: '15px 0',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)', 
                    padding: '10px' 
                }}>
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#ddd' }}>
                        <strong>⚠️ CRITICAL ADVICE:</strong> <br/>
                        "Deep space environment detected. To navigate this universe safely, 
                        equipping this Space Suit is highly recommended."
                    </p>
                </div>
                <Link to="/3d-projects" className="l-btn secondary" style={{marginTop:'20px', display:'inline-block'}}>
                    View in 3D Lab →
                </Link>
            </div>
            <div className="showcase-model">
                <model-viewer
                    src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                    alt="3D Preview"
                    auto-rotate
                    camera-controls
                    interaction-prompt="none"
                    style={{width: '100%', height: '400px'}}
                ></model-viewer>
            </div>
        </div>
      </section>

      {/* --- Latest Updates (Auto Linked to Courses) --- */}
      <section className="l-section updates-section l-fade-in">
        <h2 className="l-section-title">Latest <span className="l-highlight">Updates</span></h2>
        <div className="updates-grid">
          {allUpdates.map((item) => (

            <Link to={item.link} key={item.id} className="update-card has-img" style={{textDecoration:'none', color:'inherit'}}>
              <div className="card-img-holder">
                  <img src={item.img} alt={item.title} />
              </div>
              <div className="card-content">
                  <span className={`tag ${item.tag.toLowerCase()}`}>{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p className="date">{item.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- Offers --- */}
      <section className="l-section offers-section l-fade-in" id="store">
        <h2 className="l-section-title">Store <span className="l-highlight">Offers</span></h2>
        <div className="offers-grid">
            <div className="offer-card">
                <h3>Summer Sale - 50% OFF</h3>
                <p>On all ICT Courses. Use Code: <b>SUMMER50</b></p>
            </div>
            <div className="offer-card">
                <h3>Electronics Bundle</h3>
                <p>Buy Kit + Guide Book. Use Code: <b>KIT2025</b></p>
            </div>
        </div>
      </section>

      {/* --- Contact --- */}
      
      <Contact/>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;