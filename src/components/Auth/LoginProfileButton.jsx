import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './LoginProfile.css';

const LoginProfileButton = () => {
    const { user, signInWithGoogle, signOut } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!user) {
        return (
            <button className="login-btn auth-login-btn" onClick={signInWithGoogle}>
                Login
            </button>
        );
    }

    return (
        <div className="profile-btn-container" ref={dropdownRef}>
            <img
                src={user.user_metadata?.avatar_url || user.user_metadata?.picture || 'https://ui-avatars.com/api/?name=' + (user.user_metadata?.full_name || 'User') + '&background=random'}
                alt="Profile"
                className="profile-pic"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {dropdownOpen && (
                <div className="profile-dropdown">
                    <div className="dropdown-account-details">
                        <p className="account-name">{user.user_metadata?.full_name || user.user_metadata?.name || 'User'}</p>
                        <p className="account-email">{user.email}</p>
                    </div>
                    <hr className="dropdown-divider" />
                    <div className="dropdown-actions">
                        <button className="dropdown-item" onClick={signOut}>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginProfileButton;
