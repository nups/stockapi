  // Add this at the beginning of the script to ensure tables initialize correctly
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM fully loaded - performing initial check');
    
    // No need to check for table structures as we're removing that functionality
  });

  // Zerodha Session Token Management
console.log('🚀 app.js loading');

class ZerodhaAuth {
  constructor() {
    this.sessionToken = null;
    this.baseUrl = 'https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net';
    this.init();
  }

  init() {
    // Check for session token in URL (after OAuth redirect)
    this.checkForSessionToken();
    
    // Load existing session from localStorage
    this.loadStoredSession();
    
    // Setup UI event listeners
    this.setupEventListeners();
    
    // Update UI based on session status
    this.updateUI();
  }

  checkForSessionToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionToken = urlParams.get('session');
    
    if (sessionToken) {
      console.log('Session token found in URL:', sessionToken);
      this.sessionToken = sessionToken;
      localStorage.setItem('zerodha_session', sessionToken);
      
      // Clean up URL by removing session parameter
      const url = new URL(window.location);
      url.searchParams.delete('session');
      window.history.replaceState({}, document.title, url);
      
      // Show success message
      this.showMessage('Zerodha authentication successful!', 'success');
    }
  }

  loadStoredSession() {
    const storedSession = localStorage.getItem('zerodha_session');
    if (storedSession) {
      this.sessionToken = storedSession;
      console.log('Loaded stored session token');
    }
  }

  setupEventListeners() {
    console.log('Setting up Zerodha event listeners...');
    
    const connectBtn = document.getElementById('connect-zerodha-btn');
    const fetchBtn = document.getElementById('fetch-zerodha-holdings-btn');
    const aiBtn = document.getElementById('ai-recommendation-btn');
    const testBtn = document.getElementById('test-table-btn');

    console.log('Found buttons:', {
      connectBtn: !!connectBtn,
      fetchBtn: !!fetchBtn, 
      aiBtn: !!aiBtn,
      testBtn: !!testBtn
    });

    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        console.log('Connect button clicked!');
        this.initiateLogin();
      });
      console.log('Connect button listener added');
    }

    if (fetchBtn) {
      fetchBtn.addEventListener('click', async () => {
        console.log('Fetch button clicked!');
        await this.fetchHoldings();
      });
      console.log('Fetch button listener added');
    }

    if (aiBtn) {
      aiBtn.addEventListener('click', async () => {
        console.log('AI button clicked!');
        await this.fetchAIRecommendations();
      });
      console.log('AI button listener added');
    }

    if (testBtn) {
      testBtn.addEventListener('click', () => {
        console.log('Test button clicked!');
        this.showTestTable();
      });
      console.log('Test button listener added');
    }
  }

  initiateLogin() {
    // Clear any existing session
    this.clearSession();
    
    // Redirect to backend Zerodha login endpoint
    window.location.href = `${this.baseUrl}/api/zerodha/auth/login`;
  }

  async fetchHoldings() {
    const holdingsContainer = document.getElementById('zerodha-holdings-container');
    
    if (!holdingsContainer) {
      console.error('Holdings container not found');
      return;
    }

    if (!this.sessionToken) {
      holdingsContainer.innerHTML = '<p style="padding: 15px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px;">Please connect to Zerodha first.</p>';
      return;
    }

    holdingsContainer.innerHTML = 'Loading Zerodha holdings...';
    
    try {
      const response = await fetch(`${this.baseUrl}/api/zerodha/holdings?session=${this.sessionToken}`);
      
      if (response.status === 401) {
        // Session expired or invalid
        this.handleSessionExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const holdings = await response.json();

      if (!holdings || !Array.isArray(holdings) || holdings.length === 0) {
        holdingsContainer.innerHTML = '<p style="padding: 15px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px;">No holdings found.</p>';
        return;
      }

      // Display information about holdings without using a table
      holdingsContainer.innerHTML = '<div style="padding: 15px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px;">' +
        '<h4 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">📊 Your Holdings</h4>' +
        '<p>The holdings table feature has been removed.</p>' +
        '<p>You have ' + holdings.length + ' holdings in your Zerodha account.</p>' +
        '</div>';

      this.showMessage('Holdings information retrieved successfully!', 'success');

    } catch (error) {
      console.error('Error fetching holdings:', error);
      holdingsContainer.innerHTML = '<p style="padding: 15px; background-color: #fff0f0; border: 1px solid #ffcccc; border-radius: 8px; color: #cc0000;">Failed to fetch holdings. Please try again.</p>';
      this.showMessage('Failed to fetch holdings', 'error');
    }
  }

  initializeHoldingsTable() {
    console.log('🔧 Holdings table functionality has been removed');
    return null;
  }

  populateHoldingsTable(holdings) {
    console.log('Holdings table functionality has been removed');
    // Display a message to the user instead
    const holdingsContainer = document.getElementById('zerodha-holdings-container');
    if (holdingsContainer) {
      holdingsContainer.innerHTML = '<p style="padding: 15px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px;">The holdings table feature has been removed.</p>';
    }
  }

  actuallyPopulateTable(tableBody, holdings) {
    console.log('Holdings table functionality has been removed');
    // This method is now a stub since we've removed the table functionality
  }

  updateHoldingsSummary(totalValue, totalPnL) {
    const totalValueElement = document.getElementById('total-portfolio-value');
    const totalPnLElement = document.getElementById('total-pnl');

    if (totalValueElement) {
      totalValueElement.textContent = `₹${totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (totalPnLElement) {
      const pnlColor = totalPnL >= 0 ? '#28a745' : '#dc3545';
      totalPnLElement.textContent = `₹${totalPnL.toFixed(2)}`;
      totalPnLElement.style.color = pnlColor;
    }
  }

  getCompanyName(symbol) {
    // Basic mapping of some common symbols to company names
    const symbolMap = {
      'RELIANCE': 'Reliance Industries',
      'TCS': 'Tata Consultancy Services',
      'INFY': 'Infosys Limited',
      'HDFCBANK': 'HDFC Bank',
      'ICICIBANK': 'ICICI Bank',
      'SBIN': 'State Bank of India',
      'BHARTIARTL': 'Bharti Airtel',
      'ITC': 'ITC Limited',
      'KOTAKBANK': 'Kotak Mahindra Bank',
      'LT': 'Larsen & Toubro',
      'AXISBANK': 'Axis Bank',
      'MARUTI': 'Maruti Suzuki',
      'ASIANPAINT': 'Asian Paints',
      'TITAN': 'Titan Company',
      'ULTRACEMCO': 'UltraTech Cement'
    };

    return symbolMap[symbol] || symbol;
  }

  showTestTable() {
    console.log('Test table functionality has been removed');
    // Show a message to the user
    const holdingsContainer = document.getElementById('zerodha-holdings-container');
    if (holdingsContainer) {
      holdingsContainer.innerHTML = '<p style="padding: 15px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px;">The holdings table feature has been removed.</p>';
      
      // Make sure the container is visible
      holdingsContainer.style.visibility = 'visible';
      holdingsContainer.style.height = 'auto';
      holdingsContainer.style.opacity = '1';
    }
    
    this.showMessage('Holdings table feature has been removed.', 'info');
  }

  async fetchAIRecommendations() {
    const aiContainer = document.getElementById('ai-recommendations-container');
    const aiContent = document.getElementById('ai-recommendations-content');
    
    if (!aiContainer || !aiContent) {
      console.error('AI recommendations container not found');
      return;
    }

    if (!this.sessionToken) {
      aiContent.textContent = 'Please connect to Zerodha first to get AI recommendations.';
      // Show using visibility approach
      aiContainer.style.visibility = 'visible';
      aiContainer.style.height = 'auto';
      aiContainer.style.opacity = '1';
      aiContainer.style.overflow = 'visible';
      return;
    }

    // Show loading state using visibility approach
    aiContent.textContent = 'Loading AI recommendations...';
    aiContainer.style.visibility = 'visible';
    aiContainer.style.height = 'auto';
    aiContainer.style.opacity = '1';
    aiContainer.style.overflow = 'visible';
    
    const aiBtn = document.getElementById('ai-recommendation-btn');
    if (aiBtn) {
      aiBtn.disabled = true;
      aiBtn.textContent = '🤖 Loading...';
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/zerodha/holdings-ai?session=${this.sessionToken}`);
      
      if (response.status === 401) {
        this.handleSessionExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const aiRecommendation = await response.text(); // Assuming AI returns text response
      
      if (!aiRecommendation || aiRecommendation.trim() === '') {
        aiContent.textContent = 'No AI recommendations available at this time.';
      } else {
        aiContent.textContent = aiRecommendation;
      }

      this.showMessage('AI recommendations loaded successfully!', 'success');

    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      aiContent.textContent = 'Failed to fetch AI recommendations. Please try again later.\n\nError: ' + error.message;
      this.showMessage('Failed to fetch AI recommendations', 'error');
    } finally {
      // Reset button state
      if (aiBtn) {
        aiBtn.disabled = false;
        aiBtn.textContent = '🤖 AI Recommendations';
      }
    }
  }

  handleSessionExpired() {
    console.log('Session expired, clearing stored session');
    this.clearSession();
    this.updateUI();
    
    const holdingsContainer = document.getElementById('zerodha-holdings-container');
    if (holdingsContainer) {
      holdingsContainer.innerHTML = '<p style="padding: 15px; background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 8px; color: #856404;">Session expired. Please connect to Zerodha again.</p>';
      
      // Make sure the container is visible
      holdingsContainer.style.visibility = 'visible';
      holdingsContainer.style.height = 'auto';
      holdingsContainer.style.opacity = '1';
    }
    
    const aiContainer = document.getElementById('ai-recommendations-container');
    if (aiContainer) {
      // Hide using visibility instead of display
      aiContainer.style.visibility = 'hidden';
      aiContainer.style.height = '0';
      aiContainer.style.opacity = '0';
      aiContainer.style.overflow = 'hidden';
    }
    
    this.showMessage('Session expired. Please login again.', 'warning');
  }

  clearSession() {
    this.sessionToken = null;
    localStorage.removeItem('zerodha_session');
  }

  updateUI() {
    console.log('updateUI called, sessionToken:', this.sessionToken);
    
    const connectBtn = document.getElementById('connect-zerodha-btn');
    const fetchBtn = document.getElementById('fetch-zerodha-holdings-btn');
    const aiBtn = document.getElementById('ai-recommendation-btn');
    
    if (connectBtn) {
      connectBtn.textContent = this.sessionToken ? 'Reconnect Zerodha' : 'Connect Zerodha';
      console.log('Connect button updated:', connectBtn.textContent);
    }
    
    if (fetchBtn) {
      fetchBtn.disabled = !this.sessionToken;
      fetchBtn.style.opacity = this.sessionToken ? '1' : '0.5';
      console.log('Fetch button disabled:', fetchBtn.disabled);
    }
    
    if (aiBtn) {
      aiBtn.disabled = !this.sessionToken;
      aiBtn.style.opacity = this.sessionToken ? '1' : '0.5';
      console.log('AI button disabled:', aiBtn.disabled);
    }
  }

  showMessage(message, type = 'info') {
    // Create or update message element
    let messageEl = document.getElementById('zerodha-message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.id = 'zerodha-message';
      messageEl.style.cssText = `
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        font-weight: bold;
      `;
      
      const container = document.getElementById('zerodha-holdings-container');
      if (container && container.parentNode) {
        container.parentNode.insertBefore(messageEl, container);
      }
    }
    
    // Set message and styling based on type
    messageEl.textContent = message;
    
    switch (type) {
      case 'success':
        messageEl.style.backgroundColor = '#d4edda';
        messageEl.style.color = '#155724';
        messageEl.style.border = '1px solid #c3e6cb';
        break;
      case 'error':
        messageEl.style.backgroundColor = '#f8d7da';
        messageEl.style.color = '#721c24';
        messageEl.style.border = '1px solid #f5c6cb';
        break;
      case 'warning':
        messageEl.style.backgroundColor = '#fff3cd';
        messageEl.style.color = '#856404';
        messageEl.style.border = '1px solid #ffeaa7';
        break;
      default:
        messageEl.style.backgroundColor = '#d1ecf1';
        messageEl.style.color = '#0c5460';
        messageEl.style.border = '1px solid #bee5eb';
    }
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.style.display = 'none';
        }
      }, 5000);
    }
  }

  // Public method to check if user is authenticated
  isAuthenticated() {
    return !!this.sessionToken;
  }

  // Public method to get session token for other API calls
  getSessionToken() {
    return this.sessionToken;
  }
}

