import React, { useState, useEffect } from 'react';
import api from '../services/authService';

const StockRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    minScore: 0,
    maxRisk: 'High',
    actionPriority: 'All'
  });

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/api/zerodha/holdings-ai');
      
      if (response.data && Array.isArray(response.data)) {
        setRecommendations(response.data);
        setLastUpdated(new Date().toLocaleString());
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Failed to load AI recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'excellent';
    if (score >= 7) return 'good';
    if (score >= 6) return 'fair';
    if (score >= 5) return 'average';
    return 'poor';
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'risk-low';
      case 'medium': return 'risk-medium';
      case 'high': return 'risk-high';
      default: return 'risk-unknown';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'immediate': return 'priority-immediate';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-unknown';
    }
  };

  const filteredRecommendations = recommendations.filter(stock => {
    const meetsScore = (stock.overall_score || 0) >= filters.minScore;
    const meetsRisk = filters.maxRisk === 'All' || 
      (stock.risk_level && stock.risk_level.toLowerCase() === filters.maxRisk.toLowerCase());
    const meetsPriority = filters.actionPriority === 'All' || 
      (stock.action_priority && stock.action_priority.toLowerCase() === filters.actionPriority.toLowerCase());
    
    return meetsScore && (filters.maxRisk === 'All' || meetsRisk) && meetsPriority;
  });

  return (
    <div className="stock-recommendations">
      <div className="recommendations-header">
        <div className="header-title">
          <h2>🤖 AI Stock Recommendations</h2>
          {lastUpdated && (
            <span className="last-updated">Last updated: {lastUpdated}</span>
          )}
        </div>
        <button 
          className="refresh-btn" 
          onClick={fetchRecommendations}
          disabled={loading}
        >
          {loading ? '🔄' : '🔄'} Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="recommendations-filters">
        <div className="filter-group">
          <label>Min Overall Score:</label>
          <select 
            value={filters.minScore} 
            onChange={(e) => setFilters({...filters, minScore: parseInt(e.target.value)})}
          >
            <option value="0">All Scores</option>
            <option value="5">5+ (Average)</option>
            <option value="6">6+ (Fair)</option>
            <option value="7">7+ (Good)</option>
            <option value="8">8+ (Excellent)</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Risk Level:</label>
          <select 
            value={filters.maxRisk} 
            onChange={(e) => setFilters({...filters, maxRisk: e.target.value})}
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Priority:</label>
          <select 
            value={filters.actionPriority} 
            onChange={(e) => setFilters({...filters, actionPriority: e.target.value})}
          >
            <option value="All">All Priorities</option>
            <option value="Immediate">Immediate</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner">🔄</div>
          <p>Loading AI recommendations...</p>
        </div>
      )}

      {/* Recommendations Table */}
      {!loading && !error && (
        <div className="recommendations-table-container">
          {filteredRecommendations.length === 0 ? (
            <div className="no-recommendations">
              <p>No recommendations match your current filters.</p>
            </div>
          ) : (
            <table className="recommendations-table">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Current Price</th>
                  <th>Target Price</th>
                  <th>Fundamental</th>
                  <th>Technical</th>
                  <th>Overall Score</th>
                  <th>Risk Level</th>
                  <th>Priority</th>
                  <th>Recommendation</th>
                  <th>Risk Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecommendations.map((stock, index) => (
                  <tr key={stock.symbol || index}>
                    <td className="stock-symbol">
                      <strong>{stock.symbol || 'N/A'}</strong>
                      {stock.company_name && (
                        <small>{stock.company_name}</small>
                      )}
                    </td>
                    <td className="price">
                      ₹{stock.current_price || 'N/A'}
                    </td>
                    <td className="price">
                      ₹{stock.target_price || 'N/A'}
                      {stock.current_price && stock.target_price && (
                        <small className={
                          stock.target_price > stock.current_price ? 'positive' : 'negative'
                        }>
                          ({((stock.target_price - stock.current_price) / stock.current_price * 100).toFixed(1)}%)
                        </small>
                      )}
                    </td>
                    <td>
                      <span className={`score-badge ${getScoreColor(stock.fundamental_score)}`}>
                        {stock.fundamental_score || 'N/A'}/10
                      </span>
                    </td>
                    <td>
                      <span className={`score-badge ${getScoreColor(stock.technical_score)}`}>
                        {stock.technical_score || 'N/A'}/10
                      </span>
                    </td>
                    <td>
                      <span className={`score-badge ${getScoreColor(stock.overall_score)}`}>
                        {stock.overall_score || 'N/A'}/10
                      </span>
                    </td>
                    <td>
                      <span className={`risk-badge ${getRiskColor(stock.risk_level)}`}>
                        {stock.risk_level || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge ${getPriorityColor(stock.action_priority)}`}>
                        {stock.action_priority || 'Unknown'}
                      </span>
                    </td>
                    <td className="recommendation">
                      <span className={`action-badge ${stock.recommendation?.toLowerCase()}`}>
                        {stock.recommendation || 'N/A'}
                      </span>
                    </td>
                    <td className="risk-notes">
                      {stock.risk_note && (
                        <span className="risk-note" title={stock.risk_note}>
                          ⚠️ {stock.risk_note.length > 50 ? 
                            stock.risk_note.substring(0, 50) + '...' : 
                            stock.risk_note}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Summary Stats */}
      {!loading && !error && filteredRecommendations.length > 0 && (
        <div className="recommendations-summary">
          <div className="summary-stats">
            <div className="stat">
              <span>Total Recommendations:</span>
              <strong>{filteredRecommendations.length}</strong>
            </div>
            <div className="stat">
              <span>Buy Signals:</span>
              <strong>{filteredRecommendations.filter(s => s.recommendation?.toLowerCase() === 'buy').length}</strong>
            </div>
            <div className="stat">
              <span>Sell Signals:</span>
              <strong>{filteredRecommendations.filter(s => s.recommendation?.toLowerCase() === 'sell').length}</strong>
            </div>
            <div className="stat">
              <span>Hold Signals:</span>
              <strong>{filteredRecommendations.filter(s => s.recommendation?.toLowerCase() === 'hold').length}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockRecommendations;