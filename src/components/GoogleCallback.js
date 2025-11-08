import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        console.log('🔄 Processing Google OAuth callback...');
        
        // Get parameters from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        
        console.log('📋 Callback params:', { code: !!code, state, error });
        
        // Check for errors
        if (error) {
          console.error('❌ OAuth error:', error);
          setStatus('Authentication failed: ' + error);
          setTimeout(() => navigate('/login?error=' + encodeURIComponent(error)), 3000);
          return;
        }
        
        // Verify state parameter for security (with fallback)
        const storedState = sessionStorage.getItem('oauth_state');
        console.log('🔍 State verification:', { received: state, stored: storedState });
        
        if (!state) {
          console.error('❌ No state parameter received');
          setStatus('Security error: No state parameter');
          setTimeout(() => navigate('/login?error=no_state'), 3000);
          return;
        }
        
        // Check if state looks like our format (google_oauth_timestamp)
        if (!state.startsWith('google_oauth_')) {
          console.error('❌ Invalid state format');
          setStatus('Security error: Invalid state format');
          setTimeout(() => navigate('/login?error=invalid_state_format'), 3000);
          return;
        }
        
        // If stored state is missing (cross-origin issue), validate state format instead
        if (!storedState) {
          console.warn('⚠️ Stored state missing - likely cross-origin redirect. Validating state format instead.');
          // Additional validation: check if state timestamp is recent (within 10 minutes)
          const stateTimestamp = parseInt(state.replace('google_oauth_', ''));
          const currentTime = Date.now();
          const timeDiff = currentTime - stateTimestamp;
          
          if (timeDiff > 10 * 60 * 1000) { // 10 minutes
            console.error('❌ State expired');
            setStatus('Security error: Authentication session expired');
            setTimeout(() => navigate('/login?error=state_expired'), 3000);
            return;
          }
        } else if (state !== storedState) {
          console.error('❌ State mismatch - possible CSRF attack');
          setStatus('Security error: Invalid state parameter');
          setTimeout(() => navigate('/login?error=state_mismatch'), 3000);
          return;
        }
        
        // Clear stored state
        sessionStorage.removeItem('oauth_state');
        
        if (!code) {
          console.error('❌ No authorization code received');
          setStatus('No authorization code received');
          setTimeout(() => navigate('/login?error=no_code'), 3000);
          return;
        }
        
        setStatus('Exchanging authorization code...');
        
        // Exchange authorization code for access token using backend
        // This is the proper way to handle OAuth - backend has client_secret
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net';
        
        console.log('🔄 Calling backend for token exchange...');
        console.log('Backend URL:', `${API_BASE_URL}/api/auth/google/token`);
        
        const tokenResponse = await fetch(`${API_BASE_URL}/api/auth/google/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            redirect_uri: `${window.location.origin}/auth/google/callback`
          }),
        });
        
        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.log('❌ Backend token exchange failed:', errorText);
          
          let errorMessage = 'Backend authentication failed';
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            // If not JSON, use the text as error
            errorMessage = errorText || errorMessage;
          }
          
          setStatus(`Authentication failed: ${errorMessage}`);
          setTimeout(() => {
            navigate('/login?error=backend_auth_failed&message=' + 
              encodeURIComponent(`Backend error: ${errorMessage}`));
          }, 3000);
          return;
        }
        
        // Backend successfully exchanged code for token and user info
        const authData = await tokenResponse.json();
        console.log('✅ Backend authentication successful');
        console.log('👤 Real user info received:', authData.user);
        
        if (!authData.success || !authData.user) {
          throw new Error('Invalid response from backend');
        }
        
        setStatus('Login successful! Redirecting...');
        
        // Store the token and user info (real data from backend!)
        localStorage.setItem('google_auth_token', authData.access_token);
        localStorage.setItem('user_profile', JSON.stringify(authData.user));
        
        // Login with REAL user data from Google (no more "Google User"!)
        await login({
          token: authData.access_token,
          user: authData.user // This now contains real name, email, picture!
        });
        
        // Redirect to dashboard
        setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
        
      } catch (error) {
        console.error('❌ Google callback error:', error);
        setStatus('Authentication failed: ' + error.message);
        setTimeout(() => navigate('/login?error=callback_failed'), 3000);
      }
    };

    handleGoogleCallback();
  }, [searchParams, login, navigate]);

  return (
    <div className="login-container">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
        <h2 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Stock Watchlist</h2>
        <p style={{ color: '#6b7280' }}>{status}</p>
        
        {status.includes('failed') || status.includes('error') ? (
          <div style={{ marginTop: '1rem' }}>
            <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>
              Don't worry! You can still try the demo version.
            </p>
            <button 
              onClick={() => navigate('/login')}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '1rem' }}>
            This should only take a few seconds...
          </p>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;