// Initialize Zerodha authentication when DOM is loaded
let zerodhaAuth;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    zerodhaAuth = new ZerodhaAuth();
  });
} else {
  zerodhaAuth = new ZerodhaAuth();
}

// Stock Watchlist Application - JavaScript with Debug Features
class StockWatchlistApp {
    constructor() {
        // In-memory storage (no localStorage dependency)
        this.watchlists = {};
        this.activeWatchlist = null;
        this.stockDatabase = [];
        this.marketIndices = [];
        this.isMarketOpen = false;
        this.autoRefreshInterval = null;
        this.currentTheme = 'light';
        this.pendingAction = null;
        this.debugLogs = [];
        
        // Yahoo Finance API configuration
        this.apiConfig = {
            // Using public Yahoo Finance API alternatives
            quotesUrl: 'https://query1.finance.yahoo.com/v8/finance/chart/',
            searchUrl: 'https://query1.finance.yahoo.com/v1/finance/search',
            autocompleteUrl: 'https://query2.finance.yahoo.com/v1/finance/search',
            // Alternative APIs for fallback
            alternativeQuotesUrl: 'https://query2.finance.yahoo.com/v8/finance/chart/',
            // CORS proxy options
            corsProxy: 'https://api.allorigins.win/get?url=',
            corsProxy2: 'https://corsproxy.io/?',
            useCorsProxy: false,
            currentProxyIndex: 0
        };
        
        // Cache for API responses
        this.dataCache = new Map();
        this.cacheTimeout = 60000; // 1 minute cache
        
        this.debugLog('🚀 Initializing Stock Watchlist Application...', 'info');
        this.init();
    }

    debugLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = { message, type, timestamp };
        this.debugLogs.push(logEntry);
        
        // Keep only last 50 logs
        if (this.debugLogs.length > 50) {
            this.debugLogs.shift();
        }
        
        // Console log
        const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
        
