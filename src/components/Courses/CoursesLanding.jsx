import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COURSES_DATA } from './data/coursesData'; 
import '../../styles/courses.css'; 
import LandingFooter from '../Landing/LandingFooter';

const CoursesLanding = () => {
  useEffect(() => {
    // Set page title
    document.title = "Namal Chamodya | Learning Hub";

    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="courses-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* --- Navigation --- */}
      <nav className="course-navbar">
        <Link to="/" className="back-link">← Back to Portfolio</Link>
        <div className="auth-buttons">
          <button className="login-btn" style={{opacity: 0.5, cursor: 'not-allowed'}}>Login (Coming Soon)</button>
        </div>
      </nav>

      {/* --- Header --- */}
      <header className="courses-header">
        <h1>Namal's Learning <span className="highlight">Hub</span></h1>
        <p>Master ICT & Design. Select a course to start learning.</p>
      </header>

      {/* --- Courses Grid --- */}
      <div className="courses-grid" style={{ flex: '1' }}>
        {COURSES_DATA.map((course) => (
          <div key={course.id} className="course-card">
            
            {/* Thumbnail & Price */}
            <div className="course-thumb">
              <img src={course.thumbnail} alt={course.title} />
              <div className="price-tag">{course.price}</div>
            </div>
            
            <div className="course-info">
              <h3>{course.title}</h3>
              <p className="course-desc">{course.description}</p>
              
              {/* --- Lesson List --- */}
              <div className="lesson-list">
                <h4>Course Content:</h4>
                <ul>
                  {course.lessons.slice(0, 3).map((lesson) => (
                    <li key={lesson.id} className={lesson.isLocked ? "locked" : "unlocked"}>
                      <span className="icon">
                        {lesson.isLocked ? "🔒" : "▶️"}
                      </span>
                      <span className="lesson-title">{lesson.title}</span>
                      
                      {/* Demo Button Logic (Based on your CSS .play-demo-btn) */}
                      {!lesson.isLocked && (
                        <Link 
                          to={`/course/${course.id}`} 
                          className="play-demo-btn"
                        >
                          Watch Demo
                        </Link>
                      )}
                    </li>
                  ))}
                  
                  {/* More Lessons Count */}
                  {course.lessons.length > 3 && (
                    <li style={{color:'#666', fontSize:'0.8rem', justifyContent: 'center', borderBottom: 'none'}}>
                      + {course.lessons.length - 3} more lessons
                    </li>
                  )}
                </ul>
              </div>

              {/* --- Action Button (Enroll) --- */}
              <div className="card-actions">
                <Link 
                  to={`/course/${course.id}`} 
                  className="enroll-btn" 
                  style={{
                    textAlign: 'center', 
                    display: 'block', 
                    textDecoration: 'none',
                  }}
                >
                  Enroll Now - {course.price}
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
      {/* --- Footer --- */}

        <div style={{ marginTop: 'auto', width: '100%', bottom: 0 }}>
          
        </div>
        <LandingFooter />
    </div>
  );
};

export default CoursesLanding;