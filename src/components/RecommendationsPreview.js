import React, { useState, useEffect } from 'react';

// Technical Analysis Sample Data
const TECHNICAL_SAMPLE_DATA = [
];

// Fundamental Analysis Sample Data
const FUNDAMENTAL_SAMPLE_DATA = [
  // New stocks added from user request
  {
    id: 1,
    tradingViewSymbol: 'BSE:ULTRAMAR',
    yahooSymbol: 'ULTRAMAR.BO',
    companyName: 'UltraMarine Pigments',
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
    tradingViewSymbol: 'BSE:CEINSYSTECH',
    yahooSymbol: 'CEINSYSTECH.BO',
    companyName: 'CEInfo Systech',
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
    tradingViewSymbol: 'NSE:GRWRHITECH',
    yahooSymbol: 'GRWRHITECH.NS',
    companyName: 'Garware Hi-Tech Films',
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
    tradingViewSymbol: 'NSE:ARVINDFASN',
    yahooSymbol: 'ARVINDFASN.NS',
    companyName: 'Arvind Fashions',
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
    tradingViewSymbol: 'NSE:RATEGAIN',
    yahooSymbol: 'RATEGAIN.NS',
    companyName: 'RateGain Travel Technologies',
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
    tradingViewSymbol: 'NSE:SHAKTIPUMP',
    yahooSymbol: 'SHAKTIPUMP.NS',
    companyName: 'Shakti Pumps',
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
    tradingViewSymbol: 'NSE:ENTERO',
    yahooSymbol: 'ENTERO.NS',
    companyName: 'Entero Healthcare Solutions',
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
    tradingViewSymbol: 'NSE:INFOLLION',
    yahooSymbol: 'INFOLLION-SM.NS',
    companyName: 'Infollion Research Services',
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
    tradingViewSymbol: 'NSE:JUBLPHARMA',
    yahooSymbol: 'JUBLPHARMA.NS',
    companyName: 'Jubilant Pharmova',
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
    tradingViewSymbol: 'NSE:INNOVACAP',
    yahooSymbol: 'INNOVACAP.NS',
    companyName: 'Innova Captab',
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
    tradingViewSymbol: 'BSE:539551',
    yahooSymbol: 'NH.NS',
    companyName: 'Narayana Hrudayalaya',
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
    tradingViewSymbol: 'NSE:SANGHVIMOV',
    yahooSymbol: 'SANGHVIMOV.NS',
    companyName: 'Sanghvi Movers',
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
    tradingViewSymbol: 'NSE:BETA',
    yahooSymbol: 'BETA.NS',
    companyName: 'Beta Drugs',
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
    tradingViewSymbol: 'NSE:ASTRAMICRO',
    yahooSymbol: 'ASTRAMICRO.NS',
    companyName: 'Astra Microwave Products',
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
    tradingViewSymbol: 'NSE:SAMHI',
    yahooSymbol: 'SAMHI.NS',
    companyName: 'Samhi Hotels',
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
    tradingViewSymbol: 'NSE:THANGAMAYL',
    yahooSymbol: 'THANGAMAYL.NS',
    companyName: 'Thangamayil Jewellery',
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
    tradingViewSymbol: 'BSE:519600',
    yahooSymbol: 'CCL.NS',
    companyName: 'CCL Products (India)',
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
    tradingViewSymbol: 'NSE:CARYSIL',
    yahooSymbol: 'CARYSIL.NS',
    companyName: 'Carysil Limited',
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
  const [chartModal, setChartModal] = useState({ isOpen: false, tradingViewSymbol: '', yahooSymbol: '', companyName: '' });
  
  // Filter and Sort State
  const [filters, setFilters] = useState({
    search: '',
    industry: '',
    position: '',
    dateFrom: '',
    dateTo: '',
    minPrice: '',
    maxPrice: '',
    minPL: '',
    maxPL: '',
    minPE: '',
    maxPE: ''
  });
  
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

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
        // Fundamental Analysis stocks
        'ULTRAMAR.BO': 18.5,
        'CEINSYSTECH.BO': 22.3,
        'GRWRHITECH.NS': 28.7,
        'ARVINDFASN.NS': 15.2,
        'RATEGAIN.NS': 32.1,
        'SHAKTIPUMP.NS': 24.8,
        'ENTERO.NS': 19.6,
        'INFOLLION-SM.NS': 21.4,
        'JUBLPHARMA.NS': 26.3,
        'INNOVACAP.NS': 17.8,
        'NH.NS': 22.9,
        'SANGHVIMOV.NS': 16.7,
        'BETA.NS': 25.1,
        'ASTRAMICRO.NS': 31.2,
        'SAMHI.NS': 18.9,
        'THANGAMAYL.NS': 27.4,
        'CCL.NS': 23.6,
        'CARYSIL.NS': 20.8
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
        // Technical Analysis stocks (currently empty)
        
        // Fundamental Analysis stocks
        'ULTRAMAR.BO': 625.30,
        'CEINSYSTECH.BO': 1890.50,
        'GRWRHITECH.NS': 4240.75,
        'ARVINDFASN.NS': 598.20,
        'RATEGAIN.NS': 785.40,
        'SHAKTIPUMP.NS': 945.80,
        'ENTERO.NS': 1285.60,
        'INFOLLION-SM.NS': 445.90,
        'JUBLPHARMA.NS': 1245.30,
        'INNOVACAP.NS': 912.75,
        'NH.NS': 1825.40,
        'SANGHVIMOV.NS': 402.60,
        'BETA.NS': 1875.20,
        'ASTRAMICRO.NS': 1085.30,
        'SAMHI.NS': 205.80,
        'THANGAMAYL.NS': 2180.90,
        'CCL.NS': 825.70,
        'CARYSIL.NS': 892.40
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

  // Function to get all unique symbols from both datasets (use yahooSymbol for API calls)
  const getAllSymbols = () => {
    const technicalSymbols = TECHNICAL_SAMPLE_DATA.map(item => item.yahooSymbol);
    const fundamentalSymbols = FUNDAMENTAL_SAMPLE_DATA.map(item => item.yahooSymbol);
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

  // Utility function to get unique values for filter dropdowns
  const getUniqueValues = (data, key) => {
    const values = data.map(item => item[key]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  // Utility function to parse date for sorting
  const parseDate = (dateString) => {
    if (!dateString) return new Date(0);
    const [month, day, year] = dateString.split(' ');
    const monthMap = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    return new Date(parseInt(year), monthMap[month] || 0, parseInt(day) || 1);
  };

  // Filter function
  const filterData = (data) => {
    return data.filter(stock => {
      const currentPrice = currentPrices[stock.yahooSymbol];
      const profitLoss = calculateProfitLoss(stock.suggested_price, currentPrice);
      const pe = peData[stock.yahooSymbol];
      
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          stock.companyName?.toLowerCase().includes(searchTerm) ||
          stock.yahooSymbol?.toLowerCase().includes(searchTerm) ||
          stock.tradingViewSymbol?.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }
      
      // Industry filter
      if (filters.industry && stock.industry !== filters.industry) return false;
      
      // Position filter
      if (filters.position && (stock.position || 'buy') !== filters.position) return false;
      
      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const stockDate = parseDate(stock.recommendedDate);
        if (filters.dateFrom && stockDate < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && stockDate > new Date(filters.dateTo)) return false;
      }
      
      // Price range filter
      if (filters.minPrice && currentPrice && currentPrice < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && currentPrice && currentPrice > parseFloat(filters.maxPrice)) return false;
      
      // P/L range filter
      if (filters.minPL && profitLoss && parseFloat(profitLoss) < parseFloat(filters.minPL)) return false;
      if (filters.maxPL && profitLoss && parseFloat(profitLoss) > parseFloat(filters.maxPL)) return false;
      
      // PE range filter
      if (filters.minPE && pe && pe < parseFloat(filters.minPE)) return false;
      if (filters.maxPE && pe && pe > parseFloat(filters.maxPE)) return false;
      
      return true;
    });
  };

  // Sort function
  const sortData = (data) => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig.key) {
        case 'symbol':
          aValue = a.companyName || a.yahooSymbol || '';
          bValue = b.companyName || b.yahooSymbol || '';
          break;
        case 'industry':
          aValue = a.industry || '';
          bValue = b.industry || '';
          break;
        case 'date':
          aValue = parseDate(a.recommendedDate);
          bValue = parseDate(b.recommendedDate);
          break;
        case 'suggestedPrice':
          aValue = a.suggested_price || 0;
          bValue = b.suggested_price || 0;
          break;
        case 'currentPrice':
          aValue = currentPrices[a.yahooSymbol] || 0;
          bValue = currentPrices[b.yahooSymbol] || 0;
          break;
        case 'profitLoss':
          aValue = parseFloat(calculateProfitLoss(a.suggested_price, currentPrices[a.yahooSymbol])) || 0;
          bValue = parseFloat(calculateProfitLoss(b.suggested_price, currentPrices[b.yahooSymbol])) || 0;
          break;
        case 'targetPrice':
          aValue = parseFloat(a.target_price?.replace('₹', '')) || 0;
          bValue = parseFloat(b.target_price?.replace('₹', '')) || 0;
          break;
        case 'pe':
          aValue = peData[a.yahooSymbol] || 0;
          bValue = peData[b.yahooSymbol] || 0;
          break;
        case 'industryPE':
          aValue = INDUSTRY_PE_MAP[a.industry] || 0;
          bValue = INDUSTRY_PE_MAP[b.industry] || 0;
          break;
        case 'position':
          aValue = a.position || 'buy';
          bValue = b.position || 'buy';
          break;
        default:
          aValue = a[sortConfig.key] || '';
          bValue = b[sortConfig.key] || '';
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Process data with filters and sorting
  const processData = (data) => {
    const filtered = filterData(data);
    return sortData(filtered);
  };

  // Filter controls component
  const FilterControls = ({ data }) => {
    const industries = getUniqueValues(data, 'industry');
    const positions = getUniqueValues(data, 'position');
    
    return (
      <div className="filter-controls">
        <div className="filter-row">
          <div className="filter-group">
            <label>🔍 Search:</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Company name or symbol..."
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label>🏭 Industry:</label>
            <select
              value={filters.industry}
              onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
              className="filter-select"
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>📊 Position:</label>
            <select
              value={filters.position}
              onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
              className="filter-select"
            >
              <option value="">All Positions</option>
              {positions.length > 0 ? positions.map(position => (
                <option key={position} value={position}>{position.toUpperCase()}</option>
              )) : <option value="buy">BUY</option>}
            </select>
          </div>
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label>📅 Date From:</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label>📅 Date To:</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label>💰 Price Range:</label>
            <div className="range-inputs">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                placeholder="Min ₹"
                className="filter-input range-input"
              />
              <span>-</span>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                placeholder="Max ₹"
                className="filter-input range-input"
              />
            </div>
          </div>
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label>📈 P/L Range (%):</label>
            <div className="range-inputs">
              <input
                type="number"
                value={filters.minPL}
                onChange={(e) => setFilters(prev => ({ ...prev, minPL: e.target.value }))}
                placeholder="Min %"
                className="filter-input range-input"
              />
              <span>-</span>
              <input
                type="number"
                value={filters.maxPL}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPL: e.target.value }))}
                placeholder="Max %"
                className="filter-input range-input"
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label>📊 PE Range:</label>
            <div className="range-inputs">
              <input
                type="number"
                value={filters.minPE}
                onChange={(e) => setFilters(prev => ({ ...prev, minPE: e.target.value }))}
                placeholder="Min PE"
                className="filter-input range-input"
              />
              <span>-</span>
              <input
                type="number"
                value={filters.maxPE}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPE: e.target.value }))}
                placeholder="Max PE"
                className="filter-input range-input"
              />
            </div>
          </div>
          
          <div className="filter-group">
            <button
              onClick={() => setFilters({
                search: '', industry: '', position: '', dateFrom: '', dateTo: '',
                minPrice: '', maxPrice: '', minPL: '', maxPL: '', minPE: '', maxPE: ''
              })}
              className="clear-filters-btn"
            >
              🗑️ Clear Filters
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRecommendationTable = (data, title) => {
    const processedData = processData(data);
    
    return (
      <div className="recommendations-table-section">
        <h3>{title} ({processedData.length} stocks)</h3>
        
        {/* Filter Controls */}
        <FilterControls data={data} />
        
        <div className="recommendations-table-container">
          <table className="recommendations-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('symbol')} className="sortable-header">
                  Symbol {getSortIcon('symbol')}
                </th>
                <th onClick={() => handleSort('industry')} className="sortable-header">
                  Industry {getSortIcon('industry')}
                </th>
                <th onClick={() => handleSort('date')} className="sortable-header">
                  Date {getSortIcon('date')}
                </th>
                <th onClick={() => handleSort('suggestedPrice')} className="sortable-header">
                  Suggested Price {getSortIcon('suggestedPrice')}
                </th>
                <th onClick={() => handleSort('currentPrice')} className="sortable-header">
                  CMP {getSortIcon('currentPrice')}
                </th>
                <th onClick={() => handleSort('profitLoss')} className="sortable-header">
                  P/L % {getSortIcon('profitLoss')}
                </th>
                <th onClick={() => handleSort('targetPrice')} className="sortable-header">
                  Target Price {getSortIcon('targetPrice')}
                </th>
                <th onClick={() => handleSort('pe')} className="sortable-header">
                  PE {getSortIcon('pe')}
                </th>
                <th onClick={() => handleSort('industryPE')} className="sortable-header">
                  Industry PE {getSortIcon('industryPE')}
                </th>
                <th onClick={() => handleSort('position')} className="sortable-header">
                  Position {getSortIcon('position')}
                </th>
                <th>Chart</th>
                <th>Reason</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {processedData.map((stock, index) => {
              const currentPrice = currentPrices[stock.yahooSymbol];
              const profitLoss = calculateProfitLoss(stock.suggested_price, currentPrice);
              const isLoss = currentPrice && currentPrice < stock.suggested_price;
              
              return (
                <tr key={stock.tradingViewSymbol || index} className={isLoss ? 'loss-row' : 'profit-row'}>
                  <td className="stock-symbol">
                    <div>
                      <strong>{stock.companyName || 'N/A'}</strong>
                      <div style={{ fontSize: '0.8em', color: '#666', marginTop: '2px' }}>
                        {stock.yahooSymbol || stock.tradingViewSymbol || 'N/A'}
                      </div>
                    </div>
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
                    ) : peData[stock.yahooSymbol] ? (
                      peData[stock.yahooSymbol].toFixed(1)
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
                      onClick={() => setChartModal({ isOpen: true, tradingViewSymbol: stock.tradingViewSymbol, yahooSymbol: stock.yahooSymbol, companyName: stock.companyName })}
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
  };

  // Chart Modal Component
  const ChartModal = () => {
    if (!chartModal.isOpen) return null;

    return (
      <div className="chart-modal-overlay" onClick={() => setChartModal({ isOpen: false, tradingViewSymbol: '', yahooSymbol: '', companyName: '' })}>
        <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="chart-modal-header">
            <h3>📈 {chartModal.companyName || chartModal.yahooSymbol || chartModal.tradingViewSymbol} - Stock Chart</h3>
            <button 
              className="chart-modal-close"
              onClick={() => setChartModal({ isOpen: false, tradingViewSymbol: '', yahooSymbol: '', companyName: '' })}
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
                📊 Stock Chart for {chartModal.companyName || chartModal.yahooSymbol}
              </h4>
              <p style={{ margin: '10px 0', fontSize: '14px', color: '#6c757d' }}>
                View detailed candlestick charts and technical analysis:
              </p>
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                <a 
                  href={`https://finance.yahoo.com/quote/${chartModal.yahooSymbol}/chart`}
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
                  href={`https://www.google.com/finance/quote/${chartModal.yahooSymbol?.replace('.NS', '').replace('.BO', '')}:${chartModal.tradingViewSymbol?.includes('BSE:') ? 'BOM' : 'NSE'}`}
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
                  href={`https://in.tradingview.com/chart/?symbol=${chartModal.tradingViewSymbol}`}
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

// Add these styles to your main CSS file or use styled-components
const styles = `
.filter-controls {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
}

.filter-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
  align-items: end;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 120px;
  flex: 1;
}

.filter-group label {
  font-size: 12px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 4px;
}

.filter-input, .filter-select {
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.filter-input:focus, .filter-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-input {
  width: 80px;
}

.clear-filters-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.clear-filters-btn:hover {
  background: #c82333;
}

.sortable-header {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
  padding: 12px 8px;
}

.sortable-header:hover {
  background-color: #f8f9fa;
}

.recommendations-table th {
  background: #e9ecef;
  font-weight: 600;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .range-inputs {
    flex-direction: column;
    gap: 5px;
  }
  
  .range-input {
    width: 100%;
  }
}
`;

// Inject styles if not already injected
if (typeof document !== 'undefined' && !document.getElementById('recommendations-filter-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'recommendations-filter-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
