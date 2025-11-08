import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// Debug logging
console.log('=== Google OAuth Debug Info ===');
console.log('Client ID from env:', GOOGLE_CLIENT_ID);
console.log('Client ID length:', GOOGLE_CLIENT_ID?.length);
console.log('Client ID valid format:', GOOGLE_CLIENT_ID?.includes('.apps.googleusercontent.com'));
console.log('Google script loaded:', typeof window.google !== 'undefined');

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Check for Zerodha tokens on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionToken = urlParams.get('session');
    const requestToken = urlParams.get('request_token');
    
    console.log('🔍 Login - Checking for Zerodha tokens:', {
      session: sessionToken,
      request_token: requestToken
    });
    
    if (sessionToken) {
      console.log('✅ Login - Session token found, storing for post-login');
      localStorage.setItem('zerodha_session', sessionToken);
      localStorage.setItem('zerodha_pending_redirect', 'true');
    } else if (requestToken) {
      console.log('🔄 Login - Request token found, storing for post-login');
      localStorage.setItem('zerodha_pending_request_token', requestToken);
      localStorage.setItem('zerodha_pending_redirect', 'true');
    }
  }, []);

  // Initialize Google OAuth (traditional redirect flow)
  useEffect(() => {
    const initializeGoogle = () => {
      console.log('Initializing Google OAuth redirect flow...');
      
      // Validate Client ID
      if (!GOOGLE_CLIENT_ID) {
        setError('Google Client ID is missing from environment configuration.');
        return;
      }
      
      if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
        setError('Google Client ID not configured. Please set up your Google OAuth credentials.');
        return;
      }
      
      if (!GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
        setError('Invalid Google Client ID format. Please check your configuration.');
        return;
      }
      
      // OAuth redirect flow doesn't need additional services to load
      setGoogleLoaded(true);
      console.log('✅ Google OAuth ready for redirect flow');
    };
    
    // Start initialization
    initializeGoogle();
  }, []);



  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }



  const handleGoogleLogin = () => {
    console.log('Google OAuth redirect login clicked');
    console.log('Current Client ID:', GOOGLE_CLIENT_ID);
    console.log('Google loaded:', googleLoaded);
    
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      setError('Google Client ID not configured. Please follow the setup instructions.');
      return;
    }

    if (!googleLoaded) {
      setError('Google authentication service is still loading. Please wait a moment and try again.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Use traditional OAuth redirect flow with backend support
    const currentOrigin = window.location.origin;
    const redirectUri = encodeURIComponent(`${currentOrigin}/auth/google/callback`);
    const scope = encodeURIComponent('openid email profile');
    const responseType = 'code'; // Authorization code flow
    const state = 'google_oauth_' + Date.now(); // Security state parameter
    
    // Debug logging
    console.log('🔐 OAuth Redirect Flow:');
    console.log('Current Origin:', currentOrigin);
    console.log('Redirect URI:', `${currentOrigin}/auth/google/callback`);
    console.log('State:', state);
    
    // Store the state for verification when callback returns
    sessionStorage.setItem('oauth_state', state);
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=${responseType}&` +
      `scope=${scope}&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=select_account`;
    
    console.log('🚀 Redirecting to Google OAuth URL:', authUrl);
    
    // Redirect to Google OAuth (backend will handle token exchange)
    window.location.href = authUrl;
  };





  const handleDemoLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // For demo purposes, create a fake session
      const demoToken = 'demo_' + Date.now();
      const demoUser = {
        user_id: 'demo_user',
        user_name: 'Demo User',
        email: 'demo@example.com',
        broker: 'demo'
      };
      
      await login({
        token: demoToken,
        user: demoUser
      });
    } catch (err) {
      setError('Demo login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Stock Watchlist</h1>
          <p>Your personalized stock tracking and AI recommendations</p>
        </div>

        <div className="login-content">
          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
              {error.includes('403') || error.includes('access_denied') ? (
                <div className="error-help">
                  <p><strong>🔧 Quick Fix:</strong></p>
                  <ol>
                    <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                    <li>Edit your OAuth Client ID</li>
                    <li>Add <code>http://localhost:3000</code> to Authorized JavaScript origins</li>
                    <li>Save and wait 5 minutes for changes to take effect</li>
                  </ol>
                  <p><em>See TROUBLESHOOT-403.md for detailed instructions</em></p>
                </div>
              ) : null}
            </div>
          )}

          <div className="login-options">
            {(!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') ? (
              <div className="config-message">
                <h3>🔧 Google OAuth Setup Required</h3>
                <p>To use Google authentication, please:</p>
                <ol>
                  <li>Go to <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                  <li>Create a new project or select existing one</li>
                  <li>Enable Google+ API</li>
                  <li>Create OAuth 2.0 credentials</li>
                  <li>Add your domain (localhost:3000) to authorized origins</li>
                  <li>Copy the Client ID to your .env file</li>
                </ol>
                <p><strong>For now, you can use the demo version:</strong></p>
              </div>
            ) : (
              <>
                <button
                  className="google-login-btn"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading-spinner">🔄</span>
                  ) : (
                    <span>🔐</span>
                  )}
                  Sign in with Google
                </button>

                <div className="divider">
                  <span>or</span>
                </div>
              </>
            )}

            <button
              className="demo-login-btn"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner">🔄</span>
              ) : (
                <span>👁️</span>
              )}
              Try Demo Version
            </button>
          </div>

          <div className="login-features">
            <h3>Features</h3>
            <ul>
              <li>✅ Real-time stock market data</li>
              <li>🤖 AI-powered stock recommendations</li>
              <li>📊 Technical & fundamental analysis</li>
              <li>📈 Interactive portfolio tracking</li>
              <li>🔔 Smart alerts and notifications</li>
            </ul>
          </div>

          <div className="login-security">
            <p>
              <span>🔒</span>
              Your data is secure. We use Google's official OAuth for authentication.
            </p>
          </div>
        </div>


      </div>

      <div className="login-background">
        <div className="bg-pattern"></div>
      </div>
    </div>
  );
};

export default Login;