import React, { useState, useEffect } from 'react';

// Technical Analysis Sample Data
const TECHNICAL_SAMPLE_DATA = [
  {
    id: 1,
    symbol: 'NSE:RELIANCE',
    displaySymbol: 'RELIANCE.NS',
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
    symbol: 'NSE:INFY',
    displaySymbol: 'INFY.NS',
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
    symbol: 'NSE:HDFCBANK',
    displaySymbol: 'HDFCBANK.NS',
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
    symbol: 'NSE:TCS',
    displaySymbol: 'TCS.NS',
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
    symbol: 'NSE:ICICIBANK',
    displaySymbol: 'ICICIBANK.NS',
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
  // New stocks added from user request
  {
    id: 1,
    symbol: 'ULTRAMAR.BO',
    displaySymbol: 'ULTRAMAR.BO',
    recommendedDate: 'July 19, 2025',
    suggested_price: 590, // Buy Signal price
    target_price: '₹710',
    reason: 'Niche player in pigments sector with strong export potential and improving margins.',
    goal: 'Small-cap growth story with 20-25% potential returns',
    remarks: 'Specialized chemical company with focused product portfolio and export growth.',
    time_frame: '12-18 months',
    industry: 'Chemicals',
    position: 'buy'
  },
  {
    id: 17,
    symbol: 'CEINSYSTECH.BO',
    displaySymbol: 'CEINSYSTECH.BO',
    recommendedDate: 'Feb 2, 2025',
    suggested_price: 1730, // Buy Signal price
    target_price: '₹2100',
    reason: 'Technology services company with growing order book and digital transformation focus.',
    goal: 'Mid-cap IT play with 18-22% growth potential',
    remarks: 'Strong fundamentals in niche technology solutions with government contracts.',
    time_frame: '15-20 months',
    industry: 'IT Services',
    position: 'buy'
  },
  {
    id: 2,
    symbol: 'NSE:GRWRHITECH',
    displaySymbol: 'GRWRHITECH.NS',
    recommendedDate: 'Nov 15, 2024',
    suggested_price: 4000, // Buy Signal price
    target_price: '₹4800',
    reason: 'Leading packaging films manufacturer with strong automotive and industrial demand.',
    goal: 'Quality manufacturing play with 15-18% returns',
    remarks: 'Strong market position in specialty films with expanding capacity.',
    time_frame: '12-15 months',
    industry: 'Packaging',
    position: 'buy'
  },
  {
    id: 3,
    symbol: 'NSE:ARVINDFASN',
    displaySymbol: 'ARVINDFASN.NS',
    recommendedDate: 'Nov 25, 2025',
    suggested_price: 575, // Buy Signal price
    target_price: '₹690',
    reason: 'Fashion retail recovery story with strong brand portfolio and omnichannel presence.',
    goal: 'Consumer discretionary recovery with 18-20% upside',
    remarks: 'Improving same-store sales growth and margin expansion in key brands.',
    time_frame: '10-14 months',
    industry: 'Textiles & Apparel',
    position: 'buy'
  },
  {
    id: 4,
    symbol: 'NSE:RATEGAIN',
    displaySymbol: 'RATEGAIN.NS',
    recommendedDate: 'Oct 25, 2025',
    suggested_price: 720, // Buy Signal price
    target_price: '₹860',
    reason: 'Travel technology platform benefiting from hospitality sector recovery and digitization.',
    goal: 'High-growth SaaS model with 20-25% potential',
    remarks: 'Strong recurring revenue model with global hotel chain partnerships.',
    time_frame: '12-18 months',
    industry: 'Technology',
    position: 'buy'
  },
  {
    id: 5,
    symbol: 'NSE:SHAKTIPUMP',
    displaySymbol: 'SHAKTIPUMP.NS',
    recommendedDate: 'Sep 1, 2025',
    suggested_price: 890, // Buy Signal price
    target_price: '₹1070',
    reason: 'Leading pump manufacturer benefiting from agriculture and solar pump demand.',
    goal: 'Infrastructure play with 15-18% growth potential',
    remarks: 'Strong order book and government policy support for solar pumps.',
    time_frame: '12-16 months',
    industry: 'Industrial Equipment',
    position: 'buy'
  },
  {
    id: 6,
    symbol: 'NSE:ENTERO',
    displaySymbol: 'ENTERO.NS',
    recommendedDate: 'Sep 9, 2025',
    suggested_price: 1200, // Buy Signal price
    target_price: '₹1440',
    reason: 'Healthcare solutions provider with growing hospital chain partnerships.',
    goal: 'Healthcare sector growth with 22-25% returns',
    remarks: 'Expanding service portfolio and strong client retention rates.',
    time_frame: '15-20 months',
    industry: 'Healthcare',
    position: 'buy'
  },
  {
    id: 7,
    symbol: 'NSE:INFOLION',
    displaySymbol: 'INFOLLION-SM.NS',
    recommendedDate: 'Jan 11, 2025',
    suggested_price: 424, // Buy Signal price
    target_price: '₹510',
    reason: 'Research and analytics services company with growing institutional client base.',
    goal: 'Knowledge services play with 20-24% upside',
    remarks: 'Niche player in financial research with strong moat and recurring revenues.',
    time_frame: '12-18 months',
    industry: 'Financial Services',
    position: 'buy'
  },
  {
    id: 8,
    symbol: 'NSE:JUBLPHARMA',
    displaySymbol: 'JUBLPHARMA.NS',
    recommendedDate: 'Oct 25, 2025',
    suggested_price: 1176, // Buy Signal price
    target_price: '₹1410',
    reason: 'Pharmaceutical company with strong CDMO business and improving margins.',
    goal: 'Pharma sector recovery with 18-20% potential',
    remarks: 'Diversified pharma portfolio with contract manufacturing growth.',
    time_frame: '14-18 months',
    industry: 'Pharmaceuticals',
    position: 'buy'
  },
  {
    id: 9,
    symbol: 'NSE:INNOVACAP',
    displaySymbol: 'INNOVACAP.NS',
    recommendedDate: 'Apr 14, 2025',
    suggested_price: 875, // Buy Signal price
    target_price: '₹1050',
    reason: 'Specialty chemicals company with focus on pharmaceutical intermediates.',
    goal: 'Chemical sector play with 20-22% growth',
    remarks: 'Strong R&D capabilities and expanding product pipeline.',
    time_frame: '12-15 months',
    industry: 'Chemicals',
    position: 'buy'
  },
  {
    id: 10,
    symbol: 'BSE:539551',
    displaySymbol: 'NH.NS',
    recommendedDate: 'Sep 1, 2025',
    suggested_price: 1750, // Buy Signal price
    target_price: '₹2100',
    reason: 'Leading healthcare chain with strong fundamentals and expansion plans.',
    goal: 'Healthcare infrastructure growth with 18-20% returns',
    remarks: 'Premium healthcare provider with strong brand and operational efficiency.',
    time_frame: '15-20 months',
    industry: 'Healthcare',
    position: 'buy'
  },
  {
    id: 11,
    symbol: 'NSE:SANGHVIMOV',
    displaySymbol: 'SANGHVIMOV.NS',
    recommendedDate: 'Sep 1, 2025',
    suggested_price: 387, // Buy Signal price
    target_price: '₹465',
    reason: 'Heavy equipment rental services benefiting from infrastructure development.',
    goal: 'Infrastructure capex play with 18-19% upside',
    remarks: 'Strong fleet utilization and growing order book from infra projects.',
    time_frame: '12-16 months',
    industry: 'Industrial Services',
    position: 'buy'
  },
  {
    id: 12,
    symbol: 'NSE:BETA',
    displaySymbol: 'BETA.NS',
    recommendedDate: 'Aug 1, 2025',
    suggested_price: 1800, // Buy Signal price
    target_price: '₹2160',
    reason: 'Pharmaceutical company with strong generic portfolio and export presence.',
    goal: 'Pharma generic play with 20-21% potential',
    remarks: 'Growing international business and new product launches.',
    time_frame: '14-18 months',
    industry: 'Pharmaceuticals',
    position: 'buy'
  },
  {
    id: 13,
    symbol: 'NSE:ASTRAMICRO',
    displaySymbol: 'ASTRAMICRO.NS',
    recommendedDate: 'Aug 1, 2025',
    suggested_price: 1000, // Buy Signal price
    target_price: '₹1200',
    reason: 'Defense electronics company benefiting from government defense spending.',
    goal: 'Defense sector growth with 20-21% returns',
    remarks: 'Strong order book and focus on indigenization initiatives.',
    time_frame: '15-20 months',
    industry: 'Defense',
    position: 'buy'
  },
  {
    id: 14,
    symbol: 'NSE:SAMHI',
    displaySymbol: 'SAMHI.NS',
    recommendedDate: 'Apr 20, 2025',
    suggested_price: 193, // Buy Signal price
    target_price: '₹232',
    reason: 'Hotel asset management company benefiting from hospitality sector recovery.',
    goal: 'Tourism recovery play with 20-21% upside',
    remarks: 'Asset-light model with strong portfolio of premium hotels.',
    time_frame: '12-16 months',
    industry: 'Hotels & Tourism',
    position: 'buy'
  },
  {
    id: 15,
    symbol: 'NSE:THANGAMAYL',
    displaySymbol: 'THANGAMAYL.NS',
    recommendedDate: 'Apr 20, 2025',
    suggested_price: 2000, // Buy Signal price
    target_price: '₹2800',
    reason: 'Regional jewelry chain with strong brand presence and expansion strategy.',
    goal: 'Consumer discretionary play with 19% potential',
    remarks: 'Growing store network and improving same-store sales growth.',
    time_frame: '14-18 months',
    industry: 'Retail',
    position: 'buy'
  },
  {
    id: 16,
    symbol: 'BSE:519600',
    displaySymbol: 'CCL.NS',
    recommendedDate: 'Jun 1, 2025',
    suggested_price: 786, // Buy Signal price
    target_price: '₹943',
    reason: 'Coffee processing and export company with strong international presence.',
    goal: 'FMCG export play with 18% growth potential',
    remarks: 'Leading instant coffee manufacturer with global reach and brand strength.',
    time_frame: '12-15 months',
    industry: 'FMCG',
    position: 'buy'
  },
  {
    id: 17,
    symbol: 'NSE:CARYSIL',
    displaySymbol: 'CARYSIL.NS',
    recommendedDate: 'Jun 1, 2025',
    suggested_price: 850, // Buy Signal price
    target_price: '₹1020',
    reason: 'Kitchen sink manufacturer with strong brand presence and export growth.',
    goal: 'Consumer durables play with 21% upside',
    remarks: 'Market leader in quartz sinks with expanding domestic and export markets.',
    time_frame: '12-16 months',
    industry: 'Consumer Durables',
    position: 'buy'
  }
];

const RecommendationsPreview = () => {
  const [currentPrices, setCurrentPrices] = useState({});
  const [peData, setPeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [chartModal, setChartModal] = useState({ isOpen: false, symbol: '', displaySymbol: '' });

  // Industry PE mapping - could be fetched from a financial data API
  const INDUSTRY_PE_MAP = {
    'Oil & Gas': 28.2,
    'IT Services': 26.4,
    'Banking': 18.5,
    'Pharmaceuticals': 24.8,
    'Automobiles': 22.1,
    'FMCG': 31.5,
    'Metals': 15.2,
    'Telecommunications': 19.8,
    'Chemicals': 22.5,
    'Packaging': 25.1,
    'Textiles & Apparel': 19.3,
    'Technology': 28.7,
    'Industrial Equipment': 21.4,
    'Healthcare': 27.8,
    'Financial Services': 16.9,
    'Industrial Services': 18.6,
    'Defense': 32.1,
    'Hotels & Tourism': 24.3,
    'Retail': 26.8,
    'Consumer Durables': 23.4
  };

  // Function to fetch PE data from API
  const fetchPEData = async (symbol) => {
    try {
      // Try to get PE data from your backend API first
      const response = await fetch(`https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net/api/stock-details/${symbol}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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

  // Function to get all unique symbols from both datasets (use displaySymbol for API calls)
  const getAllSymbols = () => {
    const technicalSymbols = TECHNICAL_SAMPLE_DATA.map(item => item.displaySymbol);
    const fundamentalSymbols = FUNDAMENTAL_SAMPLE_DATA.map(item => item.displaySymbol);
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
              <th>Chart</th>
              <th>Reason</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {data.map((stock, index) => {
              const currentPrice = currentPrices[stock.displaySymbol];
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
                    {stock.recommendedDate || 'N/A'}
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
                    ) : peData[stock.displaySymbol] ? (
                      peData[stock.displaySymbol].toFixed(1)
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
                  <td className="chart-button">
                    <button 
                      className="chart-btn" 
                      onClick={() => setChartModal({ isOpen: true, symbol: stock.symbol, displaySymbol: stock.displaySymbol })}
                      title="View Chart"
                    >
                      📈
                    </button>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Chart Modal Component
  const ChartModal = () => {
    if (!chartModal.isOpen) return null;

    return (
      <div className="chart-modal-overlay" onClick={() => setChartModal({ isOpen: false, symbol: '', displaySymbol: '' })}>
        <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="chart-modal-header">
            <h3>📈 {chartModal.displaySymbol || chartModal.symbol} - Stock Chart</h3>
            <button 
              className="chart-modal-close"
              onClick={() => setChartModal({ isOpen: false, symbol: '', displaySymbol: '' })}
            >
              ✕
            </button>
          </div>
          <div className="chart-container">
            {/* Chart Links Section */}
            <div style={{ 
              padding: '30px', 
              textAlign: 'center', 
              backgroundColor: '#f8f9fa', 
              margin: '10px 0',
              borderRadius: '12px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#2c3e50' }}>
                📊 Stock Chart for {chartModal.displaySymbol || chartModal.symbol}
              </h4>
              <p style={{ margin: '10px 0', fontSize: '14px', color: '#6c757d' }}>
                View detailed candlestick charts and technical analysis:
              </p>
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                <a 
                  href={`https://finance.yahoo.com/quote/${chartModal.displaySymbol || chartModal.symbol.replace('NSE:', '') + '.NS'}/chart`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#6f42c1',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'inline-block',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#5a359a'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#6f42c1'}
                >
                  📈 Yahoo Finance Chart
                </a>
                
                <a 
                  href={`https://www.google.com/finance/quote/${(chartModal.displaySymbol || chartModal.symbol).replace('.NS', '').replace('NSE:', '')}:NSE`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '12px 20px',  
                    backgroundColor: '#28a745',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'inline-block',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                >
                  📊 Google Finance Chart
                </a>
                
                <a 
                  href={`https://in.tradingview.com/chart/?symbol=NSE%3A${(chartModal.displaySymbol || chartModal.symbol).replace('.NS', '').replace('NSE:', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'inline-block',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                  📈 TradingView Pro
                </a>
              </div>
              
              <div style={{ marginTop: '20px', fontSize: '12px', color: '#868e96' }}>
                <p>💡 <strong>Tip:</strong> These external charts provide full candlestick analysis, technical indicators, and real-time data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
      
      {/* Chart Modal */}
      <ChartModal />
    </div>
  );
};

export default RecommendationsPreview;
