import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/coursePlayer.css';
import LandingFooter from '../Landing/LandingFooter';
import { supabase } from '../../supabase';

const CoursePlayer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [lessonDurations, setLessonDurations] = useState({});
  const [demoEnded, setDemoEnded] = useState(false);

  // Full Screen State
  const [isFullScreen, setIsFullScreen] = useState(false);

  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const videoContainerRef = useRef(null);

  // 1. Course
  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*, course_lessons(*)')
        .eq('id', parseInt(id))
        .single();

      if (data && !error) {
        // Sort the lessons just like we stored them
        const sortedLessons = (data.course_lessons || []).sort((a, b) => a.order_index - b.order_index);
        const fetchedCourse = { ...data, lessons: sortedLessons };

        setCourse(fetchedCourse);
        if (sortedLessons.length > 0) {
          setCurrentLesson(sortedLessons[0]);
        }
      } else {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourse();
    window.scrollTo(0, 0);
  }, [id]);

  // Full Screen
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  // 2. Video Player Setup
  useEffect(() => {
    if (!currentLesson) return;

    if (playerRef.current) {
      try {
        if (typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }
      } catch (e) { }
      playerRef.current = null;
    }

    // Reset States
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(false);

    const timer = setTimeout(() => {
      if (window.YT && window.YT.Player) {
        initializePlayer(currentLesson.videoId);
      } else {
        if (!document.getElementById('youtube-api-script')) {
          const tag = document.createElement('script');
          tag.id = 'youtube-api-script';
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
        window.onYouTubeIframeAPIReady = () => {
          initializePlayer(currentLesson.videoId);
        };
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      stopProgressTimer();
    };
  }, [currentLesson]);

  const initializePlayer = (videoId) => {
    if (!document.getElementById('youtube-player')) return;

    playerRef.current = new window.YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: {
        'autoplay': 0, 'controls': 0, 'rel': 0, 'showinfo': 0,
        'modestbranding': 1, 'disablekb': 1, 'fs': 0, 'iv_load_policy': 3
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  };

  const onPlayerReady = (event) => {
    if (event.target && typeof event.target.getDuration === 'function') {
      const vidDuration = event.target.getDuration();
      setDuration(vidDuration);
      setVolume(event.target.getVolume());

      if (currentLesson && vidDuration > 0) {
        const formatted = formatTime(vidDuration);
        setLessonDurations(prev => ({
          ...prev,
          [currentLesson.id]: formatted
        }));
      }
    }
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startProgressTimer();
    } else {
      setIsPlaying(false);
      stopProgressTimer();
    }
  };

  const startProgressTimer = () => {
    stopProgressTimer();
    intervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const time = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();

        // 15-Minute Demo Constraint Logic
        // In real db, would check enrollment access_status instead of just course_price here
        if (course && course.price !== 'Free' && time >= 900) {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
          setDemoEnded(true);
          return;
        }

        setCurrentTime(time);
        if (total > 0) setProgress((time / total) * 100);
      }
    }, 1000);
  };

  const stopProgressTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const togglePlay = () => {
    if (demoEnded) return; // Stop user from playing if demo limit is reached
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      if (isPlaying) playerRef.current.pauseVideo();
      else playerRef.current.playVideo();
    }
  };

  // ✅ Full Screen Toggle Function
  const toggleFullScreen = () => {
    if (!videoContainerRef.current) return;

    if (!document.fullscreenElement) {
      // Enter Full Screen
      videoContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      // Exit Full Screen
      document.exitFullscreen();
    }
  };

  const handleSeek = (e) => {
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      const newPercentage = e.target.value;
      const newTime = (playerRef.current.getDuration() / 100) * newPercentage;
      playerRef.current.seekTo(newTime, true);
      setProgress(newPercentage);
      setCurrentTime(newTime);
    }
  };

  const handleVolume = (e) => {
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      const newVol = e.target.value;
      playerRef.current.setVolume(newVol);
      setVolume(newVol);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  if (!course) return <div className="loading-msg" style={{ color: 'white', padding: '50px' }}>Loading...</div>;

  return (
    <div className="course-page-wrapper">
      <div className="player-container">
        <div className="player-nav">
          <Link to="/courses" className="back-btn">← Back to Courses</Link>
          <h2>{course.title}</h2>
        </div>

        <div className="player-layout">
          <div className="video-area">

            <div className="video-wrapper custom-controls-wrapper" ref={videoContainerRef}>
              <div id="youtube-player"></div>

              {/* Double click කළාම Fullscreen*/}
              <div className="video-overlay" onClick={togglePlay} onDoubleClick={toggleFullScreen}></div>

              {demoEnded && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                  <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>Demo Completed (15 mins)</h3>
                  <p style={{ marginBottom: '20px', color: '#ccc' }}>Please enroll to continue watching the rest of this course.</p>
                  <a href={`https://wa.me/94770311025?text=Hi%20Namal,%20I%20want%20to%20enroll%20in%20the%20course:%20${course?.title}.%20Here%20is%20my%20payment%20slip:`} target="_blank" rel="noreferrer" style={{ backgroundColor: '#25D366', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                    Enroll via WhatsApp
                  </a>
                </div>
              )}

              <div className="custom-controls">
                <input
                  type="range" className="progress-bar" min="0" max="100"
                  value={progress} onChange={handleSeek}
                />
                <div className="controls-row">
                  <div className="left-controls">
                    <button className="ctrl-btn play-btn" onClick={togglePlay}>
                      {isPlaying ? "⏸" : "▶"}
                    </button>
                    <span className="time-display">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <div className="right-controls">
                    <span className="vol-icon">🔊</span>
                    <input
                      type="range" className="volume-slider" min="0" max="100"
                      value={volume} onChange={handleVolume}
                    />

                    {/* Full Screen Button */}
                    <button className="ctrl-btn fs-btn" onClick={toggleFullScreen} title="Fullscreen">
                      {isFullScreen ? "✖" : "⛶"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="video-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{currentLesson?.title}</h3>
              </div>
              {currentLesson?.resources && currentLesson.resources.length > 0 ? (
                <div className="lesson-resources">
                  <h4>📚 Materials:</h4>
                  <div className="resource-links">
                    {currentLesson.resources.map((res, index) => (
                      <a key={index} href={res.url} target="_blank" rel="noopener noreferrer" className="resource-btn">
                        📄 {res.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ color: '#666', fontSize: '0.9rem' }}>No extra materials.</p>
              )}
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="playlist-sidebar">
            <div className="sidebar-header">
              <h4>Course Content</h4>
              <span>{course.lessons.length} Lessons</span>
            </div>
            <ul className="lesson-list">
              {course.lessons.map((lesson, index) => (
                <li
                  key={lesson.id}
                  className={`lesson-item ${currentLesson?.id === lesson.id ? 'active' : ''}`}
                  onClick={() => setCurrentLesson(lesson)}
                >
                  <span className="lesson-number">{index + 1}</span>
                  <div className="lesson-details">
                    <span className="lesson-name">{lesson.title}</span>
                    <span className="lesson-duration">
                      ⏱ {lessonDurations[lesson.id] || lesson.duration || "--:--"}
                    </span>
                  </div>
                  {currentLesson?.id === lesson.id && <span className="playing-icon">▶</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
};

export default CoursePlayer;