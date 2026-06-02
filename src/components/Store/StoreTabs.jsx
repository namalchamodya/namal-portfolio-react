import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const StoreTabs = () => {
    const location = useLocation();
    
    return (
        <div className="course-tabs" style={{ marginTop: '0px', marginBottom: '30px' }}>
            <Link to="/store/electronics">
                <button className={`tab-btn ${location.pathname.includes('electronics') ? 'active' : ''}`}>Electronics</button>
            </Link>
            <Link to="/store/software">
                <button className={`tab-btn ${location.pathname.includes('software') ? 'active' : ''}`}>Software</button>
            </Link>
            <Link to="/store/books">
                <button className={`tab-btn ${location.pathname.includes('books') ? 'active' : ''}`}>Books</button>
            </Link>
        </div>
    );
};

export default StoreTabs;
