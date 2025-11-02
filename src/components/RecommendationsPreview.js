import React, { useState, useEffect } from 'react';

// Technical Analysis Sample Data
const TECHNICAL_SAMPLE_DATA = [
  {
    id: 1,
    symbol: 'RELIANCE.NS',
    recommendedDate: 'Oct 15, 2024',
    suggested_price: 2850, // Price when recommended
    target_price: '₹3200',
    reason: 'Strong technical breakout above resistance. Volume confirmation present with bullish momentum indicators.',
    goal: 'Short-term gains of 12-15% within 3-6 months',
    remarks: 'Strong technical setup with RSI showing bullish divergence.',
    time_frame: '3-6 months',
    industry: 'Oil & Gas',
    position: 'buy'
  },
  {
    id: 2,
    symbol: 'INFY.NS',
    recommendedDate: 'Oct 12, 2024',
    suggested_price: 1780, // Price when recommended
    target_price: '₹1950',
    reason: 'Uptrend intact with strong support levels. Technical indicators showing continued momentum.',
    goal: 'Steady growth targeting 8-10% returns',
    remarks: 'Moving averages support upward trend. Watch for volume confirmation.',
    time_frame: '6-12 months',
    industry: 'IT Services',
    position: 'buy'
  },
  {
    id: 3,
    symbol: 'HDFCBANK.NS',
    recommendedDate: 'Oct 10, 2024',
    suggested_price: 1650, // Price when recommended
    target_price: '₹1800',
    reason: 'Consolidating in range. Wait for breakout confirmation above key resistance.',
    goal: 'Range-bound trading with 8-9% potential',
    remarks: 'Technical consolidation phase. Monitor for breakout signals.',
    time_frame: '6-9 months',
    industry: 'Banking',
    position: 'hold'
  },
  {
    id: 4,
    symbol: 'TCS.NS',
    recommendedDate: 'Oct 8, 2024',
    suggested_price: 4200, // Price when recommended
    target_price: '₹4500',
    reason: 'Technical indicators showing bullish momentum. Chart patterns suggest upward movement.',
    goal: 'Quality growth with 7-10% technical gains',
    remarks: 'Strong support at current levels. Bullish flag pattern forming.',
    time_frame: '9-12 months',
    industry: 'IT Services',
    position: 'buy'
  },
  {
    id: 5,
    symbol: 'ICICIBANK.NS',
    recommendedDate: 'Oct 5, 2024',
    suggested_price: 1180, // Price when recommended
    target_price: '₹1300',
    reason: 'Mixed signals with RSI approaching overbought levels but trend remains positive.',
    goal: 'Cautious approach with 8-10% potential',
    remarks: 'Technical correction possible. Entry on dips recommended.',
    time_frame: '6-8 months',
    industry: 'Banking',
    position: 'sell'
  }
];

// Fundamental Analysis Sample Data
const FUNDAMENTAL_SAMPLE_DATA = [
  {
    id: 1,
    symbol: 'RELIANCE.NS',
    recommendedDate: 'Oct 15, 2024',
    suggested_price: 2850, // Price when recommended
    target_price: '₹3400',
    reason: 'Strong balance sheet with diversified revenue streams. Oil-to-chemicals transition showing results.',
    goal: 'Long-term wealth creation with dividend income potential of 15-20%',
    remarks: 'Blue-chip fundamentals with strong cash flow generation and market leadership.',
    time_frame: '12-18 months',
    industry: 'Oil & Gas',
    position: 'buy'
  },
  {
    id: 2,
    symbol: 'INFY.NS',
    recommendedDate: 'Oct 12, 2024',
    suggested_price: 1780, // Price when recommended
    target_price: '₹2000',
    reason: 'Consistent revenue growth with strong digital capabilities and healthy profit margins.',
    goal: 'Growth investment with potential for 15-20% annual returns',
    remarks: 'Leading IT services company with strong client relationships and global presence.',
    time_frame: '12-24 months',
    industry: 'IT Services',
    position: 'buy'
  },
  {
    id: 3,
    symbol: 'HDFCBANK.NS',
    recommendedDate: 'Oct 10, 2024',
    suggested_price: 1650, // Price when recommended
    target_price: '₹1850',
    reason: 'Premium valuation justified by strong asset quality and consistent performance track record.',
    goal: 'Steady growth with dividend yield of 1-2% plus capital appreciation',
    remarks: 'Market leader in retail banking with strong fundamentals and brand value.',
    time_frame: '12-18 months',
    industry: 'Banking',
    position: 'hold'
  },
  {
    id: 4,
    symbol: 'TCS.NS',
    recommendedDate: 'Oct 8, 2024',
    suggested_price: 4200, // Price when recommended
    target_price: '₹4600',
    reason: 'Market leadership in IT services with strong client relationships and consistent cash generation.',
    goal: 'Quality growth stock for long-term portfolio with 12-15% returns',
    remarks: 'Excellent fundamentals with strong ROE and consistent dividend payments.',
    time_frame: '18-24 months',
    industry: 'IT Services',
    position: 'buy'
  },
  {
    id: 5,
    symbol: 'ICICIBANK.NS',
    recommendedDate: 'Oct 5, 2024',
    suggested_price: 1180, // Price when recommended
    target_price: '₹1320',
    reason: 'Improving asset quality with retail banking focus paying off. Strong growth trajectory.',
    goal: 'Growth with value - targeting 12-15% annual returns',
    remarks: 'Strong fundamentals with improving ROE and reduced NPA levels.',
    time_frame: '12-18 months',
    industry: 'Banking',
    position: 'sell'
  }
];

