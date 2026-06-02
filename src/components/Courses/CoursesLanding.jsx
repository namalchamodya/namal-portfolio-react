import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/courses.css';
import LandingFooter from '../Landing/LandingFooter';
import LoginProfileButton from '../Auth/LoginProfileButton';
import { useAuth } from '../Auth/AuthContext';
import { supabase } from '../../supabase';
import ExamMarksDashboard from './ExamMarksDashboard';
import AdminCourseManager from './AdminCourseManager';

const CoursesLanding = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get('tab') || 'all';

  const [activeTab, setActiveTab] = useState(tabFromUrl); // 'all', 'my', 'exams', 'admin'
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/courses?tab=${tab}`);
  };
  
  const [myCourseIds, setMyCourseIds] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingAllCourses, setLoadingAllCourses] = useState(true);

  // 1. Fetch All Courses (Standard Content)
  const fetchAllCourses = async () => {
    setLoadingAllCourses(true);
    const { data, error } = await supabase
      .from('courses')
      .select('*, course_lessons(*)');

    if (data && !error) {
      const formattedData = data.map(c => ({
        ...c,
        lessons: (c.course_lessons || []).sort((a, b) => a.order_index - b.order_index),
        thumbnail: c.thumbnail_url || '/art/Namal_ict.png',
        priceFormatted: c.price == 0 ? "Free" : `LKR ${Number(c.price).toLocaleString()}`
      }));
      setCourses(formattedData);
    } else if (error) {
      console.error("Error fetching courses data:", error);
    }
    setLoadingAllCourses(false);
  };

  useEffect(() => {
    document.title = "Namal Chamodya | Learning Hub";
    window.scrollTo(0, 0);
    fetchAllCourses();
  }, []);

  // 2. Fetch User Course Enrollments
  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user) {
        setMyCourseIds([]);
        return;
      }
      setLoadingCourses(true);
      const { data, error } = await supabase
        .from('user_enrollments')
        .select('course_id, access_status')
        .eq('user_id', user.id);

      if (!error && data) {
        const activeIds = data
          .filter(e => e.access_status && e.access_status.trim().toLowerCase() === 'active')
          .map(e => Number(e.course_id));
        setMyCourseIds(activeIds);
      } else if (error) {
        console.error("Error fetching courses:", error);
      }
      setLoadingCourses(false);
    };

    fetchMyCourses();
  }, [user]);

  const displayedCourses = activeTab === 'all'
    ? courses
    : courses.filter(course => myCourseIds.includes(Number(course.id)));

  const handleEnrollClick = async (e, course) => {
    e.stopPropagation();

    if (myCourseIds.includes(Number(course.id))) {
      navigate(`/course/${course.id}`);
      return;
    }

    if (!user) {
      alert("Please login first to enroll in this course.");
      return;
    }

    const { data: existing } = await supabase
      .from('user_enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single();

    if (!existing) {
      await supabase.from('user_enrollments').insert({
        user_id: user.id,
        course_id: course.id,
        access_status: 'pending'
      });
    }

    const message = `Hi Namal, I am ${user.user_metadata?.full_name || user.email || 'a student'} and I want to enroll in the course: ${course.title}. Here is my payment slip:`;
    window.open(`https://wa.me/94770311025?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="courses-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>



      {/* --- Header --- */}
      <header className="courses-header">
        <h1>Namal's Learning <span className="highlight">Hub</span></h1>
        <p>Master ICT & Design. Select a course to start learning.</p>

        {/* --- Filter Tabs including Exams --- */}
        <div className="course-tabs">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabClick('all')}
          >
            All Courses
          </button>
          <button
            className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => handleTabClick('my')}
          >
            My Courses
          </button>
          <button
            className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => handleTabClick('exams')}
          >
            Exams
          </button>
          {isAdmin && (
            <button
              className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => handleTabClick('admin')}
              style={{ background: activeTab === 'admin' ? '#ff4b4b' : 'rgba(255, 75, 75, 0.1)', color: activeTab === 'admin' ? '#fff' : '#ff4b4b', borderColor: '#ff4b4b' }}
            >
              ⚙️ Manage Courses
            </button>
          )}
        </div>
      </header>

      {/* --- Page Main Content Area --- */}
      <div style={{ flex: '1', width: '100%' }}>
        {activeTab === 'admin' && isAdmin ? (
          <div className="admin-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <AdminCourseManager key="admin-course-manager" courses={courses} fetchAllCourses={fetchAllCourses} loadingAllCourses={loadingAllCourses} />
          </div>
        ) : activeTab === 'exams' ? (
          <div className="exams-container">
            <ExamMarksDashboard />
          </div>
        ) : (
          /* --- Original Courses Grid --- */
          <div className="courses-grid">
            {(loadingCourses && activeTab === 'my') || loadingAllCourses ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#fff' }}>
                <h3>Loading courses...</h3>
              </div>
            ) : displayedCourses.length > 0 ? (
              displayedCourses.map((course) => (
                <div
                  key={course.id}
                  className="course-card"
                  onClick={() => navigate(`/course/${course.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="course-thumb">
                    <img src={course.thumbnail} alt={course.title} />
                    <div className="price-tag">{course.priceFormatted}</div>
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
                          <li style={{ color: '#666', fontSize: '0.8rem', justifyContent: 'center', borderBottom: 'none' }}>
                            + {course.lessons.length - 3} more lessons
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="card-actions">
                      {myCourseIds.includes(Number(course.id)) ? (
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/course/${course.id}`); }} className="enroll-btn" style={{ width: '100%', textAlign: 'center', display: 'block', border: 'none', cursor: 'pointer', background: '#25D366' }}>
                          Go to Course
                        </button>
                      ) : (
                        <button onClick={(e) => handleEnrollClick(e, course)} className="enroll-btn" style={{ width: '100%', textAlign: 'center', display: 'block', border: 'none', cursor: 'pointer' }}>
                          Enroll Now - {course.priceFormatted}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#888' }}>
                {!user ? (
                  <>
                    <h3>Please Login First</h3>
                    <p>You need to be signed in to view your enrolled courses.</p>
                  </>
                ) : (
                  <>
                    <h3>You haven't purchased any courses yet.</h3>
                    <p>Browse our 'All Courses' section and start learning today!</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', width: '100%', bottom: 0 }}></div>
      <LandingFooter />
    </div>
  );
};

export default CoursesLanding;