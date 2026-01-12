import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COURSES_DATA } from './data/coursesData'; 
import '../../styles/courses.css'; 
import LandingFooter from '../Landing/LandingFooter';

const CoursesLanding = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Namal Chamodya | Learning Hub";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="courses-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* --- Simple Mobile Navbar (Only Back & Login) --- */}
      <nav className="course-navbar">
        <button className="back-link" onClick={() => navigate('/')}>
          ← Back
        </button>

        <div className="auth-buttons" style={{display: 'flex'}}>
          <button className="login-btn" onClick={() => alert("Login Feature Coming Soon!")}>
            Login
          </button>
        </div>
      </nav>

      {/* --- Header --- */}
      <header className="courses-header">
        <h1>Namal's Learning <span className="highlight">Hub</span></h1>
        <p>Master ICT & Design. Select a course to start learning.</p>
        
        {/* --- New Filter Tabs --- */}
        <div className="course-tabs">
            <button 
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} 
                onClick={() => setActiveTab('all')}
            >
                All Courses
            </button>
            <button 
                className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`} 
                onClick={() => setActiveTab('my')}
            >
                My Courses
            </button>
        </div>
      </header>

      {/* --- Courses Grid --- */}
      <div className="courses-grid" style={{ flex: '1' }}>
        
        {/* If 'All Courses' Tab is Active */}
        {activeTab === 'all' ? (
            COURSES_DATA.map((course) => (
            <div key={course.id} className="course-card">
                <div className="course-thumb">
                <img src={course.thumbnail} alt={course.title} />
                <div className="price-tag">{course.price}</div>
                </div>
                
                <div className="course-info">
                <h3>{course.title}</h3>
                <p className="course-desc">{course.description}</p>
                
                <div className="lesson-list">
                    <h4>Course Content:</h4>
                    <ul>
                    {course.lessons.slice(0, 3).map((lesson) => (
                        <li key={lesson.id} className={lesson.isLocked ? "locked" : "unlocked"}>
                        <span className="icon">{lesson.isLocked ? "🔒" : "▶️"}</span>
                        <span className="lesson-title">{lesson.title}</span>
                        {!lesson.isLocked && (
                            <Link to={`/course/${course.id}`} className="play-demo-btn">Watch Demo</Link>
                        )}
                        </li>
                    ))}
                    {course.lessons.length > 3 && (
                        <li style={{color:'#666', fontSize:'0.8rem', justifyContent: 'center', borderBottom: 'none'}}>
                        + {course.lessons.length - 3} more lessons
                        </li>
                    )}
                    </ul>
                </div>

                <div className="card-actions">
                    <Link to={`/course/${course.id}`} className="enroll-btn" style={{textAlign: 'center', display: 'block', textDecoration: 'none'}}>
                    Enroll Now - {course.price}
                    </Link>
                </div>
                </div>
            </div>
            ))
        ) : (
            // If 'My Courses' Tab is Active (Placeholder)
            <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#888'}}>
                <h3>You haven't purchased any courses yet.</h3>
                <p>Please login to view your courses.</p>
                <button className="login-btn" onClick={() => alert("Login")}>Login Now</button>
            </div>
        )}

      </div>

      <div style={{ marginTop: 'auto', width: '100%', bottom: 0 }}></div>
      <LandingFooter />
    </div>
  );
};

export default CoursesLanding;