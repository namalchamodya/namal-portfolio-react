import React, { useState } from 'react';
import { supabase } from '../../supabase';

const AdminCourseManager = ({ courses, fetchAllCourses, loadingAllCourses }) => {
  const [editingCourse, setEditingCourse] = useState(null); // null, 'new', or course object
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
    price_tier: 'paid',
    price: 0
  });
  const [courseFormMessage, setCourseFormMessage] = useState(null);
  const [savingCourse, setSavingCourse] = useState(false);

  const [editingLesson, setEditingLesson] = useState(null); // null, 'new', or lesson object
  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    isLocked: true,
    videoId: '',
    duration: '00:00',
    order_index: 0
  });
  const [savingLesson, setSavingLesson] = useState(false);

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseFormData({
      title: course.title || '',
      description: course.description || '',
      thumbnail_url: course.thumbnail_url || '',
      price_tier: course.price_tier || 'paid',
      price: course.price || 0
    });
    setCourseFormMessage(null);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setSavingCourse(true);
    setCourseFormMessage(null);

    const isNew = editingCourse === 'new';
    
    let payload = {
      title: courseFormData.title,
      description: courseFormData.description,
      thumbnail_url: courseFormData.thumbnail_url,
      price_tier: courseFormData.price_tier,
      price: parseFloat(courseFormData.price) || 0
    };

    let errorResult = null;
    let newCourseData = null;

    if (isNew) {
      const { data: maxIdData } = await supabase.from('courses').select('id').order('id', { ascending: false }).limit(1);
      const nextId = (maxIdData && maxIdData.length > 0) ? parseInt(maxIdData[0].id) + 1 : 1;
      payload.id = nextId;

      const { data, error } = await supabase.from('courses').insert(payload).select().single();
      errorResult = error;
      newCourseData = data;
    } else {
      const { data, error } = await supabase.from('courses').update(payload).eq('id', editingCourse.id).select().single();
      errorResult = error;
      newCourseData = data;
    }

    if (errorResult) {
      setCourseFormMessage({ type: 'error', text: 'Error saving course: ' + errorResult.message });
    } else {
      setCourseFormMessage({ type: 'success', text: 'Course saved successfully!' });
      await fetchAllCourses();
      
      if (isNew && newCourseData) {
        setEditingCourse({ ...newCourseData, lessons: [] });
      } else if (!isNew) {
        setEditingCourse(prev => ({ ...prev, ...payload }));
      }
    }
    setSavingCourse(false);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This will also delete all associated lessons and enrollments. This cannot be undone.")) return;
    
    await supabase.from('course_lessons').delete().eq('course_id', courseId);
    await supabase.from('user_enrollments').delete().eq('course_id', courseId);
    
    const { error } = await supabase.from('courses').delete().eq('id', courseId);
    if (error) {
      alert("Error deleting course: " + error.message);
    } else {
      fetchAllCourses();
      if (editingCourse && editingCourse.id === courseId) {
        setEditingCourse(null);
      }
    }
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setLessonFormData({
      title: lesson.title || '',
      isLocked: lesson.isLocked !== undefined ? lesson.isLocked : true,
      videoId: lesson.videoId || '',
      duration: lesson.duration || '00:00',
      order_index: lesson.order_index || 0
    });
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!editingCourse || editingCourse === 'new') {
      alert("Please save the course first before adding lessons.");
      return;
    }

    setSavingLesson(true);

    const isNewLesson = !editingLesson;
    const payload = {
      course_id: editingCourse.id,
      title: lessonFormData.title,
      isLocked: lessonFormData.isLocked,
      videoId: lessonFormData.videoId,
      duration: lessonFormData.duration,
      order_index: lessonFormData.order_index
    };

    let errorResult;

    if (isNewLesson) {
      const { error } = await supabase.from('course_lessons').insert(payload);
      errorResult = error;
    } else {
      const { error } = await supabase.from('course_lessons').update(payload).eq('id', editingLesson.id);
      errorResult = error;
    }

    if (errorResult) {
      alert('Error saving lesson: ' + errorResult.message);
    } else {
      setEditingLesson(null);
      setLessonFormData({ title: '', isLocked: true, videoId: '', duration: '00:00', order_index: 0 });
      await fetchAllCourses();
      
      const { data } = await supabase.from('course_lessons').select('*').eq('course_id', editingCourse.id).order('order_index');
      if (data) {
        setEditingCourse(prev => ({ ...prev, lessons: data }));
      }
    }
    setSavingLesson(false);
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    
    const { error } = await supabase.from('course_lessons').delete().eq('id', lessonId);
    if (error) {
      alert("Error deleting lesson: " + error.message);
    } else {
      await fetchAllCourses();
      const { data } = await supabase.from('course_lessons').select('*').eq('course_id', editingCourse.id).order('order_index');
      if (data) {
        setEditingCourse(prev => ({ ...prev, lessons: data }));
      }
    }
  };

  if (editingCourse) {
    return (
      <div className="admin-course-editor">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>{editingCourse === 'new' ? 'Add New Course' : `Edit Course: ${courseFormData.title}`}</h3>
          <button className="back-link" onClick={() => setEditingCourse(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
            ← Back to Courses
          </button>
        </div>

        <form onSubmit={handleSaveCourse} className="admin-form">
          {courseFormMessage && (
            <div className={`form-alert alert-${courseFormMessage.type}`}>
              {courseFormMessage.text}
            </div>
          )}
          
          <div className="form-group">
            <label>Course Title</label>
            <input
              type="text"
              required
              value={courseFormData.title}
              onChange={(e) => setCourseFormData({...courseFormData, title: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              required
              rows="4"
              value={courseFormData.description}
              onChange={(e) => setCourseFormData({...courseFormData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Thumbnail URL</label>
            <input
              type="text"
              value={courseFormData.thumbnail_url}
              onChange={(e) => setCourseFormData({...courseFormData, thumbnail_url: e.target.value})}
              placeholder="e.g. /art/Namal_ict.png"
            />
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Price Tier</label>
              <select 
                value={courseFormData.price_tier} 
                onChange={(e) => setCourseFormData({...courseFormData, price_tier: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #333' }}
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Price (LKR)</label>
              <input
                type="number"
                min="0"
                value={courseFormData.price}
                onChange={(e) => setCourseFormData({...courseFormData, price: e.target.value})}
                disabled={courseFormData.price_tier === 'free'}
              />
            </div>
          </div>

          <button type="submit" className="form-btn" disabled={savingCourse}>
            {savingCourse ? 'Saving Course...' : 'Save Course Details'}
          </button>
        </form>

        {editingCourse !== 'new' && (
          <div className="admin-lessons-manager" style={{ marginTop: '40px' }}>
            <hr style={{ borderColor: '#333', marginBottom: '20px' }} />
            <h3>Course Lessons</h3>
            
            <div className="lesson-list-admin" style={{ marginBottom: '20px' }}>
              {editingCourse.lessons && editingCourse.lessons.length > 0 ? (
                <table className="marks-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Title</th>
                      <th>Locked</th>
                      <th>Duration</th>
                      <th>Video ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editingCourse.lessons.map(lesson => (
                      <tr key={lesson.id}>
                        <td>{lesson.order_index}</td>
                        <td>{lesson.title}</td>
                        <td>{lesson.isLocked ? '🔒 Yes' : '🔓 No'}</td>
                        <td>{lesson.duration}</td>
                        <td>{lesson.videoId}</td>
                        <td>
                          <button className="edit-btn" onClick={() => handleEditLesson(lesson)} style={{ marginRight: '10px', background: 'transparent', border: 'none', color: '#4facfe', cursor: 'pointer' }}>✏️ Edit</button>
                          <button className="delete-btn" onClick={() => handleDeleteLesson(lesson.id)} style={{ background: 'transparent', border: 'none', color: '#ff4b4b', cursor: 'pointer' }}>🗑 Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#888' }}>No lessons added to this course yet.</p>
              )}
            </div>

            <div className="admin-card" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <h4>{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</h4>
              <form onSubmit={handleSaveLesson} className="admin-form">
                <div className="form-group">
                  <label>Lesson Title</label>
                  <input
                    type="text"
                    required
                    value={lessonFormData.title}
                    onChange={(e) => setLessonFormData({...lessonFormData, title: e.target.value})}
                  />
                </div>
                
                <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Video ID (YouTube etc.)</label>
                    <input
                      type="text"
                      required
                      value={lessonFormData.videoId}
                      onChange={(e) => setLessonFormData({...lessonFormData, videoId: e.target.value})}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Duration (MM:SS)</label>
                    <input
                      type="text"
                      value={lessonFormData.duration}
                      onChange={(e) => setLessonFormData({...lessonFormData, duration: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Order Index</label>
                    <input
                      type="number"
                      value={lessonFormData.order_index}
                      onChange={(e) => setLessonFormData({...lessonFormData, order_index: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1, display: 'flex', alignItems: 'center', paddingTop: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={lessonFormData.isLocked}
                        onChange={(e) => setLessonFormData({...lessonFormData, isLocked: e.target.checked})}
                        style={{ width: 'auto', marginRight: '10px' }}
                      />
                      Is Locked (Requires Enrollment)
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="form-btn" disabled={savingLesson} style={{ flex: 1 }}>
                    {savingLesson ? 'Saving...' : (editingLesson ? 'Update Lesson' : 'Add Lesson')}
                  </button>
                  {editingLesson && (
                    <button type="button" className="form-btn" onClick={() => {
                      setEditingLesson(null);
                      setLessonFormData({ title: '', isLocked: true, videoId: '', duration: '00:00', order_index: 0 });
                    }} style={{ flex: 1, background: '#333' }}>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="admin-course-dash">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Manage Courses</h3>
        <button 
          className="form-btn" 
          style={{ width: 'auto', padding: '10px 20px', margin: 0 }}
          onClick={() => {
            setEditingCourse('new');
            setCourseFormData({ title: '', description: '', thumbnail_url: '', price_tier: 'paid', price: 0 });
            setCourseFormMessage(null);
          }}
        >
          ➕ Add New Course
        </button>
      </div>

      {loadingAllCourses ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#fff' }}>Loading courses...</div>
      ) : (
        <div className="table-responsive">
          <table className="marks-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Course Title</th>
                <th>Price</th>
                <th>Lessons</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td>
                    <img src={course.thumbnail} alt={course.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td><strong>{course.title}</strong></td>
                  <td>{course.priceFormatted}</td>
                  <td>{course.lessons?.length || 0} lessons</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditCourse(course)} style={{ marginRight: '10px', background: 'transparent', border: 'none', color: '#4facfe', cursor: 'pointer' }}>✏️ Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteCourse(course.id)} style={{ background: 'transparent', border: 'none', color: '#ff4b4b', cursor: 'pointer' }}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCourseManager;
