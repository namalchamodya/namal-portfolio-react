import React, { useState } from 'react';
import '../../styles/blog.css';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  // Handle Like
  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  // Handle Comment Submit
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { user: "Visitor", text: newComment }]);
      setNewComment("");
    }
  };

  return (
    <div className="blog-card">
      {/* Header */}
      <div className="post-header">
        <div className="post-user">
          <img src={post.userImg} alt="user" />
          <div className="user-details">
            <h4>{post.username}</h4>
            <span>{post.time}</span>
          </div>
        </div>
        <div className="post-options">•••</div>
      </div>

      {/* Description */}
      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {/* Image (if exists) */}
      {post.image && (
        <div className="post-image" onDoubleClick={handleLike}>
          <img src={post.image} alt="post" />
          {/* Heart Animation could go here */}
        </div>
      )}

      {/* Action Buttons */}
      <div className="post-actions">
        <div className="action-left">
          <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            {liked ? '❤️' : '🤍'}
          </button>
          <button className="action-btn" onClick={() => setShowComments(!showComments)}>
            💬
          </button>
          <button className="action-btn">🚀</button> {/* Share */}
        </div>
        <div className="action-right">
          <button className="action-btn">🔖</button> {/* Save */}
        </div>
      </div>

      {/* Stats */}
      <div className="post-stats">
        <p><strong>{likeCount} likes</strong></p>
      </div>

      {/* Comments Section */}
      <div className="post-comments">
        {comments.slice(0, 2).map((c, i) => (
          <p key={i}><strong>{c.user}</strong> {c.text}</p>
        ))}
        {comments.length > 2 && (
          <p className="view-all" onClick={() => setShowComments(!showComments)}>
            View all {comments.length} comments
          </p>
        )}
        
        {/* Expanded Comments */}
        {showComments && comments.slice(2).map((c, i) => (
          <p key={i + 2}><strong>{c.user}</strong> {c.text}</p>
        ))}
      </div>

      {/* Add Comment Input */}
      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <input 
          type="text" 
          placeholder="Add a comment..." 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" disabled={!newComment.trim()}>Post</button>
      </form>
    </div>
  );
};

export default PostCard;