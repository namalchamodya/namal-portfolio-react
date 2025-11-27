import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/courses.css';

const COURSES_DATA = [
  {
    id: 1,
    title: "React JS Masterclass",
    description: "Learn React from scratch to advanced. Build real-world projects.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop", // Sample Image
    lessons: [
      { id: 1, title: "Introduction to React (Free Demo)", isLocked: false },
      { id: 2, title: "Components & Props", isLocked: true },
      { id: 3, title: "State Management", isLocked: true },
      { id: 4, title: "React Router", isLocked: true }
    ],
    price: "LKR 5,000"
  },
  {
    id: 2,
    title: "UI/UX Design for Beginners",
    description: "Master Figma and design principles with practical examples.",
    thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?q=80&w=1000&auto=format&fit=crop",
    lessons: [
      { id: 1, title: "What is UX? (Free Demo)", isLocked: false },
      { id: 2, title: "Wireframing Basics", isLocked: true },
      { id: 3, title: "Prototyping in Figma", isLocked: true }
    ],
    price: "LKR 3,500"
  }
];

const CoursesLanding = () => {
  // දැනට අපි හිතමු User Log වෙලා නෑ කියලා
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="courses-page">
      {/* Navigation */}
      <nav className="course-navbar">
        <Link to="/" className="back-link">← Back to Portfolio</Link>
        <div className="auth-buttons">
          {!isLoggedIn ? (
            <button className="login-btn" onClick={() => alert('Login Form will open here!')}>Login</button>
          ) : (
            <div className="user-profile">Namal (Student)</div>
          )}
        </div>
      </nav>

      <header className="courses-header">
        <h1>My Learning <span className="highlight">Hub</span></h1>
        <p>Master new skills with my premium courses. Watch free demos before you enroll.</p>
      </header>

      <div className="courses-grid">
        {COURSES_DATA.map((course) => (
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
                  {course.lessons.map((lesson) => (
                    <li key={lesson.id} className={lesson.isLocked && !isLoggedIn ? "locked" : "unlocked"}>
                      <span className="icon">
                        {lesson.isLocked && !isLoggedIn ? "🔒" : "▶️"}
                      </span>
                      <span className="lesson-title">{lesson.title}</span>
                      
                      {/* Demo Button Logic */}
                      {(!lesson.isLocked) && (
                        <button className="play-demo-btn">Watch Demo</button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-actions">
                {isLoggedIn ? (
                  <button className="enroll-btn">Continue Learning</button>
                ) : (
                  <button className="enroll-btn">Enroll Now to Unlock All</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesLanding;