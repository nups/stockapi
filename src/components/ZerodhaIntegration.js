import React, { useState, useEffect } from 'react';

const ZerodhaIntegration = () => {
  const [zerodhaConnected, setZerodhaConnected] = useState(false);
  const [holdings, setHoldings] = useState([]);
  const [aiRecommendations, setAIRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [sessionToken, setSessionToken] = useState(null);

  // Use the same base URL as the working app.js
  const baseUrl = 'https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net';

  useEffect(() => {
    // Check for session token in URL (after OAuth redirect)
    checkForSessionToken();
    
    // Load existing session from localStorage
    loadStoredSession();
    
    // Update UI based on session status
    updateConnectionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateConnectionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken]);

  const checkForSessionToken = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('session');
    const requestToken = urlParams.get('request_token');
    const status = urlParams.get('status');
    
    console.log('🔍 URL Parameters:', {
      session: token,
      request_token: requestToken,
      status: status,
      fullURL: window.location.href
    });
    
    if (token) {
      console.log('Session token found in URL:', token);
      setSessionToken(token);
      localStorage.setItem('zerodha_session', token);
      
      // Clean up URL by removing session parameter
      const url = new URL(window.location);
      url.searchParams.delete('session');
      window.history.replaceState({}, document.title, url);
      
      // Show success message
      setMessage('Zerodha authentication successful!');
      setTimeout(() => setMessage(''), 5000);
    } else if (requestToken && status === 'success') {
      console.log('Request token found, exchanging for session token:', requestToken);
      exchangeRequestTokenForSession(requestToken);
    }
  };
  
  const exchangeRequestTokenForSession = async (requestToken) => {
    try {
      setIsLoading(true);
      setMessage('Completing Zerodha authentication...');
      
      // Call backend to exchange request_token for session token
      const response = await fetch(`${baseUrl}/api/zerodha/auth/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request_token: requestToken })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.session) {
        console.log('✅ Session token received from backend:', data.session);
        setSessionToken(data.session);
        localStorage.setItem('zerodha_session', data.session);
        setMessage('Zerodha authentication successful!');
        
        // Clean up URL
        const url = new URL(window.location);
        url.searchParams.delete('request_token');
        url.searchParams.delete('status');
        url.searchParams.delete('action');
        url.searchParams.delete('type');
        window.history.replaceState({}, document.title, url);
      } else {
        throw new Error('No session token received from backend');
      }
    } catch (error) {
      console.error('Error exchanging request token:', error);
      setError(`Authentication failed: ${error.message}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const loadStoredSession = () => {
    const storedSession = localStorage.getItem('zerodha_session');
    if (storedSession) {
      setSessionToken(storedSession);
      console.log('Loaded stored session token');
    }
  };

  const updateConnectionStatus = () => {
    const isConnected = !!sessionToken;
    setZerodhaConnected(isConnected);
    
    if (isConnected && holdings.length === 0) {
      // Auto-fetch holdings when connected
      fetchHoldings();
    }
  };

  const handleZerodhaConnect = () => {
    // Clear any existing session
    clearSession();
    
    // Redirect to backend Zerodha login endpoint (same as working app.js)
    window.location.href = `${baseUrl}/api/zerodha/auth/login`;
  };

  const handleZerodhaDisconnect = () => {
    clearSession();
    setHoldings([]);
    setAIRecommendations([]);
    setError('');
    setMessage('');
  };

  const clearSession = () => {
    setSessionToken(null);
    localStorage.removeItem('zerodha_session');
    setZerodhaConnected(false);
  };

  const fetchHoldings = async () => {
    if (!sessionToken) {
      setError('Please connect to Zerodha first.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${baseUrl}/api/zerodha/holdings?session=${sessionToken}`);
      
      if (response.status === 401) {
        // Session expired or invalid
        handleSessionExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Holdings data received:', data);

      if (data.success && data.data) {
        setHoldings(data.data);
        setMessage(`Successfully loaded ${data.data.length} holdings`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error(data.error || 'Failed to fetch holdings');
      }

    } catch (error) {
      console.error('Error fetching holdings:', error);
      setError(`Failed to fetch holdings: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAIRecommendations = async () => {
    if (!sessionToken) {
      setError('Please connect to Zerodha first to get AI recommendations.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${baseUrl}/api/zerodha/holdings-ai?session=${sessionToken}`);
      
      if (response.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('AI recommendations received:', data);
      console.log('AI recommendations data structure:', JSON.stringify(data, null, 2));

      if (data.success) {
        // Check if data is in different format
        let recommendations = data.data || [];
        
        // Handle different possible data structures
        if (data.holdings && Array.isArray(data.holdings)) {
          recommendations = data.holdings;
        } else if (Array.isArray(data)) {
          recommendations = data;
        }
        
        console.log('Processed recommendations:', recommendations);
        setAIRecommendations(recommendations);
        setMessage(`AI recommendations loaded successfully! Found ${recommendations.length} recommendations.`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error(data.error || 'Failed to get AI recommendations');
      }

    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      setError(`Failed to get AI recommendations: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionExpired = () => {
    console.log('Session expired, clearing stored session');
    clearSession();
    setError('Session expired. Please connect to Zerodha again.');
  };

  const refreshData = () => {
    if (zerodhaConnected && sessionToken) {
      fetchHoldings();
    }
  };

  return (
    <div className="zerodha-integration">
      <div className="section-header">
        <h2>📈 Zerodha Integration</h2>
        <p>Connect your Zerodha account to sync your portfolio and get personalized recommendations</p>
      </div>

      {!zerodhaConnected ? (
        <div className="zerodha-connect-card">
          <div className="connect-content">
            <div className="zerodha-logo">
              <img 
                src="https://zerodha.com/static/images/logo.svg" 
                alt="Zerodha" 
                style={{ height: '40px', marginBottom: '16px' }}
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
            <h3>Connect Your Zerodha Account</h3>
            <p>Sync your portfolio, holdings, and positions for better AI recommendations</p>
            
            <div className="benefits-list">
              <div className="benefit-item">
                ✅ <strong>Real Portfolio Sync:</strong> Get your actual holdings and positions
              </div>
              <div className="benefit-item">
                ✅ <strong>Personalized Recommendations:</strong> AI suggestions based on your portfolio
              </div>
              <div className="benefit-item">
                ✅ <strong>Risk Analysis:</strong> Portfolio diversification insights
              </div>
              <div className="benefit-item">
                ✅ <strong>Performance Tracking:</strong> Real P&L and portfolio metrics
              </div>
            </div>

            <button
              className="zerodha-connect-btn"
              onClick={handleZerodhaConnect}
              disabled={isLoading}
              style={{
                backgroundColor: '#387ed1',
                color: 'white',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '24px',
                width: '100%',
                maxWidth: '300px'
              }}
            >
              {isLoading ? '🔄 Connecting...' : '🔐 Connect Zerodha Account'}
            </button>

            <p className="security-note">
              🔒 <strong>Secure OAuth:</strong> We use Zerodha's official OAuth for secure authentication. 
              We cannot place orders or access sensitive data without your explicit permission.
            </p>
          </div>
        </div>
      ) : (
        <div className="zerodha-connected">
          <div className="connection-status">
            <div className="status-header">
              <h3>✅ Zerodha Connected</h3>
              <div className="connection-actions">
                <button 
                  className="refresh-btn"
                  onClick={refreshData}
                  disabled={isLoading}
                >
                  {isLoading ? '🔄' : '🔄'} Refresh
                </button>
                <button 
                  className="disconnect-btn"
                  onClick={handleZerodhaDisconnect}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginLeft: '8px'
                  }}
                >
                  🔌 Disconnect
                </button>
              </div>
            </div>
          </div>

          {message && (
            <div className="success-message" style={{ 
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '8px',
              padding: '12px',
              margin: '16px 0',
              color: '#155724'
            }}>
              <strong>✅ Success:</strong> {message}
              <button 
                onClick={() => setMessage('')}
                style={{ 
                  float: 'right',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#155724',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div className="error-message" style={{ 
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px',
              margin: '16px 0',
              color: '#dc2626'
            }}>
              <strong>⚠️ Error:</strong> {error}
              <button 
                onClick={() => setError('')}
                style={{ 
                  float: 'right',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#dc2626',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>
          )}

          <div className="zerodha-data">
            {/* Holdings Section */}
            <div className="data-section">
              <h4>📊 Holdings ({holdings.length})</h4>
              {holdings.length > 0 ? (
                <div className="holdings-grid">
                  {holdings.slice(0, 5).map((holding, index) => (
                    <div key={index} className="holding-card">
                      <div className="holding-symbol">{holding.tradingsymbol || holding.instrument_token}</div>
                      <div className="holding-qty">Qty: {holding.quantity || 0}</div>
                      <div className="holding-value">
                        ₹{((holding.last_price || 0) * (holding.quantity || 0)).toLocaleString()}
                      </div>
                      <div className={`holding-pnl ${(holding.pnl || 0) >= 0 ? 'profit' : 'loss'}`}>
                        P&L: ₹{(holding.pnl || 0).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  {holdings.length > 5 && (
                    <div className="more-items">
                      +{holdings.length - 5} more holdings
                    </div>
                  )}
                </div>
              ) : (
                <p className="no-data">No holdings found. Make sure you have stocks in your Zerodha account.</p>
              )}
            </div>

            {/* AI Recommendations Section */}
            <div className="data-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4>🤖 AI Portfolio Recommendations ({aiRecommendations.length})</h4>
                <button 
                  className="ai-btn"
                  onClick={fetchAIRecommendations}
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {isLoading ? '🔄 Loading...' : '🤖 Get AI Recommendations'}
                </button>
              </div>
              
              {aiRecommendations.length > 0 ? (
                <div style={{ padding: '15px', background: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
                  
                  {/* Summary Cards - Same as working JavaScript version */}
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div style={{ background: '#e8f5e8', padding: '10px', borderRadius: '5px', textAlign: 'center', minWidth: '80px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2e7d32' }}>
                        {aiRecommendations.filter(h => h.ai_recommendation?.recommendation === 'BUY').length}
                      </div>
                      <div style={{ fontSize: '12px', color: '#333' }}>BUY</div>
                    </div>
                    <div style={{ background: '#fff3e0', padding: '10px', borderRadius: '5px', textAlign: 'center', minWidth: '80px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f57c00' }}>
                        {aiRecommendations.filter(h => h.ai_recommendation?.recommendation === 'HOLD').length}
                      </div>
                      <div style={{ fontSize: '12px', color: '#333' }}>HOLD</div>
                    </div>
                    <div style={{ background: '#ffebee', padding: '10px', borderRadius: '5px', textAlign: 'center', minWidth: '80px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#c62828' }}>
                        {aiRecommendations.filter(h => h.ai_recommendation?.recommendation === 'SELL').length}
                      </div>
                      <div style={{ fontSize: '12px', color: '#333' }}>SELL</div>
                    </div>
                    <div style={{ background: '#f3e5f5', padding: '10px', borderRadius: '5px', textAlign: 'center', minWidth: '80px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#7b1fa2' }}>
                        {aiRecommendations.filter(h => h.ai_recommendation?.action_priority === 'High').length}
                      </div>
                      <div style={{ fontSize: '12px', color: '#333' }}>High Priority</div>
                    </div>
                  </div>

                  {/* AI Recommendations Table - Same as working JavaScript version */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#f5f5f5' }}>
                          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Stock</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>P&L</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Scores</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Recommendation</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Priority</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Analysis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aiRecommendations
                          .sort((a, b) => {
                            const aScore = a.ai_recommendation?.overall_score || 0;
                            const bScore = b.ai_recommendation?.overall_score || 0;
                            if (aScore !== bScore) return bScore - aScore;
                            
                            const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                            const aPriority = priorityOrder[a.ai_recommendation?.action_priority] || 0;
                            const bPriority = priorityOrder[b.ai_recommendation?.action_priority] || 0;
                            return bPriority - aPriority;
                          })
                          .map((holding, index) => {
                            const pnl = holding.pnl || 0;
                            const pnlColor = pnl >= 0 ? 'green' : 'red';
                            const aiRec = holding.ai_recommendation || {};
                            const recommendation = aiRec.recommendation || 'N/A';
                            const reason = aiRec.reason || 'No reason provided';
                            const insight = aiRec.insight || '';
                            const riskNote = aiRec.risk_note || '';
                            const priority = aiRec.action_priority || 'Medium';
                            const fundamentalScore = aiRec.fundamental_score || 0;
                            const technicalScore = aiRec.technical_score || 0;
                            const overallScore = aiRec.overall_score || 0;
                            
                            const rowBg = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
                            
                            // Recommendation colors
                            let recColor = '#666';
                            let recBg = '#f5f5f5';
                            if (recommendation === 'BUY') {
                              recColor = '#2e7d32';
                              recBg = '#e8f5e8';
                            } else if (recommendation === 'SELL') {
                              recColor = '#c62828';
                              recBg = '#ffebee';
                            } else if (recommendation === 'HOLD') {
                              recColor = '#f57c00';
                              recBg = '#fff3e0';
                            }
                            
                            // Priority colors
                            let priorityColor = '#666';
                            let priorityBg = '#f5f5f5';
                            if (priority === 'High') {
                              priorityColor = '#7b1fa2';
                              priorityBg = '#f3e5f5';
                            } else if (priority === 'Medium') {
                              priorityColor = '#f57c00';
                              priorityBg = '#fff3e0';
                            } else if (priority === 'Low') {
                              priorityColor = '#4caf50';
                              priorityBg = '#e8f5e8';
                            }
                            
                            return (
                              <tr key={index} style={{ background: rowBg }}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                  <div style={{ fontWeight: 'bold' }}>{holding.tradingsymbol}</div>
                                  <div style={{ fontSize: '11px', color: '#666' }}>{holding.exchange}</div>
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', color: pnlColor, fontWeight: 'bold' }}>
                                  ₹{pnl.toFixed(2)}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                  <div style={{ fontSize: '11px' }}>F:{fundamentalScore} T:{technicalScore}</div>
                                  <div style={{ fontWeight: 'bold', color: '#2c5aa0' }}>Overall: {overallScore}</div>
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                  <span style={{ 
                                    background: recBg, 
                                    color: recColor, 
                                    padding: '4px 8px', 
                                    borderRadius: '12px', 
                                    fontSize: '12px', 
                                    fontWeight: 'bold' 
                                  }}>
                                    {recommendation}
                                  </span>
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                  <span style={{ 
                                    background: priorityBg, 
                                    color: priorityColor, 
                                    padding: '4px 8px', 
                                    borderRadius: '12px', 
                                    fontSize: '12px', 
                                    fontWeight: 'bold' 
                                  }}>
                                    {priority}
                                  </span>
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', fontSize: '12px', maxWidth: '250px' }}>
                                  <div style={{ marginBottom: '3px' }}><strong>Reason:</strong> {reason}</div>
                                  {insight && (
                                    <div style={{ marginBottom: '3px', color: '#666' }}><strong>Insight:</strong> {insight}</div>
                                  )}
                                  {riskNote && (
                                    <div style={{ color: '#d32f2f', fontSize: '11px' }}><strong>Risk:</strong> {riskNote}</div>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="no-data">
                  {holdings.length > 0 
                    ? 'Click "Get AI Recommendations" to analyze your portfolio with AI.' 
                    : 'Connect to Zerodha and fetch holdings first to get AI recommendations.'
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .zerodha-integration {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .section-header h2 {
          color: #387ed1;
          margin-bottom: 8px;
        }

        .zerodha-connect-card {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          border: 2px solid #e5e7eb;
        }

        .benefits-list {
          text-align: left;
          margin: 24px 0;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .benefit-item {
          margin: 12px 0;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .security-note {
          margin-top: 16px;
          font-size: 14px;
          color: #6b7280;
          font-style: italic;
        }

        .zerodha-connected {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .connection-status {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .connection-actions {
          display: flex;
          gap: 8px;
        }

        .refresh-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
        }

        .data-section {
          margin: 24px 0;
        }

        .data-section h4 {
          color: #374151;
          margin-bottom: 16px;
          border-bottom: 2px solid #387ed1;
          padding-bottom: 8px;
        }

        .holdings-grid, .positions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }

        .holding-card, .position-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
        }

        .holding-symbol, .position-symbol {
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .profit {
          color: #10b981;
        }

        .loss {
          color: #ef4444;
        }

        .no-data {
          text-align: center;
          color: #6b7280;
          font-style: italic;
          padding: 40px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .more-items {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e5e7eb;
          border-radius: 8px;
          color: #6b7280;
          font-weight: 500;
        }


      `}</style>
    </div>
  );
};

export default ZerodhaIntegration;