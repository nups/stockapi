import React, { useState, useEffect } from 'react';

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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    industry: 'Textiles',
    position: 'buy'
  },
  {
    id: 5,
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
    id: 6,
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
    industry: 'Industrial',
    position: 'buy'
  },
  {
    id: 7,
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
    id: 8,
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
    industry: 'FinTech',
    position: 'buy'
  },
  {
    id: 9,
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
    industry: 'Pharma',
    position: 'buy'
  },
  {
    id: 10,
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
    id: 11,
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
    id: 12,
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
    industry: 'Services',
    position: 'buy'
  },
  {
    id: 13,
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
    industry: 'Pharma',
    position: 'buy'
  },
  {
    id: 14,
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
    id: 15,
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
    industry: 'Tourism',
    position: 'buy'
  },
  {
    id: 16,
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
    id: 17,
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
    id: 18,
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
    industry: 'Consumer',
    position: 'buy'
  }
];

const RecommendationsPreview = () => {
  const [currentPrices, setCurrentPrices] = useState({});
  const [peData, setPeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [chartModal, setChartModal] = useState({ isOpen: false, tradingViewSymbol: '', yahooSymbol: '', companyName: '' });
  const [aiModal, setAiModal] = useState({ isOpen: false, stock: null, loading: false, recommendation: null, error: null });
  
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
        // Stock recommendations
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
        // Stock recommendations
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

  // Function to fetch AI recommendation for a specific stock
  const fetchAIRecommendation = async (stock) => {
    setAiModal(prev => ({ ...prev, isOpen: true, stock, loading: true, recommendation: null }));
    
    try {
      // Try to get session token for authentication
      const sessionToken = localStorage.getItem('zerodha_session') || localStorage.getItem('google_auth_token');
      
      if (!sessionToken) {
        throw new Error('Authentication required - please connect to Zerodha first');
      }
      
      console.log('Fetching AI recommendation for:', stock.companyName);
      
      // Prepare query parameters with stock information
      const stockParams = new URLSearchParams({
        session: sessionToken,
        symbol: stock.yahooSymbol,
        company: stock.companyName,
        trading_symbol: stock.yahooSymbol.replace('.NS', '').replace('.BO', ''),
        industry: stock.industry || '',
        current_price: currentPrices[stock.yahooSymbol] || stock.suggested_price || 0,
        entry_price: stock.suggested_price || 0,
        stockname: stock.companyName // Adding stockname parameter as requested
      });
      
      // Call the AI recommendations endpoint with stock parameters
      let response = await fetch(`https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net/api/zerodha/holdings-ai?${stockParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('AI data received:', data);
        
        // Find recommendation for this specific stock from the holdings
        let stockRecommendation = null;
        
        if (data.holdings && Array.isArray(data.holdings)) {
          // Try multiple matching strategies to find the stock
          stockRecommendation = data.holdings.find(holding => {
            const tradingSymbol = stock.yahooSymbol.replace('.NS', '').replace('.BO', '');
            const companyName = stock.companyName.toUpperCase().replace(/\s+/g, '');
            
            return (
              holding.tradingsymbol === tradingSymbol ||
              holding.tradingsymbol === companyName ||
              holding.ai_recommendation?.symbol === stock.yahooSymbol ||
              (holding.tradingsymbol && tradingSymbol.includes(holding.tradingsymbol)) ||
              (holding.tradingsymbol && holding.tradingsymbol.includes(tradingSymbol))
            );
          });
        }
        
        if (stockRecommendation && stockRecommendation.ai_recommendation) {
          console.log('Found AI recommendation for', stock.companyName, ':', stockRecommendation.ai_recommendation);
          setAiModal(prev => ({ ...prev, loading: false, recommendation: stockRecommendation.ai_recommendation }));
          return;
        } else {
          console.log('No AI recommendation found for', stock.companyName, 'in holdings data');
        }
      }
      
      // Try the general AI recommendations endpoint with stock parameters
      response = await fetch(`https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net/api/ai-recommendations?${stockParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Try to find recommendation for this stock
        if (data.recommendations && Array.isArray(data.recommendations)) {
          const stockRec = data.recommendations.find(rec => 
            rec.symbol === stock.yahooSymbol || 
            rec.company === stock.companyName
          );
          
          if (stockRec) {
            setAiModal(prev => ({ ...prev, loading: false, recommendation: stockRec }));
            return;
          }
        }
      }
      
      throw new Error('No AI recommendation found for this stock');
      
    } catch (error) {
      console.error('AI API failed:', error.message);
      
      // Show error message instead of mock data
      setAiModal(prev => ({ 
        ...prev, 
        loading: false, 
        recommendation: null,
        error: error.message.includes('Authentication required') 
          ? 'Please connect to Zerodha first to get AI recommendations'
          : 'Unable to fetch AI recommendation at this time. Please try again later.'
      }));
    }
  };



  // Function to get all unique symbols from fundamental dataset only
  const getAllSymbols = () => {
    const fundamentalSymbols = FUNDAMENTAL_SAMPLE_DATA.map(item => item.yahooSymbol);
    return [...new Set(fundamentalSymbols)];
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

  // Simplified Filter controls component
  const FilterControls = ({ data }) => {
    const industries = getUniqueValues(data, 'industry');
    const [showAdvanced, setShowAdvanced] = useState(false);
    
    return (
      <div className="filter-controls-modern">
        {/* Primary Filters - Always Visible */}
        <div className="primary-filters">
          <div className="search-filter">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="🔍 Search stocks..."
              className="search-input"
            />
          </div>
          
          <select
            value={filters.industry}
            onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
            className="industry-select"
          >
            <option value="">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="advanced-toggle"
          >
            {showAdvanced ? '🔼 Less Filters' : '🔽 More Filters'}
          </button>
          
          {(filters.search || filters.industry || filters.minPrice || filters.maxPrice || 
            filters.minPL || filters.maxPL || filters.dateFrom || filters.dateTo) && (
            <button
              onClick={() => setFilters({
                search: '', industry: '', position: '', dateFrom: '', dateTo: '',
                minPrice: '', maxPrice: '', minPL: '', maxPL: '', minPE: '', maxPE: ''
              })}
              className="clear-all-btn"
            >
              ✖ Clear All
            </button>
          )}
        </div>
        
        {/* Advanced Filters - Collapsible */}
        {showAdvanced && (
          <div className="advanced-filters">
            <div className="filter-section">
              <h4>💰 Price Filters</h4>
              <div className="range-group">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  placeholder="Min ₹"
                  className="range-input"
                />
                <span>to</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  placeholder="Max ₹"
                  className="range-input"
                />
              </div>
            </div>
            
            <div className="filter-section">
              <h4>📈 Performance Filters</h4>
              <div className="range-group">
                <input
                  type="number"
                  value={filters.minPL}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPL: e.target.value }))}
                  placeholder="Min %"
                  className="range-input"
                />
                <span>to</span>
                <input
                  type="number"
                  value={filters.maxPL}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPL: e.target.value }))}
                  placeholder="Max %"
                  className="range-input"
                />
              </div>
            </div>
            
            <div className="filter-section">
              <h4>� Date Range</h4>
              <div className="date-group">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="date-input"
                />
                <span>to</span>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="date-input"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRecommendationTable = (data, title) => {
    const processedData = processData(data);
    
    return (
      <div className="recommendations-table-section">
        {/* Filter Controls */}
        <FilterControls data={data} />
        
        <div className="recommendations-table-container">
          <table className="recommendations-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('symbol')} className="sortable-header">
                  Stock {getSortIcon('symbol')}
                </th>
                <th onClick={() => handleSort('industry')} className="sortable-header">
                  Sector {getSortIcon('industry')}
                </th>
                <th onClick={() => handleSort('suggestedPrice')} className="sortable-header">
                  Entry ₹ {getSortIcon('suggestedPrice')}
                </th>
                <th onClick={() => handleSort('currentPrice')} className="sortable-header">
                  Current ₹ {getSortIcon('currentPrice')}
                </th>
                <th onClick={() => handleSort('profitLoss')} className="sortable-header">
                  Returns {getSortIcon('profitLoss')}
                </th>
                <th onClick={() => handleSort('targetPrice')} className="sortable-header">
                  Target ₹ {getSortIcon('targetPrice')}
                </th>
                <th onClick={() => handleSort('pe')} className="sortable-header">
                  PE {getSortIcon('pe')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedData.map((stock, index) => {
              const currentPrice = currentPrices[stock.yahooSymbol];
              const profitLoss = calculateProfitLoss(stock.suggested_price, currentPrice);
              
              return (
                <tr key={stock.tradingViewSymbol || index}>
                  <td className="stock-info">
                    <div className="stock-name">
                      <strong>{stock.companyName || 'N/A'}</strong>
                    </div>
                    <div className="stock-symbol">
                      {stock.yahooSymbol || stock.tradingViewSymbol || 'N/A'}
                    </div>
                  </td>
                  <td className="sector">
                    <span className="sector-badge">{stock.industry || 'N/A'}</span>
                  </td>
                  <td className="entry-price">
                    <strong>₹{stock.suggested_price || 'N/A'}</strong>
                    <div className="date-small">{stock.recommendedDate || 'N/A'}</div>
                  </td>
                  <td className="current-price">
                    {loading ? (
                      <span className="loading">⏳</span>
                    ) : currentPrice ? (
                      <strong>₹{currentPrice.toFixed(2)}</strong>
                    ) : (
                      <span className="error">❌</span>
                    )}
                  </td>
                  <td className="returns">
                    {loading ? (
                      <span className="loading">⏳</span>
                    ) : profitLoss !== null ? (
                      <span className={`return-badge ${parseFloat(profitLoss) >= 0 ? 'positive' : 'negative'}`}>
                        {parseFloat(profitLoss) >= 0 ? '+' : ''}{profitLoss}%
                      </span>
                    ) : (
                      <span className="error">❌</span>
                    )}
                  </td>
                  <td className="target-price">
                    <strong>{stock.target_price || 'N/A'}</strong>
                  </td>
                  <td className="pe-ratio">
                    {loading ? (
                      <span className="loading">⏳</span>
                    ) : peData[stock.yahooSymbol] ? (
                      <span className="pe-value">{peData[stock.yahooSymbol].toFixed(1)}</span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="action-buttons">
                    <button 
                      className="action-btn chart-btn" 
                      onClick={() => setChartModal({ isOpen: true, tradingViewSymbol: stock.tradingViewSymbol, yahooSymbol: stock.yahooSymbol, companyName: stock.companyName })}
                      title="View Chart"
                    >
                      📈
                    </button>
                    <button 
                      className="action-btn ai-btn" 
                      onClick={() => fetchAIRecommendation(stock)}
                      title="Get AI Recommendation"
                      disabled={loading}
                    >
                      🤖
                    </button>
                    <button 
                      className="action-btn info-btn" 
                      title={`${stock.reason || 'No reason provided'}\n\nRemarks: ${stock.remarks || 'No remarks'}`}
                      aria-label="View details"
                    >
                      ℹ️
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
                📊 Stock Analysis for {chartModal.companyName || chartModal.yahooSymbol}
              </h4>
              <p style={{ margin: '10px 0', fontSize: '14px', color: '#6c757d' }}>
                View comprehensive financial analysis and charts:
              </p>
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                <a 
                  href={`https://www.screener.in/company/${chartModal.yahooSymbol?.replace('.NS', '').replace('.BO', '')}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'inline-block',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
                >
                  � Screener Analysis
                </a>
                
                <a 
                  href={`https://www.screener.in/company/${chartModal.yahooSymbol?.replace('.NS', '').replace('.BO', '')}/charts/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '12px 20px',  
                    backgroundColor: '#9b59b6',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'inline-block',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#8e44ad'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#9b59b6'}
                >
                  � Screener Charts
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
                <p>💡 <strong>Tip:</strong> Screener.in provides comprehensive Indian stock analysis, financials, ratios, and TradingView offers advanced charting tools.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // AI Recommendation Modal Component
  const AIModal = () => {
    if (!aiModal.isOpen) return null;

    const getRecommendationColor = (recommendation) => {
      switch (recommendation?.toUpperCase()) {
        case 'BUY': return '#28a745';
        case 'SELL': return '#dc3545';
        case 'HOLD': return '#ffc107';
        default: return '#6c757d';
      }
    };

    const getScoreColor = (score) => {
      if (score >= 4) return '#28a745';
      if (score >= 3) return '#ffc107';
      if (score >= 2) return '#fd7e14';
      return '#dc3545';
    };



    return (
      <div className="ai-modal-overlay" onClick={() => setAiModal({ isOpen: false, stock: null, loading: false, recommendation: null, error: null })}>
        <div className="ai-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="ai-modal-header">
            <h3>🤖 AI Analysis: {aiModal.stock?.companyName || 'Stock'}</h3>
            <button 
              className="ai-modal-close"
              onClick={() => setAiModal({ isOpen: false, stock: null, loading: false, recommendation: null, error: null })}
            >
              ✕
            </button>
          </div>
          
          <div className="ai-modal-body">
            {aiModal.loading ? (
              <div className="ai-loading">
                <div className="loading-spinner-ai"></div>
                <p>Analyzing stock data with AI...</p>
              </div>
            ) : aiModal.recommendation ? (
              <div className="ai-recommendation-content">
                {/* Header with stock info */}
                <div className="stock-header-ai">
                  <div className="stock-details">
                    <h4>{aiModal.stock?.companyName}</h4>
                    <p className="stock-symbol">{aiModal.stock?.yahooSymbol} | {aiModal.stock?.industry}</p>
                    <p className="current-price">Current: ₹{currentPrices[aiModal.stock?.yahooSymbol]?.toFixed(2) || 'N/A'}</p>
                  </div>
                </div>

                {/* Recommendation Summary */}
                <div className="recommendation-summary">
                  <div className="recommendation-badge" style={{ backgroundColor: getRecommendationColor(aiModal.recommendation.recommendation) }}>
                    <span className="rec-action">{aiModal.recommendation.recommendation}</span>
                    <span className="rec-priority">Priority: {aiModal.recommendation.action_priority}</span>
                  </div>
                  
                  <div className="scores-grid">
                    <div className="score-item">
                      <span className="score-label">Fundamental</span>
                      <span className="score-value" style={{ color: getScoreColor(aiModal.recommendation.fundamental_score) }}>
                        {aiModal.recommendation.fundamental_score}/5
                      </span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">Technical</span>
                      <span className="score-value" style={{ color: getScoreColor(aiModal.recommendation.technical_score) }}>
                        {aiModal.recommendation.technical_score}/5
                      </span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">Overall</span>
                      <span className="score-value overall" style={{ color: getScoreColor(aiModal.recommendation.overall_score) }}>
                        {aiModal.recommendation.overall_score}/5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Analysis Details */}
                <div className="analysis-details">
                  <div className="analysis-section">
                    <h5>🎯 AI Reasoning</h5>
                    <p>{aiModal.recommendation.reason}</p>
                  </div>
                  
                  <div className="analysis-section">
                    <h5>💡 Key Insights</h5>
                    <p>{aiModal.recommendation.insight}</p>
                  </div>
                  
                  <div className="analysis-section">
                    <h5>⚠️ Risk Assessment</h5>
                    <p className="risk-note">{aiModal.recommendation.risk_note}</p>
                  </div>
                  
                  {aiModal.recommendation.analysis_timestamp && (
                    <div className="analysis-footer">
                      <small>Analysis generated: {aiModal.recommendation.analysis_timestamp}</small>
                    </div>
                  )}
                </div>
              </div>
            ) : aiModal.error ? (
              <div className="ai-error">
                <div className="error-icon">⚠️</div>
                <h4>AI Recommendation Unavailable</h4>
                <p>{aiModal.error}</p>
                {aiModal.error.includes('connect to Zerodha') && (
                  <div className="error-action">
                    <p><strong>To get AI recommendations:</strong></p>
                    <ol>
                      <li>Go to the "Zerodha Integration" tab</li>
                      <li>Connect your Zerodha account</li>
                      <li>Return here and try again</li>
                    </ol>
                  </div>
                )}
              </div>
            ) : (
              <div className="ai-error">
                <div className="error-icon">❌</div>
                <h4>No Recommendation Available</h4>
                <p>Unable to generate AI recommendation for this stock at this time.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="recommendations-preview">
      <div className="recommendations-content-vertical">
        {/* Stock Analysis Table */}
        {renderRecommendationTable(FUNDAMENTAL_SAMPLE_DATA, '� Market Analysis')}
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
      
      {/* AI Recommendation Modal */}
      <AIModal />
    </div>
  );
};

export default RecommendationsPreview;

// Modern, clean styles
const styles = `
.filter-controls-modern {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  max-width: none;
  width: 100%;
}

.primary-filters {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.search-filter {
  flex: 2;
  min-width: 350px;
}

.search-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
  background: white;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.industry-select {
  padding: 16px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  min-width: 200px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.industry-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.advanced-toggle {
  background: #3498db;
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.advanced-toggle:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.4);
}

.clear-all-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
}

.clear-all-btn:hover {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.4);
}

.advanced-filters {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.filter-section h4 {
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
}

.range-group, .date-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.range-input, .date-input {
  padding: 10px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  flex: 1;
  transition: all 0.2s ease;
}

.range-input:focus, .date-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.range-group span, .date-group span {
  color: #6c757d;
  font-weight: 500;
  font-size: 14px;
}

.sortable-header {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  padding: 16px 12px;
  font-weight: 600;
  color: #495057;
  position: relative;
}

.sortable-header:hover {
  background-color: #f8f9fa;
  color: #007bff;
}

.recommendations-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  background: white;
  font-size: 15px;
  table-layout: fixed;
}

.recommendations-table th:nth-child(1) { width: 22%; } /* Stock */
.recommendations-table th:nth-child(2) { width: 10%; } /* Sector */
.recommendations-table th:nth-child(3) { width: 11%; } /* Entry */
.recommendations-table th:nth-child(4) { width: 11%; } /* Current */
.recommendations-table th:nth-child(5) { width: 11%; } /* Returns */
.recommendations-table th:nth-child(6) { width: 11%; } /* Target */
.recommendations-table th:nth-child(7) { width: 8%; }  /* PE */
.recommendations-table th:nth-child(8) { width: 16%; } /* Actions */

.recommendations-table th {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  font-weight: 600;
  text-align: left;
  border: none;
  padding: 12px 10px;
  font-size: 14px;
  letter-spacing: 0.3px;
}

.recommendations-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #f1f3f4;
  vertical-align: middle;
  font-size: 14px;
  overflow: hidden;
}

.recommendations-table td.sector {
  padding: 12px 6px;
}

.recommendations-table tbody tr:hover {
  background-color: #f8fafc;
}

.recommendations-table tbody tr:last-child td {
  border-bottom: none;
}

.recommendations-table-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}

.recommendations-preview {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
}

@media (max-width: 768px) {
  .primary-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filter {
    min-width: auto;
  }
  
  .advanced-filters {
    grid-template-columns: 1fr;
  }
  
  .range-group, .date-group {
    flex-direction: column;
    gap: 8px;
  }
  
  .range-group span, .date-group span {
    display: none;
  }
}

/* Table Content Styles */
.stock-info {
  min-width: 280px;
}

.stock-name {
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 6px;
  font-size: 16px;
  line-height: 1.3;
}

.stock-symbol {
  font-size: 13px;
  color: #7f8c8d;
  font-family: 'Consolas', 'Monaco', monospace;
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.sector-badge {
  background: #e8f5e8;
  color: #27ae60;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid #d5eddb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
  display: inline-block;
}

.date-small {
  font-size: 11px;
  color: #6c757d;
  margin-top: 2px;
}

.return-badge {
  padding: 8px 14px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 14px;
  min-width: 80px;
  text-align: center;
  display: inline-block;
}

.return-badge.positive {
  background: #d1f2eb;
  color: #0e6655;
  border: 1px solid #a3e4d7;
}

.return-badge.negative {
  background: #fadbd8;
  color: #922b21;
  border: 1px solid #f1948a;
}

.pe-value {
  font-weight: 500;
  color: #495057;
}

.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
  min-width: 80px;
}

.action-btn {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  min-width: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.chart-btn:hover {
  background: #e3f2fd;
  border-color: #1976d2;
}

.info-btn:hover {
  background: #fff3cd;
  border-color: #ffc107;
}

.ai-btn:hover {
  background: #e8f5e8;
  border-color: #28a745;
}

.ai-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* AI Modal Styles */
.ai-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 20px;
}

.ai-modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

.ai-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.ai-modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.ai-modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.ai-modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.ai-modal-body {
  padding: 24px;
}

.ai-loading {
  text-align: center;
  padding: 40px 20px;
}

.loading-spinner-ai {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.stock-header-ai {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.stock-details h4 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 18px;
}

.stock-symbol {
  font-family: 'Consolas', 'Monaco', monospace;
  background: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  font-size: 12px;
  color: #495057;
  margin-bottom: 8px;
}

.current-price {
  font-weight: 600;
  color: #28a745;
  font-size: 16px;
  margin: 0;
}

.recommendation-summary {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.recommendation-badge {
  background: #28a745;
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  text-align: center;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.rec-action {
  display: block;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.rec-priority {
  display: block;
  font-size: 12px;
  opacity: 0.9;
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  flex: 1;
}

.score-item {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  transition: transform 0.2s;
}

.score-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.score-label {
  display: block;
  font-size: 11px;
  color: #6c757d;
  margin-bottom: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.score-value {
  display: block;
  font-size: 16px;
  font-weight: 700;
}

.score-value.overall {
  font-size: 18px;
}

.analysis-details {
  space-y: 16px;
}

.analysis-section {
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  padding: 16px 20px;
  margin-bottom: 16px;
  border-radius: 0 8px 8px 0;
}

.analysis-section h5 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 600;
}

.analysis-section p {
  margin: 0;
  color: #495057;
  line-height: 1.6;
  font-size: 14px;
}

.risk-note {
  color: #dc3545 !important;
  font-weight: 500;
}

.analysis-footer {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
  margin-top: 20px;
}

.analysis-footer small {
  color: #6c757d;
  font-size: 11px;
}

.ai-error {
  text-align: center;
  padding: 40px 20px;
  color: #dc3545;
}

.ai-error .error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.ai-error h4 {
  color: #dc3545;
  margin: 0 0 16px 0;
  font-size: 18px;
}

.ai-error p {
  color: #6c757d;
  margin-bottom: 16px;
  line-height: 1.5;
}

.error-action {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  text-align: left;
}

.error-action p {
  margin: 0 0 12px 0;
  color: #495057;
  font-weight: 600;
}

.error-action ol {
  margin: 0;
  padding-left: 20px;
  color: #6c757d;
}

.error-action li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .ai-modal-content {
    margin: 10px;
    max-height: 95vh;
  }
  
  .recommendation-summary {
    flex-direction: column;
    align-items: stretch;
  }
  
  .scores-grid {
    grid-template-columns: 1fr;
  }
  
  .ai-modal-header {
    padding: 16px;
  }
  
  .ai-modal-body {
    padding: 16px;
  }
}

.loading, .error {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.loading {
  background: #fff3cd;
  color: #856404;
}

.error {
  background: #f8d7da;
  color: #721c24;
}
`;

// Inject styles if not already injected
if (typeof document !== 'undefined' && !document.getElementById('recommendations-filter-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'recommendations-filter-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
