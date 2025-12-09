import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/store.css'; 

const StoreNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isElectronics = location.pathname.includes('electronics');
  const isBooks = location.pathname.includes('books');
  const isSoftware = location.pathname.includes('software'); //  Check for Software path

  return (
    <nav className="store-navbar">
      <div className="store-nav-container">
        
        <div className="nav-left">
          <button className="btn-back" onClick={() => navigate('/')}>← Home</button>
        </div>

        <div className="nav-center" style={{display:'flex', gap:'30px', justifyContent:'center'}}>
          <Link 
            to="/store/electronics" 
            style={{
              color: isElectronics ? '#ffc107' : '#888', 
              textDecoration:'none', fontWeight: 'bold', fontSize:'1rem',
              borderBottom: isElectronics ? '2px solid #ffc107' : 'none', paddingBottom: '5px'
            }}
          >
            Electronics
          </Link>
          
          {/* Software Tab */}
          <Link 
            to="/store/software" 
            style={{
              color: isSoftware ? '#4facfe' : '#888', // Blue for the tab
              textDecoration:'none', fontWeight: 'bold', fontSize:'1rem',
              borderBottom: isSoftware ? '2px solid #4facfe' : 'none', paddingBottom: '5px'
            }}
          >
            Software
          </Link>

          <Link 
            to="/store/books" 
            style={{
              color: isBooks ? '#ffc107' : '#888', 
              textDecoration:'none', fontWeight: 'bold', fontSize:'1rem',
              borderBottom: isBooks ? '2px solid #ffc107' : 'none', paddingBottom: '5px'
            }}
          >
            Books
          </Link>
        </div>

        <div className="nav-right">
          <button className="btn-login" onClick={() => alert("Login Feature Coming Soon!")}>
            Login
          </button>
        </div>

      </div>
    </nav>
  );
};

export default StoreNavbar;