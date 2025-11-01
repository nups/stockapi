import React from 'react';

// Stock recommendations data - Update this array to change recommendations
const SAMPLE_RECOMMENDATIONS = [
  {
    id: 1,
    symbol: 'RELIANCE',
    exchange: 'NSE',
    suggestedPrice: 2847,
    currentPrice: 2965,
    suggestedDate: 'Oct 15, 2024',
    action: 'BUY',
    changePercent: 4.1
  },
  {
    id: 2,
    symbol: 'INFY',
    exchange: 'NSE',
    suggestedPrice: 1742,
    currentPrice: 1825,
    suggestedDate: 'Oct 12, 2024',
    action: 'BUY',
    changePercent: 4.8
  },
  {
    id: 3,
    symbol: 'HDFCBANK',
    exchange: 'NSE',
    suggestedPrice: 1654,
    currentPrice: 1721,
    suggestedDate: 'Oct 10, 2024',
    action: 'BUY',
    changePercent: 4.0
  },
  {
    id: 4,
    symbol: 'TCS',
    exchange: 'NSE',
    suggestedPrice: 3985,
    currentPrice: 4142,
    suggestedDate: 'Oct 8, 2024',
    action: 'BUY',
    changePercent: 3.9
  },
  {
    id: 5,
    symbol: 'ICICIBANK',
    exchange: 'NSE',
    suggestedPrice: 1245,
    currentPrice: 1287,
    suggestedDate: 'Oct 5, 2024',
    action: 'BUY',
    changePercent: 3.4
  }
];

const RecommendationsPreview = () => {
  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };

  const getActionClass = (action) => {
    return `action ${action.toLowerCase()}`;
  };

  const renderRecommendationItem = (recommendation) => (
    <div key={recommendation.id} className="recommendation-item">
      <div className="stock-info">
        <strong>{recommendation.symbol}</strong>
        <span className="stock-exchange">{recommendation.exchange}</span>
      </div>
      <div className="recommendation-details">
        <div className="price-info">
          <span className="suggested-price">{formatPrice(recommendation.suggestedPrice)}</span>
          <span className="current-price">
            {formatPrice(recommendation.currentPrice)} (+{recommendation.changePercent}%)
          </span>
        </div>
        <div className="meta-info">
          <span className="date">Suggested: {recommendation.suggestedDate}</span>
          <span className={getActionClass(recommendation.action)}>
            {recommendation.action}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="recommendations-preview">
      <h3>📈 Latest AI Stock Recommendations</h3>
      <div className="recommendations-list">
        {SAMPLE_RECOMMENDATIONS.map(renderRecommendationItem)}
      </div>
      
      <div className="recommendations-disclaimer">
        <p>
          <span>⚠️</span>
          <strong>Disclaimer:</strong> These are sample recommendations for demonstration. 
          For real-time AI recommendations based on your portfolio, please sign in.
        </p>
      </div>
    </div>
  );
};

export default RecommendationsPreview;