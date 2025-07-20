/**
 * API Configuration for Yahoo Finance Integration
 */
export const API_CONFIG = {
    // Primary Yahoo Finance API endpoints
    baseUrl: 'https://query1.finance.yahoo.com/v8/finance/chart/',
    quotesUrl: 'https://query1.finance.yahoo.com/v8/finance/chart/',
    searchUrl: 'https://query1.finance.yahoo.com/v1/finance/search?q=',
    
    // CORS proxy alternatives (tried in order)
    corsProxies: [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/'
    ],
    
    // Cache settings
    cacheTimeout: 60000, // 1 minute
    
    // Request settings
    requestTimeout: 10000, // 10 seconds
    
    // Popular Indian stocks for fallback search
    popularStocks: [
        { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd' },
        { symbol: 'TCS.NS', name: 'Tata Consultancy Services Ltd' },
        { symbol: 'INFY.NS', name: 'Infosys Ltd' },
        { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd' },
        { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd' },
        { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd' },
        { symbol: 'ITC.NS', name: 'ITC Ltd' },
        { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank Ltd' },
        { symbol: 'LT.NS', name: 'Larsen & Toubro Ltd' },
        { symbol: 'ASIANPAINT.NS', name: 'Asian Paints Ltd' },
        { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India Ltd' },
        { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance Ltd' },
        { symbol: 'TITAN.NS', name: 'Titan Company Ltd' },
        { symbol: 'WIPRO.NS', name: 'Wipro Ltd' },
        { symbol: 'TECHM.NS', name: 'Tech Mahindra Ltd' }
    ],
    
    // Market indices configuration
    marketIndices: [
        { symbol: '^NSEI', name: 'NIFTY 50' },
        { symbol: '^BSESN', name: 'SENSEX' },
        { symbol: '^NSEBANK', name: 'BANK NIFTY' }
    ]
};
