import React from 'react';

// Stock recommendations data - Update this array to change recommendations
const SAMPLE_RECOMMENDATIONS = [
  {
    id: 1,
    name: 'Reliance Industries Limited',
    symbol: 'RELIANCE.NS',
    recommendedDate: 'Oct 15, 2024',
    reason: 'Strong fundamentals with diversified business portfolio. Oil-to-chemicals integrated model showing resilience.',
    goal: 'Long-term wealth creation with dividend income',
    remarks: 'Blue-chip stock suitable for conservative investors. Monitor quarterly results for petrochemicals segment.'
  },
  {
    id: 2,
    name: 'Infosys Limited',
    symbol: 'INFY.NS',
    recommendedDate: 'Oct 12, 2024',
    reason: 'Leading IT services company with strong digital transformation capabilities. Consistent revenue growth and margin expansion.',
    goal: 'Growth investment with potential for 15-20% annual returns',
    remarks: 'Benefits from global IT spending trends. Watch for client concentration and currency headwinds.'
  },
  {
    id: 3,
    name: 'HDFC Bank Limited',
    symbol: 'HDFCBANK.NS',
    recommendedDate: 'Oct 10, 2024',
    reason: 'Premium private sector bank with strong asset quality and consistent performance. Post-merger synergies expected.',
    goal: 'Steady growth with dividend yield of 1-2%',
    remarks: 'Market leader in retail banking. Monitor NPA levels and credit growth sustainability.'
  },
  {
    id: 4,
    name: 'Tata Consultancy Services',
    symbol: 'TCS.NS',
    recommendedDate: 'Oct 8, 2024',
    reason: 'Largest IT services company with strong client relationships and diversified service offerings. Focus on AI and cloud.',
    goal: 'Quality growth stock for long-term portfolio',
    remarks: 'Consistent cash flow generation. Track deal wins and employee utilization rates.'
  },
  {
    id: 5,
    name: 'ICICI Bank Limited',
    symbol: 'ICICIBANK.NS',
    recommendedDate: 'Oct 5, 2024',
    reason: 'Well-managed private bank with strong retail franchise and improving asset quality. Digital banking leadership.',
    goal: 'Growth with value - targeting 12-15% annual returns',
    remarks: 'Strong ROE improvement trajectory. Monitor loan growth across segments.'
  }
];

const RecommendationsPreview = () => {
  const renderRecommendationItem = (recommendation) => (
    <div key={recommendation.id} className="recommendation-item">
      <div className="stock-header">
        <div className="stock-info">
          <h4 className="stock-name">{recommendation.name}</h4>
          <span className="stock-symbol">{recommendation.symbol}</span>
        </div>
        <div className="recommendation-date">
          📅 {recommendation.recommendedDate}
        </div>
      </div>
      
      <div className="recommendation-content">
        <div className="recommendation-section">
          <strong>💡 Reason:</strong>
          <p>{recommendation.reason}</p>
        </div>
        
        <div className="recommendation-section">
          <strong>🎯 Investment Goal:</strong>
          <p>{recommendation.goal}</p>
        </div>
        
        <div className="recommendation-section">
          <strong>📝 Remarks:</strong>
          <p>{recommendation.remarks}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="recommendations-preview">
      <h3>🤖 AI Stock Recommendations</h3>
      <div className="recommendations-list">
        {SAMPLE_RECOMMENDATIONS.map(renderRecommendationItem)}
      </div>
      
      <div className="recommendations-disclaimer">
        <p>
          <span>⚠️</span>
          <strong>Investment Disclaimer:</strong> These recommendations are for educational purposes only. 
          Please conduct your own research and consult with a financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
};

export default RecommendationsPreview;