        // Update debug panel
        this.updateDebugPanel();
    }

    updateDebugPanel() {
        try {
            const debugLogs = document.getElementById('debugLogs');
            if (!debugLogs) return;
            
            debugLogs.innerHTML = this.debugLogs.slice(-20).reverse().map(log => 
                `<div class="debug-log ${log.type}">[${log.timestamp}] ${log.message}</div>`
            ).join('');
        } catch (error) {
            console.error('Error updating debug panel:', error);
        }
    }

    init() {
        try {
            this.debugLog('Initializing stock data and popular stocks list...', 'info');
            this.initializePopularStocks();
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.finishInit();
                });
            } else {
                this.finishInit();
            }
        } catch (error) {
            this.debugLog(`❌ Error during initialization: ${error.message}`, 'error');
            console.error('Initialization error:', error);
        }
    }

    finishInit() {
        try {
            this.debugLog('Setting up event listeners...', 'info');
            this.setupEventListeners();
            
            this.debugLog('Updating market status...', 'info');
            this.updateMarketStatus();
            
            this.debugLog('Loading market indices...', 'info');
            this.loadMarketIndices();
            
            this.debugLog('Setting up auto refresh...', 'info');
            this.setupAutoRefresh();
            
            this.debugLog('Loading theme...', 'info');
            this.loadTheme();
            
            this.debugLog('Updating UI...', 'info');
            this.updateUI();
            
            this.debugLog('✅ Application initialized successfully!', 'success');
        } catch (error) {
            this.debugLog(`❌ Error during finish initialization: ${error.message}`, 'error');
            console.error('Finish initialization error:', error);
        }
    }

    async loadMarketIndices() {
        try {
            this.debugLog('Fetching market indices from Yahoo Finance...', 'info');
            this.marketIndices = await this.fetchMarketIndices();
            this.updateMarketIndices();
            this.debugLog(`✅ Loaded ${this.marketIndices.length} market indices`, 'success');
        } catch (error) {
            this.debugLog(`Error loading market indices: ${error.message}`, 'error');
            // Fallback to empty array
            this.marketIndices = [];
        }
    }

    initializePopularStocks() {
        try {
            // Initialize with popular Indian stocks for search
            this.popularStocks = [
                {"symbol": "RELIANCE.NS", "name": "Reliance Industries", "sector": "Oil & Gas"},
                {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "sector": "IT Services"},
                {"symbol": "HDFCBANK.NS", "name": "HDFC Bank", "sector": "Banking"},
                {"symbol": "ICICIBANK.NS", "name": "ICICI Bank", "sector": "Banking"},
                {"symbol": "BHARTIARTL.NS", "name": "Bharti Airtel", "sector": "Telecom"},
                {"symbol": "INFY.NS", "name": "Infosys", "sector": "IT Services"},
                {"symbol": "ITC.NS", "name": "ITC", "sector": "FMCG"},
                {"symbol": "SBIN.NS", "name": "State Bank of India", "sector": "Banking"},
                {"symbol": "LT.NS", "name": "Larsen & Toubro", "sector": "Construction"},
                {"symbol": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank", "sector": "Banking"},
                {"symbol": "ASIANPAINT.NS", "name": "Asian Paints", "sector": "Paints"},
                {"symbol": "MARUTI.NS", "name": "Maruti Suzuki", "sector": "Automobile"},
                {"symbol": "HCLTECH.NS", "name": "HCL Technologies", "sector": "IT Services"},
                {"symbol": "WIPRO.NS", "name": "Wipro", "sector": "IT Services"},
                {"symbol": "TITAN.NS", "name": "Titan Company", "sector": "Consumer Goods"},
                {"symbol": "ADANIPORTS.NS", "name": "Adani Ports", "sector": "Infrastructure"},
                {"symbol": "BAJFINANCE.NS", "name": "Bajaj Finance", "sector": "NBFC"},
                {"symbol": "NESTLEIND.NS", "name": "Nestle India", "sector": "FMCG"},
                {"symbol": "ULTRACEMCO.NS", "name": "UltraTech Cement", "sector": "Cement"},
                {"symbol": "AXISBANK.NS", "name": "Axis Bank", "sector": "Banking"}
            ];

            this.stockDatabase = []; // Will be populated dynamically from API
            this.marketIndices = []; // Will be populated from API
            
            this.debugLog(`Initialized ${this.popularStocks.length} popular stocks for search`, 'success');
        } catch (error) {
            this.debugLog(`Error initializing popular stocks: ${error.message}`, 'error');
        }
    }

    // API Helper Methods
    async fetchWithCache(url, cacheKey) {
        try {
            // Check cache first
            const cached = this.dataCache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                this.debugLog(`Using cached data for ${cacheKey}`, 'info');
                return cached.data;
            }

            this.debugLog(`Fetching fresh data for ${cacheKey}`, 'info');
            
            let response;
            let data;
            
            try {
                // Try direct API call first
                response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                data = await response.json();
            } catch (corsError) {
                this.debugLog('Direct API call failed, trying with CORS proxy...', 'warning');
                
                // Try with CORS proxy
                const proxyUrl = `${this.apiConfig.corsProxy}${encodeURIComponent(url)}`;
                response = await fetch(proxyUrl);
                
                if (!response.ok) {
                    throw new Error(`Proxy HTTP ${response.status}: ${response.statusText}`);
                }
                
                const proxyResult = await response.json();
                
                // Handle different proxy response formats
                if (proxyResult.contents) {
                    data = JSON.parse(proxyResult.contents);
                } else if (proxyResult.data) {
                    data = proxyResult.data;
                } else {
                    data = proxyResult;
                }
                
                this.apiConfig.useCorsProxy = true; // Use proxy for future requests
            }
            
            // Cache the response
            this.dataCache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            this.debugLog(`Error fetching ${cacheKey}: ${error.message}`, 'error');
            throw error;
        }
    }

    async fetchStockData(symbols) {
        try {
            const results = {};
            
            for (const symbol of symbols) {
                try {
                    const url = `${this.apiConfig.quotesUrl}${symbol}`;
                    let data;
                    
                    try {
                        data = await this.fetchWithCache(url, `stock_${symbol}`);
                    } catch (apiError) {
                        this.debugLog(`API failed for ${symbol}, trying alternative or fallback...`, 'warning');
                        
                        // Try alternative URL
                        try {
                            const altUrl = `${this.apiConfig.alternativeQuotesUrl}${symbol}`;
                            data = await this.fetchWithCache(altUrl, `stock_alt_${symbol}`);
                        } catch (altError) {
                            this.debugLog(`Alternative API also failed for ${symbol}, using mock data`, 'warning');
                            
                            // Generate mock data based on popular stocks info
                            const stockInfo = this.popularStocks.find(s => s.symbol === symbol);
                            if (stockInfo) {
                                const mockPrice = 100 + Math.random() * 2000; // Random price between 100-2100
                                const mockChange = (Math.random() - 0.5) * 20; // Random change -10 to +10
                                const mockChangePercent = (mockChange / mockPrice) * 100;
                                
                                results[symbol] = {
                                    symbol: symbol,
                                    name: stockInfo.name,
                                    sector: stockInfo.sector,
                                    price: parseFloat(mockPrice.toFixed(2)),
                                    change: parseFloat(mockChange.toFixed(2)),
                                    change_percent: parseFloat(mockChangePercent.toFixed(2)),
                                    market_cap: Math.floor(Math.random() * 500000), // Random market cap
                                    volume: Math.floor(Math.random() * 1000000),
                                    high: parseFloat((mockPrice * 1.02).toFixed(2)),
                                    low: parseFloat((mockPrice * 0.98).toFixed(2)),
                                    open: parseFloat((mockPrice * (0.99 + Math.random() * 0.02)).toFixed(2)),
                                    pe_ratio: parseFloat((15 + Math.random() * 20).toFixed(1)),
                                    pb_ratio: parseFloat((1 + Math.random() * 5).toFixed(1)),
                                    roe: parseFloat((5 + Math.random() * 25).toFixed(1)),
                                    dividend_yield: parseFloat((Math.random() * 5).toFixed(2))
                                };
                                
                                this.debugLog(`Generated mock data for ${symbol}`, 'info');
                                continue;
                            }
                            
                            throw altError;
                        }
                    }
                    
                    if (data?.chart?.result?.[0]) {
                        const result = data.chart.result[0];
                        const meta = result.meta;
                        const quotes = result.indicators?.quote?.[0];
                        const timestamps = result.timestamp;
                        
                        if (quotes && timestamps && timestamps.length > 0) {
                            const latestIndex = timestamps.length - 1;
                            const prevIndex = Math.max(0, latestIndex - 1);
                            
                            const currentPrice = quotes.close[latestIndex] || meta.regularMarketPrice || 0;
                            const prevPrice = quotes.close[prevIndex] || currentPrice;
                            const change = currentPrice - prevPrice;
                            const changePercent = prevPrice > 0 ? (change / prevPrice) * 100 : 0;

                            // Find stock info from popular stocks
                            const stockInfo = this.popularStocks.find(s => s.symbol === symbol) || {
                                name: meta.shortName || symbol.replace('.NS', '').replace('.BO', ''),
                                sector: 'Unknown'
                            };

                            results[symbol] = {
                                symbol: symbol,
                                name: stockInfo.name,
                                sector: stockInfo.sector,
                                price: parseFloat(currentPrice.toFixed(2)),
                                change: parseFloat(change.toFixed(2)),
                                change_percent: parseFloat(changePercent.toFixed(2)),
                                market_cap: Math.floor((meta.marketCap || 0) / 10000000), // Convert to crores
                                volume: quotes.volume?.[latestIndex] || 0,
                                high: quotes.high?.[latestIndex] || currentPrice,
                                low: quotes.low?.[latestIndex] || currentPrice,
                                open: quotes.open?.[latestIndex] || currentPrice,
                                pe_ratio: 0, // Not available in this endpoint
                                pb_ratio: 0,
                                roe: 0,
                                dividend_yield: 0
                            };
                        }
                    }
                } catch (error) {
                    this.debugLog(`Error fetching data for ${symbol}: ${error.message}`, 'error');
                    // Continue with other symbols
                }
            }
            
            return results;
        } catch (error) {
            this.debugLog(`Error in fetchStockData: ${error.message}`, 'error');
            return {};
        }
    }

    async fetchMarketIndices() {
        try {
            const indices = [
                { symbol: '^NSEI', name: 'NIFTY 50' },
                { symbol: '^BSESN', name: 'SENSEX' },
                { symbol: '^NSEBANK', name: 'BANK NIFTY' }
            ];

            const results = [];

            for (const index of indices) {
                try {
                    const url = `${this.apiConfig.quotesUrl}${index.symbol}`;
                    let data;
                    
                    try {
                        data = await this.fetchWithCache(url, `index_${index.symbol}`);
                    } catch (apiError) {
                        this.debugLog(`Index API failed for ${index.name}, using mock data`, 'warning');
                        
                        // Generate mock index data
                        const mockValue = index.name === 'NIFTY 50' ? 24000 + Math.random() * 1000 :
                                        index.name === 'SENSEX' ? 80000 + Math.random() * 2000 :
                                        51000 + Math.random() * 1000;
                        const mockChange = (Math.random() - 0.5) * 200;
                        const mockChangePercent = (mockChange / mockValue) * 100;
                        
                        results.push({
                            name: index.name,
                            value: parseFloat(mockValue.toFixed(2)),
                            change: parseFloat(mockChange.toFixed(2)),
                            change_percent: parseFloat(mockChangePercent.toFixed(2))
                        });
                        
                        continue;
                    }
                    
                    if (data?.chart?.result?.[0]) {
                        const result = data.chart.result[0];
                        const meta = result.meta;
                        const quotes = result.indicators?.quote?.[0];
                        const timestamps = result.timestamp;
                        
                        if (quotes && timestamps && timestamps.length > 0) {
                            const latestIndex = timestamps.length - 1;
                            const prevIndex = Math.max(0, latestIndex - 1);
                            
                            const currentValue = quotes.close[latestIndex] || meta.regularMarketPrice || 0;
                            const prevValue = quotes.close[prevIndex] || currentValue;
                            const change = currentValue - prevValue;
                            const changePercent = prevValue > 0 ? (change / prevValue) * 100 : 0;

                            results.push({
                                name: index.name,
                                value: parseFloat(currentValue.toFixed(2)),
                                change: parseFloat(change.toFixed(2)),
                                change_percent: parseFloat(changePercent.toFixed(2))
                            });
                        }
                    }
                } catch (error) {
                    this.debugLog(`Error fetching ${index.name}: ${error.message}`, 'error');
                }
            }

            // If no real data was fetched, provide default mock data
            if (results.length === 0) {
                this.debugLog('No index data available, providing default mock data', 'warning');
                results.push(
                    { name: 'NIFTY 50', value: 24381.10, change: 142.87, change_percent: 0.59 },
                    { name: 'SENSEX', value: 80109.85, change: 487.28, change_percent: 0.61 },
                    { name: 'BANK NIFTY', value: 51285.32, change: -125.45, change_percent: -0.24 }
                );
            }

            return results;
        } catch (error) {
            this.debugLog(`Error fetching market indices: ${error.message}`, 'error');
            // Return mock data as fallback
            return [
                { name: 'NIFTY 50', value: 24381.10, change: 142.87, change_percent: 0.59 },
                { name: 'SENSEX', value: 80109.85, change: 487.28, change_percent: 0.61 },
                { name: 'BANK NIFTY', value: 51285.32, change: -125.45, change_percent: -0.24 }
            ];
        }
    }

    async searchStocksAPI(query) {
        try {
            if (!query || query.length < 2) {
                return [];
            }

            this.debugLog(`Searching Yahoo Finance for: "${query}"`, 'info');
            
            // Try Yahoo Finance search API
            let searchUrl = `${this.apiConfig.searchUrl}?q=${encodeURIComponent(query)}&lang=en-US&region=IN&quotesCount=10&newsCount=0`;
            
            let data;
            try {
                data = await this.fetchWithCache(searchUrl, `search_${query}`);
            } catch (error) {
                this.debugLog(`Yahoo Finance search failed: ${error.message}`, 'warning');
                
                // Try alternative search approach - use popular stocks with better matching
                return this.searchFromPopularStocksEnhanced(query);
            }
            
            if (data?.quotes) {
                // Filter for Indian stocks (ending with .NS or .BO) and relevant results
                const results = data.quotes
                    .filter(stock => {
                        const symbol = stock.symbol || '';
                        const exchange = stock.exchange || '';
                        
                        // Focus on Indian exchanges
                        return (
                            symbol.endsWith('.NS') || 
                            symbol.endsWith('.BO') || 
                            exchange === 'NSI' || 
                            exchange === 'BSE' ||
                            (stock.typeDisp === 'Equity' && (symbol.includes('NS') || symbol.includes('BO')))
                        );
                    })
                    .slice(0, 8)
                    .map(stock => ({
                        symbol: stock.symbol,
                        name: stock.shortname || stock.longname || stock.symbol.replace('.NS', '').replace('.BO', ''),
                        sector: stock.sector || stock.industry || 'Unknown',
                        exchange: stock.exchange || 'NSE'
                    }));

                this.debugLog(`Found ${results.length} Indian stocks from API search`, 'success');
                return results;
            }
            
            // Fallback to popular stocks if API fails
            this.debugLog('API search returned no results, falling back to popular stocks', 'warning');
            return this.searchFromPopularStocksEnhanced(query);
            
        } catch (error) {
            this.debugLog(`Error in API search: ${error.message}`, 'error');
            // Fallback to enhanced popular stocks search
            return this.searchFromPopularStocksEnhanced(query);
        }
    }

    searchFromPopularStocksEnhanced(query) {
        try {
            const normalizedQuery = query.toLowerCase().trim();
            
            // Enhanced search with better matching
            const results = this.popularStocks.filter(stock => {
                const symbolMatch = stock.symbol.toLowerCase().includes(normalizedQuery);
                const nameMatch = stock.name.toLowerCase().includes(normalizedQuery);
                const sectorMatch = stock.sector.toLowerCase().includes(normalizedQuery);
                
                // Also try matching without .NS suffix
                const symbolWithoutSuffix = stock.symbol.replace('.NS', '').toLowerCase();
                const suffixMatch = symbolWithoutSuffix.includes(normalizedQuery);
                
                return symbolMatch || nameMatch || sectorMatch || suffixMatch;
            }).slice(0, 8);
            
            this.debugLog(`Found ${results.length} matching stocks from enhanced popular stocks search`, 'info');
            return results;
        } catch (error) {
            this.debugLog(`Error in enhanced popular stocks search: ${error.message}`, 'error');
            return [];
        }
    }

    searchFromPopularStocks(query) {
        try {
            const normalizedQuery = query.toLowerCase().trim();
            
            const results = this.popularStocks.filter(stock => 
                stock.symbol.toLowerCase().includes(normalizedQuery) ||
                stock.name.toLowerCase().includes(normalizedQuery) ||
                stock.sector.toLowerCase().includes(normalizedQuery)
            ).slice(0, 8);
            
            this.debugLog(`Found ${results.length} matching stocks from popular stocks`, 'info');
            return results;
        } catch (error) {
            this.debugLog(`Error searching popular stocks: ${error.message}`, 'error');
            return [];
        }
    }

    setupEventListeners() {
        try {
            // Debug toggle
            this.addEventListenerSafe('toggleDebug', 'click', (e) => {
                e.preventDefault();
                this.toggleDebugPanel();
            });

            // Watchlist management - Fixed event listeners
            this.addEventListenerSafe('createWatchlistBtn', 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.debugLog('Create watchlist button clicked', 'info');
                this.showCreateWatchlistModal();
            });

            this.addEventListenerSafe('createFirstWatchlist', 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.debugLog('Create first watchlist button clicked', 'info');
                this.showCreateWatchlistModal();
            });

            this.addEventListenerSafe('deleteWatchlistBtn', 'click', (e) => {
                e.preventDefault();
                this.debugLog('Delete watchlist button clicked', 'info');
                this.confirmDeleteWatchlist();
            });

            this.addEventListenerSafe('watchlistSelector', 'change', (e) => {
                this.debugLog(`Watchlist selector changed to: ${e.target.value}`, 'info');
                this.switchWatchlist(e.target.value);
            });

            // Stock search - Fixed search functionality
            this.setupStockSearch();

            // Modal events
            this.setupModalEventListeners();

            // Other controls
            this.addEventListenerSafe('refreshBtn', 'click', (e) => {
                e.preventDefault();
                this.refreshData();
            });

            this.addEventListenerSafe('themeToggle', 'click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });

            // Global click handler
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-wrapper')) {
                    this.hideSearchResults();
                }
            });

            this.debugLog('Event listeners setup completed', 'success');
        } catch (error) {
            this.debugLog(`Error setting up event listeners: ${error.message}`, 'error');
        }
    }

    setupStockSearch() {
        try {
            const stockSearchInput = document.getElementById('stockSearch');
            if (!stockSearchInput) {
                this.debugLog('Stock search input not found', 'warning');
                return;
            }
            
            let searchTimeout;
            
            // Input event for typing
            stockSearchInput.addEventListener('input', (e) => {
                this.debugLog(`Stock search input: "${e.target.value}"`, 'info');
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleStockSearch(e.target.value);
                }, 300);
            });
            
            // Focus event
            stockSearchInput.addEventListener('focus', (e) => {
                this.debugLog('Stock search focused', 'info');
                if (e.target.value.trim()) {
                    this.handleStockSearch(e.target.value);
                }
            });

            // Keydown for navigation
            stockSearchInput.addEventListener('keydown', (e) => {
                const searchResults = document.getElementById('searchResults');
                const items = searchResults ? searchResults.querySelectorAll('.search-result-item') : [];
                
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateSearchResults(e.key === 'ArrowDown', items);
                } else if (e.key === 'Escape') {
                    this.hideSearchResults();
                }
            });

            this.debugLog('Stock search setup completed', 'success');
        } catch (error) {
            this.debugLog(`Error setting up stock search: ${error.message}`, 'error');
        }
    }

    addEventListenerSafe(elementId, event, handler) {
        try {
            const element = document.getElementById(elementId);
            if (element) {
                element.addEventListener(event, handler);
                this.debugLog(`Added ${event} listener to ${elementId}`, 'info');
                return true;
            } else {
                this.debugLog(`Element ${elementId} not found for ${event} listener`, 'warning');
                return false;
            }
        } catch (error) {
            this.debugLog(`Error adding listener to ${elementId}: ${error.message}`, 'error');
            return false;
        }
    }

    setupModalEventListeners() {
        try {
            // Main modal events
            this.addEventListenerSafe('modalClose', 'click', (e) => {
                e.preventDefault();
                this.debugLog('Modal close clicked', 'info');
                this.hideModal();
            });

            this.addEventListenerSafe('modalCancel', 'click', (e) => {
                e.preventDefault();
                this.debugLog('Modal cancel clicked', 'info');
                this.hideModal();
            });

            this.addEventListenerSafe('modalConfirm', 'click', (e) => {
                e.preventDefault();
                this.debugLog('Modal confirm clicked', 'info');
                this.handleModalConfirm();
            });

            // Modal overlay click
            const modalOverlay = document.getElementById('modalOverlay');
            if (modalOverlay) {
                modalOverlay.addEventListener('click', (e) => {
                    if (e.target === modalOverlay) {
                        this.debugLog('Modal overlay clicked', 'info');
                        this.hideModal();
                    }
                });
            }

            // Watchlist name input
            const watchlistNameInput = document.getElementById('watchlistName');
            if (watchlistNameInput) {
                watchlistNameInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.debugLog('Enter key pressed in watchlist name input', 'info');
                        this.handleModalConfirm();
                    } else if (e.key === 'Escape') {
                        this.debugLog('Escape key pressed in watchlist name input', 'info');
                        this.hideModal();
                    }
                });

                watchlistNameInput.addEventListener('input', (e) => {
                    this.clearFormError('watchlistNameError');
                });
            }

            // Confirmation modal events
            this.addEventListenerSafe('confirmationClose', 'click', (e) => {
                e.preventDefault();
                this.hideConfirmationModal();
            });

            this.addEventListenerSafe('confirmationCancel', 'click', (e) => {
                e.preventDefault();
                this.hideConfirmationModal();
            });

            this.addEventListenerSafe('confirmationConfirm', 'click', (e) => {
                e.preventDefault();
                this.handleConfirmationConfirm();
            });

            const confirmationModal = document.getElementById('confirmationModal');
            if (confirmationModal) {
                confirmationModal.addEventListener('click', (e) => {
                    if (e.target === confirmationModal) {
                        this.hideConfirmationModal();
                    }
                });
            }

            this.debugLog('Modal event listeners setup completed', 'success');
        } catch (error) {
            this.debugLog(`Error setting up modal listeners: ${error.message}`, 'error');
        }
    }

    toggleDebugPanel() {
        try {
            const debugPanel = document.getElementById('debugPanel');
            const toggleBtn = document.getElementById('toggleDebug');
            
            if (!debugPanel || !toggleBtn) return;
            
            if (debugPanel.style.display === 'none') {
                debugPanel.style.display = 'block';
                toggleBtn.textContent = 'Hide';
                this.debugLog('Debug panel shown', 'info');
            } else {
                debugPanel.style.display = 'none';
                toggleBtn.textContent = 'Show Debug';
                this.debugLog('Debug panel hidden', 'info');
            }
        } catch (error) {
            this.debugLog(`Error toggling debug panel: ${error.message}`, 'error');
        }
    }

    loadTheme() {
        this.currentTheme = 'light'; // Default theme, no localStorage
        this.applyTheme();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.debugLog(`Theme switched to ${this.currentTheme}`, 'info');
    }

    applyTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }

    updateMarketStatus() {
        try {
            const now = new Date();
            const hour = now.getHours();
            const minute = now.getMinutes();
            const currentTime = hour * 60 + minute;
            
            // Market hours: 9:15 AM to 3:30 PM (IST)
            const marketOpen = 9 * 60 + 15; // 9:15 AM
            const marketClose = 15 * 60 + 30; // 3:30 PM
            
            this.isMarketOpen = currentTime >= marketOpen && currentTime <= marketClose;
            
            const statusEl = document.getElementById('marketStatus');
            const statusSpan = statusEl?.querySelector('.status');
            
            if (statusSpan) {
                if (this.isMarketOpen) {
                    statusSpan.textContent = 'Market Open';
                    statusSpan.className = 'status status--success';
                } else {
                    statusSpan.textContent = 'Market Closed';
                    statusSpan.className = 'status status--error';
                }
            }
            
            this.debugLog(`Market status updated: ${this.isMarketOpen ? 'Open' : 'Closed'}`, 'info');
        } catch (error) {
            this.debugLog(`Error updating market status: ${error.message}`, 'error');
        }
    }

    updateMarketIndices() {
        try {
            const indicesGrid = document.getElementById('indicesGrid');
            if (!indicesGrid) return;
            
            indicesGrid.innerHTML = this.marketIndices.map(index => `
                <div class="index-card">
                    <div class="index-name">${index.name}</div>
                    <div class="index-value">₹${index.value.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                    <div class="index-change ${index.change >= 0 ? 'positive' : 'negative'}">
                        ${index.change >= 0 ? '+' : ''}${index.change.toFixed(2)} (${index.change_percent.toFixed(2)}%)
                    </div>
                </div>
            `).join('');
            
            this.debugLog('Market indices updated successfully', 'success');
        } catch (error) {
            this.debugLog(`Error updating market indices: ${error.message}`, 'error');
        }
    }

    setupAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
        
        // Auto refresh every 30 seconds during market hours
        this.autoRefreshInterval = setInterval(async () => {
            this.updateMarketStatus();
            if (this.isMarketOpen && this.activeWatchlist) {
                await this.refreshWatchlistData();
            }
            // Always refresh indices
            if (this.marketIndices.length > 0) {
                this.loadMarketIndices();
            }
        }, 30000);
        
        this.debugLog('Auto refresh setup completed', 'success');
    }

    // Watchlist Management Methods
    showCreateWatchlistModal() {
        try {
            this.debugLog('Attempting to show create watchlist modal', 'info');
            
            const modalOverlay = document.getElementById('modalOverlay');
            const watchlistNameInput = document.getElementById('watchlistName');
            const modalTitle = document.getElementById('modalTitle');
            const modalConfirm = document.getElementById('modalConfirm');
            
            if (!modalOverlay) {
                this.debugLog('Modal overlay element not found!', 'error');
                this.showToast('Error: Modal not found', 'error');
                return;
            }
            
            this.debugLog('Modal elements found, setting content...', 'info');
            
            // Set modal content
            if (modalTitle) modalTitle.textContent = 'Create New Watchlist';
            if (watchlistNameInput) watchlistNameInput.value = '';
            if (modalConfirm) modalConfirm.textContent = 'Create';
            
            // Clear any existing errors
            this.clearFormError('watchlistNameError');
            
            // Show modal with explicit display and class
            modalOverlay.style.display = 'flex';
            modalOverlay.classList.add('show');
            
            this.debugLog('Modal display set, focusing input...', 'info');
            
            // Focus the input after a short delay
            setTimeout(() => {
                if (watchlistNameInput) {
                    watchlistNameInput.focus();
                    this.debugLog('Input focused', 'success');
                }
            }, 100);
            
            this.debugLog('✅ Create watchlist modal displayed successfully', 'success');
        } catch (error) {
            this.debugLog(`❌ Error showing create watchlist modal: ${error.message}`, 'error');
            this.showToast('Error opening modal', 'error');
        }
    }

    hideModal() {
        try {
            this.debugLog('Hiding modal...', 'info');
            const modalOverlay = document.getElementById('modalOverlay');
            if (modalOverlay) {
                modalOverlay.classList.remove('show');
                modalOverlay.style.display = 'none';
                this.clearFormError('watchlistNameError');
                this.debugLog('✅ Modal hidden successfully', 'success');
            }
        } catch (error) {
            this.debugLog(`❌ Error hiding modal: ${error.message}`, 'error');
        }
    }

    handleModalConfirm() {
        try {
            this.debugLog('Handling modal confirm...', 'info');
            
            const nameInput = document.getElementById('watchlistName');
            if (!nameInput) {
                this.debugLog('Watchlist name input not found', 'error');
                this.showToast('Error: Form input not found', 'error');
                return;
            }
            
            const name = nameInput.value.trim();
            this.debugLog(`Watchlist name entered: "${name}"`, 'info');
            
            // Validation
            if (!name) {
                this.showFormError('watchlistNameError', 'Please enter a watchlist name');
                this.debugLog('Validation failed: Empty name', 'error');
                this.showToast('Please enter a watchlist name', 'error');
                return;
            }
            
            if (name.length > 50) {
                this.showFormError('watchlistNameError', 'Watchlist name must be 50 characters or less');
                this.debugLog('Validation failed: Name too long', 'error');
                this.showToast('Watchlist name is too long', 'error');
                return;
            }
            
            // Check for invalid characters - More permissive regex
            if (!/^[a-zA-Z0-9\s\-_.]+$/.test(name)) {
                this.showFormError('watchlistNameError', 'Watchlist name contains invalid characters');
                this.debugLog('Validation failed: Invalid characters', 'error');
                this.showToast('Invalid characters in name', 'error');
                return;
            }
            
            if (this.watchlists[name]) {
                this.showFormError('watchlistNameError', 'A watchlist with this name already exists');
                this.debugLog('Validation failed: Duplicate name', 'error');
                this.showToast('Watchlist name already exists', 'error');
                return;
            }
            
            this.debugLog('All validations passed, creating watchlist...', 'success');
            this.createWatchlist(name);
            this.hideModal();
        } catch (error) {
            this.debugLog(`❌ Error in modal confirm: ${error.message}`, 'error');
            this.showToast('Error creating watchlist', 'error');
        }
    }

    createWatchlist(name) {
        try {
            this.debugLog(`Creating watchlist: "${name}"`, 'info');
            
            // Create watchlist object
            this.watchlists[name] = {
                name: name,
                stocks: [],
                created: new Date().toISOString()
            };
            
            // Set as active watchlist
            this.activeWatchlist = name;
            
            this.debugLog(`✅ Watchlist created successfully. Total watchlists: ${Object.keys(this.watchlists).length}`, 'success');
            this.debugLog(`Active watchlist set to: "${this.activeWatchlist}"`, 'info');
            
            // Update UI
            this.updateUI();
            this.showToast(`Watchlist "${name}" created successfully!`, 'success');
            
            // Enable stock search
            const stockSearchInput = document.getElementById('stockSearch');
            if (stockSearchInput) {
                stockSearchInput.disabled = false;
                stockSearchInput.placeholder = 'Search by symbol (e.g., RELIANCE.NS) or company name';
                this.debugLog('Stock search enabled', 'info');
            }
            
            this.debugLog('✅ UI updated after watchlist creation', 'success');
        } catch (error) {
            this.debugLog(`❌ Error creating watchlist: ${error.message}`, 'error');
            this.showToast('Failed to create watchlist', 'error');
            throw error;
        }
    }

    switchWatchlist(name) {
        try {
            this.debugLog(`Switching to watchlist: "${name}"`, 'info');
            
            if (name === '') {
                this.activeWatchlist = null;
                this.debugLog('Active watchlist cleared', 'info');
            } else {
                if (!this.watchlists[name]) {
                    this.debugLog(`Watchlist "${name}" not found`, 'error');
                    return;
                }
                this.activeWatchlist = name;
                this.debugLog(`Active watchlist set to: "${name}"`, 'success');
            }
            
            this.updateUI();
            
            // Update stock search availability
            const stockSearchInput = document.getElementById('stockSearch');
            if (stockSearchInput) {
                stockSearchInput.disabled = !this.activeWatchlist;
                if (this.activeWatchlist) {
                    stockSearchInput.placeholder = 'Search by symbol (e.g., RELIANCE.NS) or company name';
                } else {
                    stockSearchInput.placeholder = 'Select a watchlist first to add stocks';
                }
            }
            
            if (name) {
                this.showToast(`Switched to "${name}" watchlist`, 'success');
            }
        } catch (error) {
            this.debugLog(`Error switching watchlist: ${error.message}`, 'error');
        }
    }

    // Stock Management Methods
    async handleStockSearch(query) {
        try {
            this.debugLog(`Stock search triggered with query: "${query}"`, 'info');
            
            const searchResults = document.getElementById('searchResults');
            if (!searchResults) {
                this.debugLog('Search results element not found', 'error');
                return;
            }
            
            if (!this.activeWatchlist) {
                this.debugLog('No active watchlist for stock search', 'warning');
                searchResults.innerHTML = '<div class="search-empty">Please select a watchlist first</div>';
                searchResults.style.display = 'block';
                return;
            }
            
            if (!query.trim()) {
                this.hideSearchResults();
                return;
            }

            this.debugLog(`Searching Yahoo Finance API for stocks matching: "${query}"`, 'info');
            
            // Show loading
            searchResults.innerHTML = '<div class="search-loading">🔍 Searching Yahoo Finance...</div>';
            searchResults.style.display = 'block';
            
            // Search using Yahoo Finance API
            const results = await this.searchStocksAPI(query);
            this.displaySearchResults(results);
            
        } catch (error) {
            this.debugLog(`Error in stock search: ${error.message}`, 'error');
            // Fallback to popular stocks search
            const fallbackResults = this.searchFromPopularStocks(query);
            this.displaySearchResults(fallbackResults);
        }
    }

    // Legacy search method - now just redirects to popular stocks search
    searchStocks(query) {
        return this.searchFromPopularStocks(query);
    }

    displaySearchResults(results) {
        try {
            const searchResults = document.getElementById('searchResults');
            if (!searchResults) return;
            
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-empty">No stocks found matching your search</div>';
                this.debugLog('No search results found', 'info');
                return;
            }
            
            searchResults.innerHTML = results.map(stock => `
                <div class="search-result-item" data-symbol="${stock.symbol}" tabindex="0">
                    <div class="result-symbol">${stock.symbol}</div>
                    <div class="result-name">${stock.name}</div>
                    <div class="result-sector">${stock.sector}${stock.exchange ? ` • ${stock.exchange}` : ''}</div>
                </div>
            `).join('');
            
            // Add event listeners to search results
            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const symbol = item.dataset.symbol;
                    this.debugLog(`Search result clicked: ${symbol}`, 'info');
                    this.addStockToWatchlist(symbol);
                    this.hideSearchResults();
                    document.getElementById('stockSearch').value = '';
                });
                
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const symbol = item.dataset.symbol;
                        this.debugLog(`Search result selected via Enter: ${symbol}`, 'info');
                        this.addStockToWatchlist(symbol);
                        this.hideSearchResults();
                        document.getElementById('stockSearch').value = '';
                    }
                });
            });
            
            searchResults.style.display = 'block';
            this.debugLog(`✅ Displayed ${results.length} search results`, 'success');
        } catch (error) {
            this.debugLog(`Error displaying search results: ${error.message}`, 'error');
        }
    }

    hideSearchResults() {
        try {
            const searchResults = document.getElementById('searchResults');
            if (searchResults) {
                searchResults.style.display = 'none';
            }
        } catch (error) {
            this.debugLog(`Error hiding search results: ${error.message}`, 'error');
        }
    }

    navigateSearchResults(down, items) {
        try {
            if (items.length === 0) return;
            
            const focused = document.activeElement;
            const currentIndex = Array.from(items).indexOf(focused);
            
            let newIndex;
            if (currentIndex === -1) {
                newIndex = down ? 0 : items.length - 1;
            } else {
                newIndex = down 
                    ? (currentIndex + 1) % items.length 
                    : (currentIndex - 1 + items.length) % items.length;
            }
            
            items[newIndex].focus();
        } catch (error) {
            this.debugLog(`Error navigating search results: ${error.message}`, 'error');
        }
    }

    async addStockToWatchlist(symbol) {
        try {
            this.debugLog(`Attempting to add stock ${symbol} to watchlist`, 'info');
            
            if (!this.activeWatchlist) {
                this.showToast('Please create or select a watchlist first', 'error');
                this.debugLog('Cannot add stock: No active watchlist', 'error');
                return;
            }
            
            const watchlist = this.watchlists[this.activeWatchlist];
            
            if (watchlist.stocks.includes(symbol)) {
                this.showToast('Stock already in watchlist', 'warning');
                this.debugLog(`Stock ${symbol} already in watchlist`, 'warning');
                return;
            }
            
            // Show loading
            this.showToast('Adding stock...', 'info');
            
            // Fetch real stock data
            const stockData = await this.fetchStockData([symbol]);
            
            if (!stockData[symbol]) {
                this.showToast('Unable to fetch stock data', 'error');
                this.debugLog(`Stock ${symbol} data not available from API`, 'error');
                return;
            }
            
            // Add to stockDatabase if not already present
            const existingStock = this.stockDatabase.find(s => s.symbol === symbol);
            if (!existingStock) {
                this.stockDatabase.push(stockData[symbol]);
            } else {
                // Update existing stock data
                Object.assign(existingStock, stockData[symbol]);
            }
            
            watchlist.stocks.push(symbol);
            this.updateStocksDisplay();
            this.updateAnalysisSection();
            
            const stock = stockData[symbol];
            this.showToast(`${stock.name} added to "${this.activeWatchlist}"!`, 'success');
            this.debugLog(`✅ Stock ${symbol} added successfully. Watchlist now has ${watchlist.stocks.length} stocks`, 'success');
        } catch (error) {
            this.debugLog(`❌ Error adding stock to watchlist: ${error.message}`, 'error');
            this.showToast('Error adding stock to watchlist', 'error');
        }
    }

    confirmDeleteWatchlist() {
        try {
            if (!this.activeWatchlist) {
                this.debugLog('No active watchlist to delete', 'warning');
                return;
            }
            
            this.debugLog(`Confirming deletion of watchlist: "${this.activeWatchlist}"`, 'info');
            
            const modal = document.getElementById('confirmationModal');
            document.getElementById('confirmationTitle').textContent = 'Delete Watchlist';
            document.getElementById('confirmationMessage').textContent = 
                `Are you sure you want to delete the watchlist "${this.activeWatchlist}"? This action cannot be undone.`;
            
            modal.classList.add('show');
            modal.style.display = 'flex';
            this.pendingAction = { type: 'deleteWatchlist', watchlist: this.activeWatchlist };
        } catch (error) {
            this.debugLog(`Error showing delete confirmation: ${error.message}`, 'error');
        }
    }

    deleteWatchlist(name) {
        try {
            this.debugLog(`Deleting watchlist: "${name}"`, 'info');
            
            delete this.watchlists[name];
            
            if (this.activeWatchlist === name) {
                // Set to first available watchlist or null
                const remainingWatchlists = Object.keys(this.watchlists);
                this.activeWatchlist = remainingWatchlists.length > 0 ? remainingWatchlists[0] : null;
                this.debugLog(`Active watchlist set to: ${this.activeWatchlist || 'none'}`, 'info');
            }
            
            this.updateUI();
            this.showToast(`Watchlist "${name}" deleted successfully!`, 'success');
            this.debugLog(`✅ Watchlist deleted. Remaining: ${Object.keys(this.watchlists).length}`, 'success');
        } catch (error) {
            this.debugLog(`Error deleting watchlist: ${error.message}`, 'error');
        }
    }

    hideConfirmationModal() {
        try {
            const modal = document.getElementById('confirmationModal');
            if (modal) {
                modal.classList.remove('show');
                modal.style.display = 'none';
                this.pendingAction = null;
            }
        } catch (error) {
            this.debugLog(`Error hiding confirmation modal: ${error.message}`, 'error');
        }
    }

    handleConfirmationConfirm() {
        try {
            if (this.pendingAction?.type === 'deleteWatchlist') {
                this.deleteWatchlist(this.pendingAction.watchlist);
            } else if (this.pendingAction?.type === 'removeStock') {
                this.removeStockFromWatchlist(this.pendingAction.symbol);
            }
            this.hideConfirmationModal();
        } catch (error) {
            this.debugLog(`Error in confirmation confirm: ${error.message}`, 'error');
        }
    }

    confirmRemoveStock(symbol) {
        try {
            const stock = this.stockDatabase.find(s => s.symbol === symbol);
            const modal = document.getElementById('confirmationModal');
            
            document.getElementById('confirmationTitle').textContent = 'Remove Stock';
            document.getElementById('confirmationMessage').textContent = 
                `Are you sure you want to remove ${stock?.name || symbol} from this watchlist?`;
            
            modal.classList.add('show');
            modal.style.display = 'flex';
            this.pendingAction = { type: 'removeStock', symbol: symbol };
            
            this.debugLog(`Confirming removal of stock: ${symbol}`, 'info');
        } catch (error) {
            this.debugLog(`Error showing remove stock confirmation: ${error.message}`, 'error');
        }
    }

    removeStockFromWatchlist(symbol) {
        try {
            if (!this.activeWatchlist) return;
            
            const watchlist = this.watchlists[this.activeWatchlist];
            const index = watchlist.stocks.indexOf(symbol);
            
            if (index > -1) {
                watchlist.stocks.splice(index, 1);
                this.updateStocksDisplay();
                this.updateAnalysisSection();
                
                const stock = this.stockDatabase.find(s => s.symbol === symbol);
                this.showToast(`${stock?.name || symbol} removed from watchlist!`, 'success');
                this.debugLog(`Stock ${symbol} removed. Watchlist now has ${watchlist.stocks.length} stocks`, 'success');
            }
        } catch (error) {
            this.debugLog(`Error removing stock from watchlist: ${error.message}`, 'error');
        }
    }

    async refreshWatchlistData() {
        try {
            if (!this.activeWatchlist || !this.watchlists[this.activeWatchlist]) return;
            
            const symbols = this.watchlists[this.activeWatchlist].stocks;
            if (symbols.length === 0) return;
            
            this.debugLog(`Refreshing data for ${symbols.length} stocks...`, 'info');
            
            // Fetch fresh data for all stocks in watchlist
            const freshData = await this.fetchStockData(symbols);
            let updatedCount = 0;
            
            symbols.forEach(symbol => {
                const existingStock = this.stockDatabase.find(s => s.symbol === symbol);
                if (existingStock && freshData[symbol]) {
                    Object.assign(existingStock, freshData[symbol]);
                    updatedCount++;
                }
            });
            
            this.updateStocksDisplay();
            this.updateLastUpdated();
            this.debugLog(`✅ Refreshed data for ${updatedCount} stocks`, 'success');
        } catch (error) {
            this.debugLog(`Error refreshing watchlist data: ${error.message}`, 'error');
        }
    }

    // UI Update Methods
    updateUI() {
        try {
            this.debugLog('Updating UI...', 'info');
            this.updateWatchlistSelector();
            this.updateWatchlistContent();
            this.updateStocksDisplay();
            this.updateAnalysisSection();
            this.debugLog('✅ UI update completed', 'success');
        } catch (error) {
            this.debugLog(`Error updating UI: ${error.message}`, 'error');
        }
    }

    updateWatchlistSelector() {
        try {
            const selector = document.getElementById('watchlistSelector');
            const deleteBtn = document.getElementById('deleteWatchlistBtn');
            
            if (!selector) return;
            
            selector.innerHTML = '<option value="">Select a watchlist</option>';
            
            Object.keys(this.watchlists).forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = `${name} (${this.watchlists[name].stocks.length} stocks)`;
                if (name === this.activeWatchlist) {
                    option.selected = true;
                }
                selector.appendChild(option);
            });
            
            if (deleteBtn) {
                deleteBtn.disabled = !this.activeWatchlist;
            }
            
            this.debugLog('Watchlist selector updated', 'success');
        } catch (error) {
            this.debugLog(`Error updating watchlist selector: ${error.message}`, 'error');
        }
    }

    updateWatchlistContent() {
        try {
            const emptyState = document.getElementById('emptyState');
            const watchlistContent = document.getElementById('watchlistContent');
            
            if (!emptyState || !watchlistContent) return;
            
            if (!this.activeWatchlist) {
                emptyState.style.display = 'block';
                watchlistContent.style.display = 'none';
                this.debugLog('Showing empty state', 'info');
            } else {
                emptyState.style.display = 'none';
                watchlistContent.style.display = 'block';
                const nameEl = document.getElementById('activeWatchlistName');
                if (nameEl) {
                    nameEl.textContent = this.activeWatchlist;
                }
                this.debugLog(`Showing watchlist content for: ${this.activeWatchlist}`, 'info');
            }
        } catch (error) {
            this.debugLog(`Error updating watchlist content: ${error.message}`, 'error');
        }
    }

    updateStocksDisplay() {
        try {
            if (!this.activeWatchlist) return;
            
            const stocksGrid = document.getElementById('stocksGrid');
            const watchlist = this.watchlists[this.activeWatchlist];
            
            if (!stocksGrid || !watchlist) return;
            
            if (watchlist.stocks.length === 0) {
                stocksGrid.innerHTML = `
                    <div class="empty-state-content" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                        <h4 style="color: var(--color-text-secondary); margin-bottom: 1rem;">No stocks in this watchlist</h4>
                        <p style="color: var(--color-text-secondary);">Use the search bar above to add stocks to your watchlist.</p>
                    </div>
                `;
                this.debugLog('Showing empty stocks state', 'info');
                return;
            }
            
            stocksGrid.innerHTML = watchlist.stocks.map(symbol => {
                const stock = this.stockDatabase.find(s => s.symbol === symbol);
                if (!stock) return '';
                
                const marketCapClass = this.getMarketCapClass(stock.market_cap);
                
                return `
                    <div class="stock-card">
                        <div class="stock-header">
                            <div class="stock-info">
                                <h4>${stock.name}</h4>
                                <div class="stock-symbol">${stock.symbol}</div>
                            </div>
                            <button class="remove-stock" onclick="app.confirmRemoveStock('${stock.symbol}')" title="Remove from watchlist">
                                ✕
                            </button>
                        </div>
                        
                        <div class="stock-price">₹${stock.price.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                        
                        <div class="stock-change">
                            <span class="change-amount ${stock.change >= 0 ? 'positive' : 'negative'}">
                                ${stock.change >= 0 ? '+' : ''}₹${Math.abs(stock.change).toFixed(2)}
                            </span>
                            <span class="change-percent ${stock.change_percent >= 0 ? 'positive' : 'negative'}">
                                ${stock.change_percent >= 0 ? '+' : ''}${stock.change_percent.toFixed(2)}%
                            </span>
                        </div>
                        
                        <div class="stock-metrics">
                            <div class="metric-item">
                                <span class="metric-label">Market Cap</span>
                                <span class="metric-value">
                                    ₹${(stock.market_cap / 10000).toFixed(0)}K Cr
                                    <span class="market-cap-badge ${marketCapClass}">
                                        ${this.getMarketCapLabel(stock.market_cap)}
                                    </span>
                                </span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">P/E Ratio</span>
                                <span class="metric-value">${stock.pe_ratio}</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">ROE</span>
                                <span class="metric-value">${stock.roe}%</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Dividend</span>
                                <span class="metric-value">${stock.dividend_yield}%</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            this.updateLastUpdated();
            this.debugLog(`✅ Updated display for ${watchlist.stocks.length} stocks`, 'success');
        } catch (error) {
            this.debugLog(`Error updating stocks display: ${error.message}`, 'error');
        }
    }

    getMarketCapClass(marketCap) {
        if (marketCap >= 1000000) return 'market-cap-large';
        if (marketCap >= 50000) return 'market-cap-mid';
        return 'market-cap-small';
    }

    getMarketCapLabel(marketCap) {
        if (marketCap >= 1000000) return 'Large';
        if (marketCap >= 50000) return 'Mid';
        return 'Small';
    }

    updateAnalysisSection() {
        try {
            if (!this.activeWatchlist) return;
            
            const watchlist = this.watchlists[this.activeWatchlist];
            if (!watchlist || watchlist.stocks.length === 0) {
                // Clear analysis sections when no stocks
                const technicalAnalysis = document.getElementById('technicalAnalysis');
                const fundamentalAnalysis = document.getElementById('fundamentalAnalysis');
                
                if (technicalAnalysis) {
                    technicalAnalysis.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 2rem;">Add stocks to see technical analysis</p>';
                }
                if (fundamentalAnalysis) {
                    fundamentalAnalysis.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 2rem;">Add stocks to see fundamental analysis</p>';
                }
                return;
            }
            
            this.updateTechnicalAnalysis(watchlist.stocks);
            this.updateFundamentalAnalysis(watchlist.stocks);
            this.debugLog('Analysis sections updated', 'success');
        } catch (error) {
            this.debugLog(`Error updating analysis section: ${error.message}`, 'error');
        }
    }

    updateTechnicalAnalysis(symbols) {
        try {
            const technicalAnalysis = document.getElementById('technicalAnalysis');
            if (!technicalAnalysis) return;
            
            const analysisData = symbols.map(symbol => {
                const stock = this.stockDatabase.find(s => s.symbol === symbol);
                if (!stock) return null;
                
                // Mock RSI calculation
                const rsi = Math.random() * 100;
                let rsiClass = 'rsi-neutral';
                let rsiLabel = 'Neutral';
                
                if (rsi < 30) {
                    rsiClass = 'rsi-oversold';
                    rsiLabel = 'Oversold';
                } else if (rsi > 70) {
                    rsiClass = 'rsi-overbought';
                    rsiLabel = 'Overbought';
                }
                
                // Mock MACD
                const macdSignals = ['bullish', 'bearish', 'neutral'];
                const macdSignal = macdSignals[Math.floor(Math.random() * macdSignals.length)];
                
                return {
                    symbol: stock.symbol,
                    name: stock.name.split(' ')[0],
                    rsi: rsi.toFixed(1),
                    rsiClass,
                    rsiLabel,
                    macd: macdSignal,
                    macdClass: `macd-${macdSignal}`
                };
            }).filter(Boolean);
            
            technicalAnalysis.innerHTML = `
                <div class="analysis-grid">
                    ${analysisData.map(data => `
                        <div class="analysis-item">
                            <div class="analysis-label">${data.name} RSI</div>
                            <div class="analysis-value ${data.rsiClass}">${data.rsi}</div>
                            <div class="analysis-label" style="margin-top: 8px;">MACD</div>
                            <div class="analysis-value ${data.macdClass}">${data.macd.toUpperCase()}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            this.debugLog(`Error updating technical analysis: ${error.message}`, 'error');
        }
    }

    updateFundamentalAnalysis(symbols) {
        try {
            const fundamentalAnalysis = document.getElementById('fundamentalAnalysis');
            if (!fundamentalAnalysis) return;
            
            if (symbols.length === 0) return;
            
            // Calculate portfolio averages
            const stocks = symbols.map(symbol => 
                this.stockDatabase.find(s => s.symbol === symbol)
            ).filter(Boolean);
            
            const avgPE = (stocks.reduce((sum, stock) => sum + stock.pe_ratio, 0) / stocks.length).toFixed(1);
            const avgROE = (stocks.reduce((sum, stock) => sum + stock.roe, 0) / stocks.length).toFixed(1);
            const avgDividend = (stocks.reduce((sum, stock) => sum + stock.dividend_yield, 0) / stocks.length).toFixed(2);
            const totalMarketCap = stocks.reduce((sum, stock) => sum + stock.market_cap, 0);
            
            fundamentalAnalysis.innerHTML = `
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <div class="analysis-label">Portfolio Avg P/E</div>
                        <div class="analysis-value">${avgPE}</div>
                    </div>
                    <div class="analysis-item">
                        <div class="analysis-label">Portfolio Avg ROE</div>
                        <div class="analysis-value">${avgROE}%</div>
                    </div>
                    <div class="analysis-item">
                        <div class="analysis-label">Portfolio Avg Dividend</div>
                        <div class="analysis-value">${avgDividend}%</div>
                    </div>
                    <div class="analysis-item">
                        <div class="analysis-label">Total Market Cap</div>
                        <div class="analysis-value">₹${(totalMarketCap / 10000).toFixed(0)}K Cr</div>
                    </div>
                </div>
                <div style="margin-top: 1rem;">
                    <h4 style="margin-bottom: 0.5rem;">Sector Distribution</h4>
                    <div class="analysis-grid">
                        ${this.getSectorDistribution(stocks).map(sector => `
                            <div class="analysis-item">
                                <div class="analysis-label">${sector.name}</div>
                                <div class="analysis-value">${sector.count} stock${sector.count !== 1 ? 's' : ''}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            this.debugLog(`Error updating fundamental analysis: ${error.message}`, 'error');
        }
    }

    getSectorDistribution(stocks) {
        try {
            const sectorCount = {};
            stocks.forEach(stock => {
                sectorCount[stock.sector] = (sectorCount[stock.sector] || 0) + 1;
            });
            
            return Object.entries(sectorCount)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count);
        } catch (error) {
            this.debugLog(`Error calculating sector distribution: ${error.message}`, 'error');
            return [];
        }
    }

    updateLastUpdated() {
        try {
            const lastUpdatedEl = document.getElementById('lastUpdated');
            if (lastUpdatedEl) {
                lastUpdatedEl.textContent = new Date().toLocaleTimeString('en-IN');
            }
        } catch (error) {
            this.debugLog(`Error updating last updated time: ${error.message}`, 'error');
        }
    }

    // Utility Methods
    async refreshData() {
        try {
            this.debugLog('Refreshing all data...', 'info');
            this.showLoadingOverlay();
            
            // Refresh market indices
            await this.loadMarketIndices();
            
            // Refresh watchlist data
            await this.refreshWatchlistData();
            
            this.hideLoadingOverlay();
            this.showToast('Data refreshed successfully!', 'success');
            this.debugLog('✅ Data refresh completed', 'success');
        } catch (error) {
            this.debugLog(`❌ Error refreshing data: ${error.message}`, 'error');
            this.hideLoadingOverlay();
            this.showToast('Error refreshing data', 'error');
        }
    }

    showToast(message, type = 'success') {
        try {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            
            if (!toast || !toastMessage) {
                this.debugLog(`Toast elements not found`, 'warning');
                return;
            }
            
            toastMessage.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
            
            this.debugLog(`Toast shown: ${message} (${type})`, 'info');
        } catch (error) {
            this.debugLog(`Error showing toast: ${error.message}`, 'error');
        }
    }

    showLoadingOverlay() {
        try {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.add('show');
                overlay.style.display = 'flex';
            }
        } catch (error) {
            this.debugLog(`Error showing loading overlay: ${error.message}`, 'error');
        }
    }

    hideLoadingOverlay() {
        try {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.remove('show');
                overlay.style.display = 'none';
            }
        } catch (error) {
            this.debugLog(`Error hiding loading overlay: ${error.message}`, 'error');
        }
    }

    showFormError(elementId, message) {
        try {
            const errorEl = document.getElementById(elementId);
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.style.display = 'block';
                this.debugLog(`Form error shown: ${message}`, 'error');
            }
        } catch (error) {
            this.debugLog(`Error showing form error: ${error.message}`, 'error');
        }
    }

    clearFormError(elementId) {
        try {
            const errorEl = document.getElementById(elementId);
            if (errorEl) {
                errorEl.style.display = 'none';
                errorEl.textContent = '';
            }
        } catch (error) {
            this.debugLog(`Error clearing form error: ${error.message}`, 'error');
        }
    }
}

// Global app instance for onclick handlers
let app;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 DOM loaded, initializing Stock Watchlist Application...');
        app = new StockWatchlistApp();
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        
        // Show error message to user
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; background: var(--color-surface); border-radius: var(--radius-lg); margin: 2rem auto; max-width: 600px;">
                    <h2 style="color: var(--color-error); margin-bottom: 1rem;">⚠️ Application Error</h2>
                    <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">There was an error initializing the application. Please refresh the page to try again.</p>
                    <button onclick="window.location.reload()" class="btn btn--primary">Refresh Page</button>
                    <details style="margin-top: 1rem; text-align: left;">
                        <summary style="cursor: pointer; color: var(--color-text-secondary);">Technical Details</summary>
                        <pre style="background: var(--color-secondary); padding: 1rem; border-radius: var(--radius-sm); margin-top: 0.5rem; font-size: 12px; overflow: auto;">${error.message}\n\n${error.stack}</pre>
                    </details>
                </div>
            `;
        }
    }
});