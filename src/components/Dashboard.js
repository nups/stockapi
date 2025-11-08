import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import WatchlistManager from './WatchlistManager';
import ZerodhaIntegration from './ZerodhaIntegration';
import RecommendationsPreview from './RecommendationsPreview';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('recommendations'); // Default to Recommendations tab
  
  // Debug logging
  console.log('🎯 Dashboard loaded - Active tab:', activeTab);
  console.log('👤 User:', user);
  useEffect(() => {
    
    // Check for URL tab parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const sessionToken = urlParams.get('session');
    const requestToken = urlParams.get('request_token');
    
    // Also check for pending Zerodha tokens from localStorage (post-login)
    const pendingRedirect = localStorage.getItem('zerodha_pending_redirect');
    const pendingSession = localStorage.getItem('zerodha_session');
    const pendingRequestToken = localStorage.getItem('zerodha_pending_request_token');
    
    console.log('🎯 Dashboard - URL and storage parameters:', {
      tab: tabParam,
      session: sessionToken,
      request_token: requestToken,
      pendingRedirect: pendingRedirect,
      pendingSession: pendingSession,
      pendingRequestToken: pendingRequestToken,
      fullURL: window.location.href
    });
    
    // Set tab from URL parameter or default logic or pending redirect
    if (tabParam) {
      console.log('🎯 Dashboard - Setting tab from URL parameter:', tabParam);
      setActiveTab(tabParam);
    } else if (sessionToken || requestToken) {
      console.log('🎯 Dashboard - Zerodha token detected in URL, switching to zerodha tab');
      setActiveTab('zerodha');
    } else if (pendingRedirect === 'true' && (pendingSession || pendingRequestToken)) {
      console.log('🎯 Dashboard - Pending Zerodha redirect detected, switching to zerodha tab');
      setActiveTab('zerodha');
      // Clear the pending redirect flag
      localStorage.removeItem('zerodha_pending_redirect');
      localStorage.removeItem('zerodha_pending_request_token');
    }
  }, []);



  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>📊 MarketHub</h1>
            <span className="user-info">
              Welcome, {user?.user_name || 'User'}
            </span>
          </div>
          <div className="header-right">
            <button className="settings-btn" title="Settings">
              ⚙️
            </button>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>


      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          🤖 Recommendations
        </button>
        <button
          className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          📋 Watchlist
        </button>
        <button
          className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          💼 Portfolio
        </button>
        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        <button
          className={`tab-btn ${activeTab === 'zerodha' ? 'active' : ''}`}
          onClick={() => setActiveTab('zerodha')}
        >
          📈 Zerodha Integration
        </button>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'recommendations' && (
          <div className="recommendations-tab">
            <RecommendationsPreview />
            <div style={{marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
              <h4>🔗 Want Real-Time AI Recommendations?</h4>
              <p>Connect your Zerodha account to get personalized AI recommendations based on your actual holdings.</p>
              <button 
                className="btn btn-primary"
                onClick={() => setActiveTab('zerodha')}
              >
                Go to Zerodha Integration
              </button>
            </div>
          </div>
        )}
        {activeTab === 'watchlist' && <WatchlistManager />}
        {activeTab === 'portfolio' && (
          <div className="coming-soon">
            <h2>💼 Portfolio Management</h2>
            <p>Coming soon! Track your holdings and performance.</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="coming-soon">
            <h2>📊 Analytics Dashboard</h2>
            <p>Coming soon! Advanced charts and market insights.</p>
          </div>
        )}
        {activeTab === 'zerodha' && (
          <div className="zerodha-tab">
            <ZerodhaIntegration />
            <div style={{marginTop: '2rem', padding: '1rem', backgroundColor: '#e8f5e8', borderRadius: '8px'}}>
              <h4>💡 Pro Tip</h4>
              <p>After connecting to Zerodha, use the "AI Recommendations" button in the integration to get personalized recommendations based on your holdings.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;