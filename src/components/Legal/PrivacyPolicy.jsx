import React, { useEffect } from 'react';
import LandingFooter from '../Landing/LandingFooter';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Namal Chamodya | Privacy Policy";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Simple Header */}
      <nav style={{ padding: '20px 5%', borderBottom: '1px solid #333', background: '#0a0a0a' }}>
         <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: '1px solid #555', color: '#fff', padding: '8px 20px', borderRadius: '30px', cursor: 'pointer' }}>
            ← Back
         </button>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, padding: '60px 5%', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#ffc107', marginBottom: '30px', fontSize: '2.5rem' }}>Privacy Policy</h1>
        
        <p style={{ color: '#ccc', lineHeight: '1.8', marginBottom: '20px' }}>
          Last updated: March 2025
        </p>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>1. Introduction</h2>
          <p style={{ color: '#aaa', lineHeight: '1.8' }}>
            Welcome to Namal Chamodya's Portfolio and Learning Hub. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>2. Information We Collect</h2>
          <p style={{ color: '#aaa', lineHeight: '1.8' }}>
            We collect personal information that you provide to us such as name, address, contact information, passwords and security data, and payment information when you register for courses, buy products from our store, or interact with our services via WhatsApp.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>3. How We Use Your Information</h2>
          <p style={{ color: '#aaa', lineHeight: '1.8' }}>
            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul style={{ color: '#aaa', lineHeight: '1.8', paddingLeft: '20px', marginTop: '10px' }}>
             <li>To facilitate account creation and logon process.</li>
             <li>To fulfill and manage your orders via WhatsApp and our database.</li>
             <li>To send administrative information to you.</li>
             <li>To post testimonials with your consent.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>4. Will Your Information Be Shared With Anyone?</h2>
          <p style={{ color: '#aaa', lineHeight: '1.8' }}>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
          </p>
        </section>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>5. Contact Us</h2>
          <p style={{ color: '#aaa', lineHeight: '1.8' }}>
            If you have questions or comments about this policy, you may email us at namalcg12@gmail.com.
          </p>
        </section>

      </div>

      <LandingFooter />
    </div>
  );
};

export default PrivacyPolicy;
