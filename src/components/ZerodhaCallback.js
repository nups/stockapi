import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ZerodhaCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🎯 ZerodhaCallback component loaded');
    console.log('🔍 Current URL:', window.location.href);
    
    const urlParams = new URLSearchParams(window.location.search);
    const sessionToken = urlParams.get('session');
    const requestToken = urlParams.get('request_token');
    const status = urlParams.get('status');

    console.log('🔍 ZerodhaCallback - URL Parameters:', {
      session: sessionToken,
      request_token: requestToken,
      status: status,
      allParams: Array.from(urlParams.entries())
    });

    if (sessionToken) {
      console.log('✅ Session token found, storing and redirecting to dashboard');
      // Store the session token
      localStorage.setItem('zerodha_session', sessionToken);
      
      // Navigate to dashboard with zerodha tab
      navigate('/dashboard?tab=zerodha', { replace: true });
    } else if (requestToken && status === 'success') {
      console.log('🔄 Request token found, will exchange in ZerodhaIntegration component');
      // Navigate to dashboard with the request token parameters
      navigate(`/dashboard?tab=zerodha&request_token=${requestToken}&status=${status}`, { replace: true });
    } else {
      console.log('❌ No valid tokens found, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div className="loading-spinner">🔄</div>
      <p>Completing Zerodha authentication...</p>
      <p style={{ fontSize: '0.8rem', color: '#666' }}>
        You will be redirected to your dashboard shortly.
      </p>
    </div>
  );
};

export default ZerodhaCallback;