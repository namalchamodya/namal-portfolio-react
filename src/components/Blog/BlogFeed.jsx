import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LandingFooter from '../Landing/LandingFooter';
import BlogModal from './BlogModal'; 
import { BLOG_DATA } from './data/blogData';
import '../../styles/blog.css';
import  Blognavbar from './BlogNavbar'

const BlogFeed = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set page title
    document.title = "Namal Chamodya | Blog";
    
    window.scrollTo(0, 0);
  }, []);

  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  return (
    <div className="blog-page">
      
      <Blognavbar />

      {/* Hero Section */}
      <header className="blog-hero">
        <h1>Latest <span style={{color:'#ffc107'}}>Updates</span></h1>
        <p>Sharing ideas, projects, and creative moments.</p>
      </header>

      {/* Blog Grid */}
      <section className="blog-grid">
        {BLOG_DATA.map((post) => (
          <article key={post.id} className="blog-card">
            
            <div className="card-image" onClick={() => setSelectedPost(post)} style={{cursor:'pointer'}}>
              <img src={post.image} alt={post.title} />
            </div>

            <div className="card-content">
              <div className="post-meta-header">
                <img src={post.userImg} alt="user" className="mini-user-img" />
                <div className="meta-text">
                    <span className="meta-name">{post.username}</span>
                    <span className="meta-handle">{post.handle} • {post.time}</span>
                </div>
              </div>

              <h2 className="card-title">{post.title}</h2>
              
              <p className="card-excerpt">
                {truncateText(post.content, 100)}
                <span className="read-more-link" onClick={() => setSelectedPost(post)}> read more</span>
              </p>

              <div className="card-footer">
                <div className="footer-actions">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                </div>
                <button className="share-btn">🚀</button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <LandingFooter />

      {selectedPost && (
        <BlogModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}

    </div>
  );
};

export default BlogFeed;