import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session token from URL parameters
        const session = searchParams.get('session');
        const error = searchParams.get('error');
        
        if (error) {
          console.error('Authentication error:', error);
          navigate('/login?error=' + encodeURIComponent(error));
          return;
        }

        if (session) {
          // Extract user data from URL if available
          const userData = {
            user_id: searchParams.get('user_id') || 'zerodha_user',
            user_name: searchParams.get('user_name') || 'Zerodha User',
            email: searchParams.get('email') || 'user@zerodha.com',
            broker: 'zerodha'
          };

          await login(session, userData);
          navigate('/dashboard', { replace: true });
        } else {
          console.error('No session token received');
          navigate('/login?error=no_session');
        }
      } catch (error) {
        console.error('Authentication callback error:', error);
        navigate('/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [searchParams, login, navigate]);

  return (
    <div className="auth-callback">
      <div className="auth-callback-container">
        <div className="loading-spinner">🔄</div>
        <h2>Completing Authentication...</h2>
        <p>Please wait while we log you in with Zerodha.</p>
      </div>
    </div>
  );
};

export default AuthCallback;