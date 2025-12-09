import React, { useState } from 'react';
import '../../styles/blog.css';

const BlogModal = ({ post, onClose }) => {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Dummy Comments for demo
  const [commentsList, setCommentsList] = useState([
    { user: 'TechGuru', text: 'This looks amazing! Great job.' },
    { user: 'CodeMaster', text: 'Love the details. Keep it up!' },
    { user: 'ArtLover', text: 'Beautiful work!' }
  ]);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      setCommentsList([...commentsList, { user: 'Me', text: commentText }]);
      setCommentText('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✖</button>
        
        <div className="blog-modal-layout">
          {/* Left: Image */}
          <div className="blog-modal-image">
            <img src={post.image} alt={post.title} />
          </div>

          {/* Right: Details & Comments */}
          <div className="blog-modal-details">
            
            {/* Header */}
            <div className="blog-modal-header">
              <img src={post.userImg} alt="user" className="modal-user-img" />
              <div>
                <h4>{post.username}</h4>
                <span>{post.handle}</span>
              </div>
            </div>

            {/* Content (Scrollable) */}
            <div className="blog-modal-body">
              <p className="modal-caption">{post.content}</p>
              
              <div className="comments-section">
                {commentsList.map((c, i) => (
                  <div key={i} className="comment-item">
                    <strong>{c.user}</strong> <span>{c.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer: Actions */}
            <div className="blog-modal-footer">
              <div className="modal-actions">
                <button onClick={handleLike} className={`action-icon ${isLiked ? 'liked' : ''}`}>
                  {isLiked ? '❤️' : '🤍'}
                </button>
                <button className="action-icon">💬</button>
                <button className="action-icon">🚀</button>
              </div>
              <p className="likes-count">{likes} likes</p>
              <span className="post-time">{post.time} ago</span>

              {/* Comment Input */}
              <form className="modal-comment-form" onSubmit={handleComment}>
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button type="submit" disabled={!commentText.trim()}>Post</button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;