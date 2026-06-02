import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useAuth } from './AuthContext';
import LandingFooter from '../Landing/LandingFooter';
import LoginProfileButton from './LoginProfileButton';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    phone_number: '',
    whatsapp_number: '',
    parent_name: '',
    parent_number: ''
  });
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // If not logged in at all, kick them back to home
    if (user === null) {
        navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || user?.user_metadata?.full_name || '',
        address: profile.address || '',
        phone_number: profile.phone_number || '',
        whatsapp_number: profile.whatsapp_number || '',
        parent_name: profile.parent_name || '',
        parent_number: profile.parent_number || ''
      });
    }
  }, [profile, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        address: formData.address,
        phone_number: formData.phone_number,
        whatsapp_number: formData.whatsapp_number,
        parent_name: formData.parent_name,
        parent_number: formData.parent_number
      })
      .eq('id', user.id);

    if (error) {
      setMessage({ type: 'error', text: 'Error saving profile: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Optionally wait a bit then redirect
      setTimeout(() => {
        navigate('/courses');
      }, 1500);
    }
    
    setSaving(false);
  };

  const handleSkip = () => {
    navigate('/courses');
  };

  if (!user || !profile) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>
        <h3>Loading Profile...</h3>
      </div>
    );
  }

  return (
    <div className="courses-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>


      <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="admin-card" style={{ maxWidth: '600px', width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#fff' }}>Complete Your Profile</h2>
          <p style={{ textAlign: 'center', color: '#aaa', marginBottom: '30px' }}>
            Please provide your details so we can keep you updated on your progress and courses.
          </p>

          <form onSubmit={handleSubmit} className="admin-form">
            {message && (
              <div className={`form-alert alert-${message.type}`} style={{ marginBottom: '20px' }}>
                {message.text}
              </div>
            )}
            
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Home Address</label>
              <textarea
                required
                rows="2"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              ></textarea>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Mobile Number (Tp no)</label>
                <input
                  type="tel"
                  required
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  placeholder="07XXXXXXXX"
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
                  placeholder="07XXXXXXXX"
                />
              </div>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Parent / Guardian Name</label>
                <input
                  type="text"
                  required
                  value={formData.parent_name}
                  onChange={(e) => setFormData({...formData, parent_name: e.target.value})}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Parent Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={formData.parent_number}
                  onChange={(e) => setFormData({...formData, parent_number: e.target.value})}
                  placeholder="07XXXXXXXX"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button type="submit" className="form-btn" disabled={saving} style={{ flex: 2 }}>
                {saving ? 'Saving...' : 'Save Details'}
              </button>
              <button 
                type="button" 
                className="form-btn" 
                onClick={handleSkip} 
                style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: '#aaa', border: '1px solid #333' }}
              >
                Skip for now
              </button>
            </div>
          </form>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
};

export default StudentProfile;
