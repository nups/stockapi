import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AuthCallback from './components/AuthCallback';
import GoogleCallback from './components/GoogleCallback';
import ZerodhaCallback from './components/ZerodhaCallback';

// Loading Component
function LoadingScreen({ message = "Loading..." }) {
  console.log('🔄 Showing loading screen:', message);
  
  return (
    <div className="login-container">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
        <h2 style={{ color: '#667eea', marginBottom: '0.5rem' }}>MarketHub</h2>
        <p style={{ color: '#6b7280' }}>{message}</p>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '1rem' }}>
          If this takes too long, please refresh the page
        </p>
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('🛡️ ProtectedRoute - loading:', loading, 'isAuthenticated:', isAuthenticated);
  
  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Public Route Component (redirect to dashboard if already authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('🌐 PublicRoute - loading:', loading, 'isAuthenticated:', isAuthenticated);
  
  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

// Root Handler - Check for Zerodha tokens and route appropriately
function RootHandler() {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('🏠 RootHandler - checking for Zerodha tokens');
  
  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }
  
  // Check for Zerodha session parameters
  const urlParams = new URLSearchParams(window.location.search);
  const sessionToken = urlParams.get('session');
  const requestToken = urlParams.get('request_token');
  
  console.log('🏠 RootHandler - URL parameters:', {
    session: sessionToken,
    request_token: requestToken,
    isAuthenticated: isAuthenticated
  });
  
  if (sessionToken || requestToken) {
    console.log('🏠 RootHandler - Zerodha tokens detected, processing...');
    
    if (sessionToken) {
      // Store session token and redirect to dashboard
      localStorage.setItem('zerodha_session', sessionToken);
      console.log('✅ Session token stored in localStorage');
    }
    
    if (isAuthenticated) {
      // User is logged in, redirect to dashboard with zerodha tab
      const redirectUrl = sessionToken || requestToken 
        ? `/dashboard?tab=zerodha&${sessionToken ? `session=${sessionToken}` : `request_token=${requestToken}&status=success`}`
        : '/dashboard?tab=zerodha';
      
      console.log('🏠 RootHandler - Redirecting authenticated user to:', redirectUrl);
      return <Navigate to={redirectUrl} replace />;
    } else {
      // User not logged in, redirect to login but preserve token in URL
      const loginUrl = sessionToken || requestToken 
        ? `/login?${sessionToken ? `session=${sessionToken}` : `request_token=${requestToken}&status=success`}`
        : '/login';
      
      console.log('🏠 RootHandler - Redirecting unauthenticated user to:', loginUrl);
      return <Navigate to={loginUrl} replace />;
    }
  }
  
  // No Zerodha tokens, use normal routing
  console.log('🏠 RootHandler - No Zerodha tokens, using normal routing');
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            {/* Auth Callback Routes */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/auth/zerodha/callback" element={<ZerodhaCallback />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Default Route - Check for Zerodha session first */}
            <Route path="/" element={<RootHandler />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;