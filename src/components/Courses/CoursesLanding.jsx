import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/courses.css';
import LandingFooter from '../Landing/LandingFooter';
import LoginProfileButton from '../Auth/LoginProfileButton';
import { useAuth } from '../Auth/AuthContext';
import { supabase } from '../../supabase';

// --- Custom SVG Performance Chart Component ---
const StudentMarksGraph = ({ marks }) => {
  // Sort marks by paper name naturally (e.g. Paper 1, Paper 2, Paper 10)
  const sortedMarks = [...marks].sort((a, b) => 
    a.paper_name.localeCompare(b.paper_name, undefined, { numeric: true, sensitivity: 'base' })
  );

  if (sortedMarks.length === 0) return null;

  // Viewport dimensions
  const width = 650;
  const height = 300;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 40;
  const paddingBottom = 50;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  // Calculate coordinates for each point
  const points = sortedMarks.map((item, index) => {
    const x = paddingLeft + (sortedMarks.length > 1 ? (index * plotWidth) / (sortedMarks.length - 1) : plotWidth / 2);
    // Marks are out of 100
    const y = paddingTop + plotHeight - (item.marks * plotHeight) / 100;
    return { x, y, ...item };
  });

  // Generate SVG paths
  let linePath = '';
  let areaPath = '';

  if (points.length > 0) {
    linePath = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;
    areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + plotHeight} L ${points[0].x} ${paddingTop + plotHeight} Z`;
  }

  // Y-axis grid levels (100, 80, 60, 40, 20, 0)
  const yLevels = [100, 80, 60, 40, 20, 0];

  return (
    <div className="graph-card">
      <h3 className="graph-title">Performance Progress</h3>
      <div className="graph-wrapper">
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" className="exam-svg-chart">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary-color, #ffc107)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--primary-color, #ffc107)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y-axis labels */}
          {yLevels.map((lvl) => {
            const y = paddingTop + plotHeight - (lvl * plotHeight) / 100;
            return (
              <g key={lvl} className="grid-group">
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="rgba(255,255,255,0.07)" 
                  strokeDasharray={lvl === 0 ? "none" : "4 4"} 
                />
                <text 
                  x={paddingLeft - 12} 
                  y={y + 4} 
                  fill="rgba(255,255,255,0.4)" 
                  fontSize="11" 
                  textAnchor="end"
                >
                  {lvl}
                </text>
              </g>
            );
          })}

          {/* Area under the line */}
          {points.length > 0 && (
            <path d={areaPath} fill="url(#chartGrad)" />
          )}

          {/* Connected line path */}
          {points.length > 0 && (
            <path 
              d={linePath} 
              fill="none" 
              stroke="var(--primary-color, #ffc107)" 
              strokeWidth="3.5" 
              strokeLinecap="round"
              strokeLinejoin="round" 
            />
          )}

          {/* Data points, labels and vertical drop lines */}
          {points.map((p, i) => (
            <g key={p.id || i} className="point-group">
              <line
                x1={p.x}
                y1={p.y}
                x2={p.x}
                y2={paddingTop + plotHeight}
                stroke="rgba(255,193,7,0.15)"
                strokeDasharray="2 2"
              />
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="6" 
                fill="#111" 
                stroke="var(--primary-color, #ffc107)" 
                strokeWidth="2.5" 
              />
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="12" 
                fill="transparent" 
                className="hover-trigger"
                style={{ cursor: 'pointer' }}
              />
              {/* Score label above circle */}
              <text 
                x={p.x} 
                y={p.y - 12} 
                fill="#fff" 
                fontSize="12" 
                fontWeight="bold" 
                textAnchor="middle"
                className="mark-label"
              >
                {p.marks}
              </text>
              {/* Paper label under plot */}
              <text 
                x={p.x} 
                y={paddingTop + plotHeight + 22} 
                fill="rgba(255,255,255,0.6)" 
                fontSize="11" 
                textAnchor="middle"
              >
                {p.paper_name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

const CoursesLanding = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'my', 'exams'
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [myCourseIds, setMyCourseIds] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingAllCourses, setLoadingAllCourses] = useState(true);

  // Exams & Marks State (Student View)
  const [studentMarks, setStudentMarks] = useState([]);
  const [loadingMarks, setLoadingMarks] = useState(false);

  // Admin Dashboard State
  const [adminSubTab, setAdminSubTab] = useState('add'); // 'add', 'search', 'manage'
  const [inputEmail, setInputEmail] = useState('');
  const [inputPaper, setInputPaper] = useState('');
  const [inputMarks, setInputMarks] = useState('');
  const [savingMark, setSavingMark] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  const [searchEmail, setSearchEmail] = useState('');
  const [searchResultMarks, setSearchResultMarks] = useState([]);
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [allStudentMarks, setAllStudentMarks] = useState([]);
  const [loadingAllMarks, setLoadingAllMarks] = useState(false);
  const [deletingMarkId, setDeletingMarkId] = useState(null);
  const [filterText, setFilterText] = useState('');

  // 1. Fetch All Courses (Standard Content)
  useEffect(() => {
    document.title = "Namal Chamodya | Learning Hub";
    window.scrollTo(0, 0);

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

  // 3. Fetch Student's Own Marks (Exams Tab - Student View)
  useEffect(() => {
    const fetchStudentMarks = async () => {
      if (!user || activeTab !== 'exams' || isAdmin) return;
      setLoadingMarks(true);
      const { data, error } = await supabase
        .from('student_marks')
        .select('*')
        .eq('student_email', user.email.trim().toLowerCase());

      if (data && !error) {
        setStudentMarks(data);
      } else if (error) {
        console.error("Error fetching student marks:", error);
      }
      setLoadingMarks(false);
    };

    fetchStudentMarks();
  }, [user, activeTab, isAdmin]);

  // 4. Fetch All Marks (Exams Tab - Admin View - Manage sub-tab)
  const fetchAllStudentMarks = async () => {
    if (!user || !isAdmin || activeTab !== 'exams') return;
    setLoadingAllMarks(true);
    const { data, error } = await supabase
      .from('student_marks')
      .select('*')
      .order('student_email')
      .order('paper_name');

    if (data && !error) {
      setAllStudentMarks(data);
    } else if (error) {
      console.error("Error fetching all marks:", error);
    }
    setLoadingAllMarks(false);
  };

  useEffect(() => {
    if (activeTab === 'exams' && isAdmin) {
      fetchAllStudentMarks();
    }
  }, [user, activeTab, isAdmin]);

  const displayedCourses = activeTab === 'all'
    ? courses
    : courses.filter(course => myCourseIds.includes(Number(course.id)));

  // 5. Submit New Marks (Admin)
  const handleAddMark = async (e) => {
    e.preventDefault();
    if (!inputEmail || !inputPaper || !inputMarks) {
      setFormMessage({ type: 'error', text: 'All fields are required.' });
      return;
    }
    const marksValue = parseInt(inputMarks);
    if (isNaN(marksValue) || marksValue < 0 || marksValue > 100) {
      setFormMessage({ type: 'error', text: 'Marks must be an integer between 0 and 100.' });
      return;
    }

    setSavingMark(true);
    setFormMessage(null);

    // Check if the mark already exists for the student & paper combination to update
    const { data: existing, error: checkError } = await supabase
      .from('student_marks')
      .select('id')
      .eq('student_email', inputEmail.trim().toLowerCase())
      .eq('paper_name', inputPaper.trim())
      .maybeSingle();

    if (checkError) {
      setFormMessage({ type: 'error', text: 'Database verification error.' });
      setSavingMark(false);
      return;
    }

    let result;
    if (existing) {
      result = await supabase
        .from('student_marks')
        .update({ marks: marksValue })
        .eq('id', existing.id);
    } else {
      result = await supabase
        .from('student_marks')
        .insert({
          student_email: inputEmail.trim().toLowerCase(),
          paper_name: inputPaper.trim(),
          marks: marksValue
        });
    }

    if (result.error) {
      setFormMessage({ type: 'error', text: 'Database save error: ' + result.error.message });
    } else {
      setFormMessage({ type: 'success', text: `Saved score of ${marksValue}% for ${inputEmail.trim().toLowerCase()} on ${inputPaper.trim()}.` });
      setInputPaper('');
      setInputMarks('');
      fetchAllStudentMarks();
    }
    setSavingMark(false);
  };

  // 6. Search Individual Student Progress (Admin)
  const handleSearchStudent = async (e) => {
    e.preventDefault();
    if (!searchEmail) return;
    setSearchingStudent(true);
    setSearchError('');
    setSearchResultMarks([]);

    const { data, error } = await supabase
      .from('student_marks')
      .select('*')
      .eq('student_email', searchEmail.trim().toLowerCase());

    if (error) {
      setSearchError('Error performing search: ' + error.message);
    } else if (!data || data.length === 0) {
      setSearchError('No records found for this email address.');
    } else {
      setSearchResultMarks(data);
    }
    setSearchingStudent(false);
  };

  // 7. Delete Marks Records (Admin)
  const handleDeleteMark = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mark record?")) return;
    setDeletingMarkId(id);
    const { error } = await supabase
      .from('student_marks')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting record: " + error.message);
    } else {
      // Refresh active lists
      fetchAllStudentMarks();
      if (searchEmail) {
        const { data } = await supabase
          .from('student_marks')
          .select('*')
          .eq('student_email', searchEmail.trim().toLowerCase());
        setSearchResultMarks(data || []);
      }
    }
    setDeletingMarkId(null);
  };

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

  // --- Student Dashboard Render Function ---
  const renderStudentDashboard = () => {
    if (loadingMarks) {
      return (
        <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
          <h3>Loading your progress dashboard...</h3>
        </div>
      );
    }

    if (studentMarks.length === 0) {
      return (
        <div className="exams-empty-state">
          <h3>No Exam Marks Found</h3>
          <p>You don't have any marks recorded yet. Once the administrator adds your marks, your progress history will appear here.</p>
        </div>
      );
    }

    const totalExams = studentMarks.length;
    const totalMarksSum = studentMarks.reduce((sum, item) => sum + Number(item.marks), 0);
    const averageScore = Math.round(totalMarksSum / totalExams);
    const highestScore = Math.max(...studentMarks.map(item => Number(item.marks)));

    return (
      <div className="exams-student-dash">
        <div className="stats-bar">
          <div className="stat-card">
            <h4>Exams Taken</h4>
            <p className="stat-value">{totalExams}</p>
          </div>
          <div className="stat-card">
            <h4>Average Mark</h4>
            <p className="stat-value">{averageScore}%</p>
          </div>
          <div className="stat-card">
            <h4>Highest Mark</h4>
            <p className="stat-value">{highestScore}%</p>
          </div>
        </div>

        <StudentMarksGraph marks={studentMarks} />

        <div className="marks-history-card">
          <h3>Detailed Marks History</h3>
          <div className="table-responsive">
            <table className="marks-table">
              <thead>
                <tr>
                  <th>Paper Name</th>
                  <th>Marks</th>
                  <th>Date Recorded</th>
                </tr>
              </thead>
              <tbody>
                {[...studentMarks]
                  .sort((a, b) => b.paper_name.localeCompare(a.paper_name, undefined, { numeric: true, sensitivity: 'base' }))
                  .map((item) => (
                    <tr key={item.id}>
                      <td className="paper-cell">{item.paper_name}</td>
                      <td className="marks-cell">
                        <span className={`marks-badge ${item.marks >= 75 ? 'grade-a' : item.marks >= 50 ? 'grade-c' : 'grade-w'}`}>
                          {item.marks} / 100
                        </span>
                      </td>
                      <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- Admin Dashboard Render Function ---
  const renderAdminDashboard = () => {
    return (
      <div className="exams-admin-dash">
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${adminSubTab === 'add' ? 'active' : ''}`}
            onClick={() => { setAdminSubTab('add'); setFormMessage(null); }}
          >
            ➕ Add / Update Marks
          </button>
          <button
            className={`admin-tab-btn ${adminSubTab === 'search' ? 'active' : ''}`}
            onClick={() => { setAdminSubTab('search'); setSearchError(''); }}
          >
            🔍 Student Graph Lookup
          </button>
          <button
            className={`admin-tab-btn ${adminSubTab === 'manage' ? 'active' : ''}`}
            onClick={() => { setAdminSubTab('manage'); fetchAllStudentMarks(); }}
          >
            📋 Manage All Marks
          </button>
        </div>

        {/* Sub-tab Content Panels */}
        {adminSubTab === 'add' && (
          <div className="admin-card">
            <h3>Add or Update Student Mark</h3>
            <form onSubmit={handleAddMark} className="admin-form">
              {formMessage && (
                <div className={`form-alert alert-${formMessage.type}`}>
                  {formMessage.text}
                </div>
              )}
              
              <div className="form-group">
                <label>Student Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@gmail.com"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Paper Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paper 1, Paper 2, Term Exam"
                  value={inputPaper}
                  onChange={(e) => setInputPaper(e.target.value)}
                />
                <div className="paper-suggestions">
                  <span className="suggestion-label">Suggestions:</span>
                  {['Paper 1', 'Paper 2', 'Paper 3', 'Paper 4'].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      className="suggestion-btn"
                      onClick={() => setInputPaper(sug)}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Marks (0 - 100)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  placeholder="Enter score"
                  value={inputMarks}
                  onChange={(e) => setInputMarks(e.target.value)}
                />
              </div>

              <button type="submit" className="form-btn" disabled={savingMark}>
                {savingMark ? 'Saving Record...' : 'Save Student Mark'}
              </button>
            </form>
          </div>
        )}

        {adminSubTab === 'search' && (
          <div className="admin-card">
            <h3>Lookup Student Performance History</h3>
            <form onSubmit={handleSearchStudent} className="search-bar-inline">
              <input
                type="email"
                required
                placeholder="Enter student email, e.g., student@gmail.com"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
              <button type="submit" className="form-btn inline-btn" disabled={searchingStudent}>
                {searchingStudent ? 'Searching...' : 'Search'}
              </button>
            </form>

            {searchError && (
              <div className="form-alert alert-error" style={{ marginTop: '20px' }}>
                {searchError}
              </div>
            )}

            {searchResultMarks.length > 0 && (
              <div className="search-results" style={{ marginTop: '30px' }}>
                <h4 style={{ color: 'var(--primary-color)', marginBottom: '20px', fontSize: '1.2rem' }}>
                  Showing records for: <span style={{ color: '#fff' }}>{searchEmail}</span>
                </h4>
                
                <StudentMarksGraph marks={searchResultMarks} />

                <div className="table-responsive" style={{ marginTop: '20px' }}>
                  <table className="marks-table">
                    <thead>
                      <tr>
                        <th>Paper Name</th>
                        <th>Marks</th>
                        <th>Date Recorded</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...searchResultMarks]
                        .sort((a, b) => b.paper_name.localeCompare(a.paper_name, undefined, { numeric: true, sensitivity: 'base' }))
                        .map((item) => (
                          <tr key={item.id}>
                            <td>{item.paper_name}</td>
                            <td><strong>{item.marks} / 100</strong></td>
                            <td>{new Date(item.created_at).toLocaleDateString()}</td>
                            <td>
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteMark(item.id)}
                                disabled={deletingMarkId === item.id}
                              >
                                {deletingMarkId === item.id ? 'Deleting...' : '🗑 Delete'}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {adminSubTab === 'manage' && (
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <h3>Manage All Student Marks ({allStudentMarks.length})</h3>
              <input
                type="text"
                placeholder="Filter by Student Email or Paper..."
                className="table-filter-input"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid #333',
                  padding: '8px 15px',
                  borderRadius: '5px',
                  color: 'white',
                  fontSize: '0.9rem',
                  minWidth: '250px'
                }}
              />
            </div>

            {loadingAllMarks ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#fff' }}>
                <h4>Loading marks history...</h4>
              </div>
            ) : allStudentMarks.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '30px' }}>No student marks recorded in the database yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="marks-table">
                  <thead>
                    <tr>
                      <th>Student Email</th>
                      <th>Paper Name</th>
                      <th>Marks</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allStudentMarks
                      .filter(item => 
                        item.student_email.toLowerCase().includes(filterText.toLowerCase()) ||
                        item.paper_name.toLowerCase().includes(filterText.toLowerCase())
                      )
                      .map((item) => (
                        <tr key={item.id}>
                          <td style={{ color: '#fff', fontWeight: '500' }}>{item.student_email}</td>
                          <td>{item.paper_name}</td>
                          <td><strong>{item.marks} / 100</strong></td>
                          <td>{new Date(item.created_at).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteMark(item.id)}
                              disabled={deletingMarkId === item.id}
                            >
                              {deletingMarkId === item.id ? 'Deleting...' : '🗑 Delete'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="courses-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* --- Mobile Navbar --- */}
      <nav className="course-navbar">
        <button className="back-link" onClick={() => navigate('/')}>
          ← Back
        </button>

        <div className="auth-buttons" style={{ display: 'flex' }}>
          <LoginProfileButton />
        </div>
      </nav>

      {/* --- Header --- */}
      <header className="courses-header">
        <h1>Namal's Learning <span className="highlight">Hub</span></h1>
        <p>Master ICT & Design. Select a course to start learning.</p>

        {/* --- Filter Tabs including Exams --- */}
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
          <button
            className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            Exams
          </button>
        </div>
      </header>

      {/* --- Page Main Content Area --- */}
      <div style={{ flex: '1', width: '100%' }}>
        {activeTab === 'exams' ? (
          <div className="exams-container">
            {!user ? (
              <div className="exams-empty-state">
                <h3>Please Login First</h3>
                <p>You need to be signed in to view your exam marks and progress history.</p>
              </div>
            ) : isAdmin ? (
              renderAdminDashboard()
            ) : (
              renderStudentDashboard()
            )}
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