const RecommendationsPreview = () => {
  const [currentPrices, setCurrentPrices] = useState({});
  const [peData, setPeData] = useState({});
  const [loading, setLoading] = useState(true);

  // Industry PE mapping - could be fetched from a financial data API
  const INDUSTRY_PE_MAP = {
    'Oil & Gas': 28.2,
    'IT Services': 26.4,
    'Banking': 18.5,
    'Pharmaceuticals': 24.8,
    'Automobiles': 22.1,
    'FMCG': 31.5,
    'Metals': 15.2,
    'Telecommunications': 19.8
  };

  // Function to fetch PE data from API
  const fetchPEData = async (symbol) => {
    try {
      // Try to get PE data from your backend API first
      const response = await fetch(`https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net/api/stock-details/${symbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && typeof data.data.pe === 'number' && data.data.pe > 0) {
          console.log(`✅ Got PE data from backend for ${symbol}: ${data.data.pe}`);
          return parseFloat(data.data.pe);
        }
      }
      
      throw new Error('Backend PE API failed or returned invalid data');
    } catch (error) {
      console.warn(`⚠️ Using fallback PE data for ${symbol}:`, error.message);
      
      // Fallback PE values - these should ideally come from a reliable financial data source
      // In production, you might want to use Yahoo Finance API, Alpha Vantage, or similar
      const fallbackPE = {
        'RELIANCE.NS': 26.5,
        'INFY.NS': 24.8,
        'HDFCBANK.NS': 19.3,
        'TCS.NS': 29.1,
        'ICICIBANK.NS': 16.7
      };
      
      const pe = fallbackPE[symbol];
      return pe ? parseFloat(pe) : null;
    }
  };

  // Function to fetch current market price 
  const fetchCurrentPrice = async (symbol) => {
    try {
      // Method 1: Try your backend API
      const backendResponse = await fetch(`https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net/api/stock-price/${symbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        
        if (backendData.success && backendData.price) {
          console.log(`✅ Got price from backend for ${symbol}: ₹${backendData.price}`);
          return backendData.price;
        }
      }
      
      throw new Error('Backend API failed or returned invalid data');
    } catch (error) {
      console.warn(`⚠️ Using mock data for ${symbol}:`, error.message);
      
      // Fallback: Enhanced mock data with slight randomization for demo
      const basePrices = {
        'RELIANCE.NS': 2920.50,
        'INFY.NS': 1825.75,
        'HDFCBANK.NS': 1685.30,
        'TCS.NS': 4320.80,
        'ICICIBANK.NS': 1210.25
      };
      
      const basePrice = basePrices[symbol];
      if (basePrice) {
        // Add slight random variation to make it look more realistic
        const variation = (Math.random() - 0.5) * basePrice * 0.02; // ±1% variation
        return parseFloat((basePrice + variation).toFixed(2));
      }
      
      return null;
    }
  };

  // Function to calculate profit/loss percentage
  const calculateProfitLoss = (suggestedPrice, currentPrice) => {
    if (!currentPrice || !suggestedPrice) return null;
    return ((currentPrice - suggestedPrice) / suggestedPrice * 100).toFixed(2);
  };

  // Function to get all unique symbols from both datasets
  const getAllSymbols = () => {
    const technicalSymbols = TECHNICAL_SAMPLE_DATA.map(item => item.symbol);
    const fundamentalSymbols = FUNDAMENTAL_SAMPLE_DATA.map(item => item.symbol);
    return [...new Set([...technicalSymbols, ...fundamentalSymbols])];
  };

  // Fetch current prices and PE data for all stocks
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const symbols = getAllSymbols();
      const prices = {};
      const peRatios = {};
      
      // Fetch prices and PE data for all symbols
      const dataPromises = symbols.map(async (symbol) => {
        const [price, pe] = await Promise.all([
          fetchCurrentPrice(symbol),
          fetchPEData(symbol)
        ]);
        
        if (price) {
          prices[symbol] = price;
        }
        if (pe) {
          peRatios[symbol] = pe;
        }
      });
      
      await Promise.all(dataPromises);
      setCurrentPrices(prices);
      setPeData(peRatios);
      setLoading(false);
    };

    fetchAllData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderRecommendationTable = (data, title) => (
    <div className="recommendations-table-section">
      <h3>{title}</h3>
      <div className="recommendations-table-container">
        <table className="recommendations-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Industry</th>
              <th>Date</th>
              <th>Suggested Price</th>
              <th>CMP</th>
              <th>P/L %</th>
              <th>Target Price</th>
              <th>PE</th>
              <th>Industry PE</th>
              <th>Position</th>
              <th>Reason</th>
              <th>Remarks</th>
              <th>Time Frame</th>
            </tr>
          </thead>
          <tbody>
            {data.map((stock, index) => {
              const currentPrice = currentPrices[stock.symbol];
              const profitLoss = calculateProfitLoss(stock.suggested_price, currentPrice);
              const isLoss = currentPrice && currentPrice < stock.suggested_price;
              
              return (
                <tr key={stock.symbol || index} className={isLoss ? 'loss-row' : 'profit-row'}>
                  <td className="stock-symbol">
                    <strong>{stock.symbol || 'N/A'}</strong>
                  </td>
                  <td className="industry">
                    {stock.industry || 'N/A'}
                  </td>
                  <td className="recommended-date">
                    {stock.recommendedDate ? stock.recommendedDate.replace('Oct ', '').replace(', 2024', '') : 'N/A'}
                  </td>
                  <td className="suggested-price">
                    <strong>₹{stock.suggested_price || 'N/A'}</strong>
                  </td>
                  <td className="current-price">
                    {loading ? (
                      <span className="loading-price">⏳</span>
                    ) : currentPrice ? (
                      <strong>₹{currentPrice.toFixed(2)}</strong>
                    ) : (
                      <span className="price-error">❌</span>
                    )}
                  </td>
                  <td className="profit-loss">
                    {loading ? (
                      <span className="loading-price">⏳</span>
                    ) : profitLoss !== null ? (
                      <span className={`pl-badge ${parseFloat(profitLoss) >= 0 ? 'profit' : 'loss'}`}>
                        {parseFloat(profitLoss) >= 0 ? '+' : ''}{profitLoss}%
                      </span>
                    ) : (
                      <span className="price-error">❌</span>
                    )}
                  </td>
                  <td className="target-price">
                    <strong>{stock.target_price || 'N/A'}</strong>
                  </td>
                  <td className="pe-ratio">
                    {loading ? (
                      <span className="loading-price">⏳</span>
                    ) : peData[stock.symbol] ? (
                      peData[stock.symbol].toFixed(1)
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="industry-pe">
                    {INDUSTRY_PE_MAP[stock.industry] ? INDUSTRY_PE_MAP[stock.industry].toFixed(1) : 'N/A'}
                  </td>
                  <td className="position">
                    <span className={`position-badge ${stock.position || 'buy'}`}>
                      {(stock.position || 'buy').toUpperCase()}
                    </span>
                  </td>
                  <td className="reason-tooltip">
                    <button 
                      className="info-btn" 
                      title={stock.reason || 'No reason provided'}
                      aria-label="View reason"
                    >
                      ℹ️
                    </button>
                  </td>
                  <td className="remarks-tooltip">
                    <button 
                      className="info-btn" 
                      title={stock.remarks || 'No remarks'}
                      aria-label="View remarks"
                    >
                      💬
                    </button>
                  </td>
                  <td className="time-frame">
                    <span className="time-badge">
                      {stock.time_frame || 'N/A'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="recommendations-preview">
      <h3>🤖 Recommendations</h3>
      
      <div className="recommendations-content-vertical">
        {/* Technical Analysis Table */}
        {renderRecommendationTable(TECHNICAL_SAMPLE_DATA, '📈 Technical Analysis')}
        
        {/* Fundamental Analysis Table */}
        {renderRecommendationTable(FUNDAMENTAL_SAMPLE_DATA, '📊 Fundamental Analysis')}
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