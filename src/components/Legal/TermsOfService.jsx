import React, { useEffect } from 'react';
import LandingFooter from '../Landing/LandingFooter';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Namal Chamodya | Terms of Service";
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
        <h1 style={{ color: '#ffc107', marginBottom: '30px', fontSize: '2.5rem' }}>Terms of Service</h1>
        
        <p style={{ color: '#ccc', lineHeight: '1.8', marginBottom: '20px' }}>
          Last updated: March 2025
        </p>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>1. Agreement to Terms</h2>
          <p style={{ color: '#aaa', lineHeight: '1.8' }}>
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Namal Chamodya ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>2. Educational & Store Content</h2>
          <p style={{ color: '#aaa', lineHeight: '1.8' }}>
            All course materials, source codes, electronic modules, books, and other educational resources provided are the intellectual property of Namal Chamodya, unless otherwise explicitly stated. You may not distribute, modify, transmit, reuse, download (except strictly as provided), repost, copy, or use said Content, whether in whole or in part, for commercial purposes or for personal gain, without express advance written permission from us.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>3. Purchases and Payment</h2>
          <p style={{ color: '#aaa', lineHeight: '1.8' }}>
            We utilize WhatsApp as our primary communication layer for processing manual orders, resolving inquiries, and confirming bank transfers. When you checkout via WhatsApp, your enrollment or orders will remain pending until official bank transfer verification is manually verified by the site administrator. 
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>4. Modifications and Interruptions</h2>
          <p style={{ color: '#aaa', lineHeight: '1.8' }}>
            We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.
          </p>
        </section>

      </div>

      <LandingFooter />
    </div>
  );
};

export default TermsOfService;
