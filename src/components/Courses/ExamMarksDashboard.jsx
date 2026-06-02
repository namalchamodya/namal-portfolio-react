import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { useAuth } from '../Auth/AuthContext';

// --- Custom SVG Performance Chart Component ---
const StudentMarksGraph = ({ marks }) => {
  // Sort marks by paper name naturally (e.g. Paper 1, Paper 2, Paper 10)
  const sortedMarks = [...(marks || [])].sort((a, b) => 
    (a.paper_name || '').localeCompare(b.paper_name || '', undefined, { numeric: true, sensitivity: 'base' })
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
    const marksVal = Number(item.marks) || 0;
    const y = paddingTop + plotHeight - (marksVal * plotHeight) / 100;
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

const ExamMarksDashboard = () => {
  const { user, profile, isAdmin } = useAuth();
  
  // Student View State
  const [studentMarks, setStudentMarks] = useState([]);
  const [loadingMarks, setLoadingMarks] = useState(false);

  // Admin View State
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

  // Fetch Student's Own Marks
  useEffect(() => {
    const fetchStudentMarks = async () => {
      if (!user || !user.email || isAdmin) return;
      setLoadingMarks(true);
      const { data, error } = await supabase
        .from('student_marks')
        .select('*')
        .eq('student_email', user.email.trim().toLowerCase());

      if (data && !error) {
        setStudentMarks(data || []);
      } else if (error) {
        console.error("Error fetching student marks:", error);
      }
      setLoadingMarks(false);
    };

    fetchStudentMarks();
  }, [user, isAdmin]);

  // Fetch All Marks (Admin View)
  const fetchAllStudentMarks = async () => {
    if (!user || !isAdmin) return;
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
    if (isAdmin) {
      fetchAllStudentMarks();
    }
  }, [user, isAdmin]);

  // Admin: Add Marks
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

    const isId = !inputEmail.includes('@');
    let searchValue = inputEmail.trim();

    if (isId && /^\d+$/.test(searchValue)) {
      searchValue = searchValue.padStart(6, '0');
    }

    let profileQuery = supabase.from('profiles').select('email, student_id');
    if (isId) {
      profileQuery = profileQuery.eq('student_id', searchValue).maybeSingle();
    } else {
      profileQuery = profileQuery.eq('email', searchValue.toLowerCase()).maybeSingle();
    }

    const { data: profileData, error: profileError } = await profileQuery;
    if (profileError || !profileData) {
      setFormMessage({ type: 'error', text: 'Student not found. Please ensure the email or ID is correct and the student has logged in at least once.' });
      setSavingMark(false);
      return;
    }

    const resolvedEmail = profileData.email;
    const resolvedId = profileData.student_id;

    if (!resolvedEmail) {
      setFormMessage({ type: 'error', text: 'Student profile found, but their email is missing. Please ask the student to log out and log back in to sync their email, or run the database sync script.' });
      setSavingMark(false);
      return;
    }

    const { data: existing, error: checkError } = await supabase
      .from('student_marks')
      .select('id')
      .eq('student_email', resolvedEmail)
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
        .update({ marks: marksValue, student_id: resolvedId })
        .eq('id', existing.id);
    } else {
      result = await supabase
        .from('student_marks')
        .insert({
          student_email: resolvedEmail,
          student_id: resolvedId,
          paper_name: inputPaper.trim(),
          marks: marksValue
        });
    }

    if (result.error) {
      setFormMessage({ type: 'error', text: 'Database save error: ' + result.error.message });
    } else {
      setFormMessage({ type: 'success', text: `Saved score of ${marksValue}% for ${resolvedEmail} (ID: ${resolvedId}) on ${inputPaper.trim()}.` });
      setInputPaper('');
      setInputMarks('');
      fetchAllStudentMarks();
    }
    setSavingMark(false);
  };

  // Admin: Search Marks
  const handleSearchStudent = async (e) => {
    e.preventDefault();
    if (!searchEmail) return;
    setSearchingStudent(true);
    setSearchError('');
    setSearchResultMarks([]);

    let searchValue = searchEmail.trim();
    const isId = !searchValue.includes('@');

    if (isId && /^\d+$/.test(searchValue)) {
      searchValue = searchValue.padStart(6, '0');
    }

    let query = supabase.from('student_marks').select('*');
    if (isId) {
      query = query.eq('student_id', searchValue);
    } else {
      query = query.eq('student_email', searchValue.toLowerCase());
    }

    const { data, error } = await query;

    if (error) {
      setSearchError('Error performing search: ' + error.message);
    } else if (!data || data.length === 0) {
      setSearchError('No records found for this student.');
    } else {
      setSearchResultMarks(data);
    }
    setSearchingStudent(false);
  };

  // Admin: Delete Mark
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

  if (!user) {
    return (
      <div className="exams-empty-state">
        <h3>Please Login First</h3>
        <p>You need to be signed in to view your exam marks and progress history.</p>
      </div>
    );
  }

  // --- Admin View ---
  if (isAdmin) {
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
                <label>Student Email or ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. student@gmail.com or 000023"
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
                type="text"
                required
                placeholder="Enter student email or ID, e.g., student@gmail.com or 000023"
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
                placeholder="Filter by Email, ID, or Paper..."
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
                      <th>Student ID</th>
                      <th>Paper Name</th>
                      <th>Marks</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allStudentMarks
                      .filter(item => 
                        (item.student_email && item.student_email.toLowerCase().includes(filterText.toLowerCase())) ||
                        (item.student_id && item.student_id.toLowerCase().includes(filterText.toLowerCase())) ||
                        (item.paper_name && item.paper_name.toLowerCase().includes(filterText.toLowerCase()))
                      )
                      .map((item) => (
                        <tr key={item.id}>
                          <td style={{ color: '#fff', fontWeight: '500' }}>{item.student_email}</td>
                          <td>{item.student_id || '-'}</td>
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
  }

  // --- Student View ---
  if (loadingMarks) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
        <h3>Loading your progress dashboard...</h3>
      </div>
    );
  }

  if (!studentMarks || studentMarks.length === 0) {
    return (
      <div className="exams-empty-state">
        <h3>No Exam Marks Found</h3>
        <p>You don't have any marks recorded yet. Once the administrator adds your marks, your progress history will appear here.</p>
      </div>
    );
  }

  const totalExams = studentMarks.length;
  const totalMarksSum = studentMarks.reduce((sum, item) => sum + (Number(item.marks) || 0), 0);
  const averageScore = totalExams > 0 ? Math.round(totalMarksSum / totalExams) : 0;
  const highestScore = totalExams > 0 ? Math.max(...studentMarks.map(item => Number(item.marks) || 0)) : 0;

  return (
    <div className="exams-student-dash">
      <div style={{ textAlign: 'center', marginBottom: '20px', color: '#ccc' }}>
        {profile?.student_id ? `Your Student ID: ${profile.student_id}` : `Logged in as: ${user?.email}`}
      </div>
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
                .sort((a, b) => (b.paper_name || '').localeCompare(a.paper_name || '', undefined, { numeric: true, sensitivity: 'base' }))
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

export default ExamMarksDashboard;
