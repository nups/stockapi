/**
 * API service for Yahoo Finance integration with CORS handling
 */
import { API_CONFIG } from '../config/api.js';
import { debugLogger } from '../utils/debug.js';

export class ApiService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = API_CONFIG.cacheTimeout;
    }

    /**
     * Fetch data with caching and CORS proxy fallback
     */
    async fetchWithCache(url, cacheKey) {
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                debugLogger.debug(`Cache hit for ${cacheKey}`);
                return cached.data;
            } else {
                this.cache.delete(cacheKey);
            }
        }

        debugLogger.info(`Fetching data for ${cacheKey}`);
        
        // Try direct fetch first
        try {
            const response = await this.fetchWithTimeout(url);
            if (response.ok) {
                const data = await response.json();
                this.cache.set(cacheKey, { data, timestamp: Date.now() });
                debugLogger.success(`Direct fetch successful for ${cacheKey}`);
                return data;
            }
        } catch (error) {
            debugLogger.warning(`Direct fetch failed for ${cacheKey}: ${error.message}`);
        }

        // Try CORS proxies
        for (const proxy of API_CONFIG.corsProxies) {
            try {
                const proxiedUrl = proxy + encodeURIComponent(url);
                debugLogger.info(`Trying proxy: ${proxy.substring(0, 30)}...`);
                
                const response = await this.fetchWithTimeout(proxiedUrl);
                if (response.ok) {
                    const data = await response.json();
                    this.cache.set(cacheKey, { data, timestamp: Date.now() });
                    debugLogger.success(`Proxy fetch successful with ${proxy.substring(0, 30)}...`);
                    return data;
                }
            } catch (error) {
                debugLogger.warning(`Proxy ${proxy.substring(0, 30)}... failed: ${error.message}`);
                continue;
            }
        }

        throw new Error('All API endpoints failed');
    }

    /**
     * Fetch with timeout
     */
    async fetchWithTimeout(url, timeout = API_CONFIG.requestTimeout) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * Search for stocks
     */
    async searchStocks(query) {
        if (!query || query.length < 2) {
            return API_CONFIG.popularStocks.slice(0, 10);
        }

        try {
            const url = `${API_CONFIG.searchUrl}${encodeURIComponent(query)}`;
            const data = await this.fetchWithCache(url, `search_${query}`);
            
            if (data?.quotes && Array.isArray(data.quotes)) {
                const results = data.quotes
                    .filter(quote => quote.exchange && (quote.exchange.includes('NSE') || quote.exchange.includes('BSE')))
                    .slice(0, 10)
                    .map(quote => ({
                        symbol: quote.symbol,
                        name: quote.longname || quote.shortname || quote.symbol,
                        exchange: quote.exchange
                    }));
                
                debugLogger.success(`Search returned ${results.length} results for "${query}"`);
                return results;
            }
        } catch (error) {
            debugLogger.error(`Stock search failed for "${query}": ${error.message}`);
        }

        // Fallback to popular stocks matching query
        const fallbackResults = API_CONFIG.popularStocks.filter(stock => 
            stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
            stock.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);

        debugLogger.info(`Using fallback search results for "${query}": ${fallbackResults.length} matches`);
        return fallbackResults;
    }

    /**
     * Fetch stock data
     */
    async fetchStockData(symbol) {
        try {
            const url = `${API_CONFIG.quotesUrl}${symbol}`;
            const data = await this.fetchWithCache(url, `stock_${symbol}`);
            
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

                    const stockData = {
                        symbol,
                        name: meta.longName || meta.shortName || symbol,
                        price: parseFloat(currentPrice.toFixed(2)),
                        change: parseFloat(change.toFixed(2)),
                        changePercent: parseFloat(changePercent.toFixed(2)),
                        volume: quotes.volume?.[latestIndex] || 0,
                        high: quotes.high?.[latestIndex] || currentPrice,
                        low: quotes.low?.[latestIndex] || currentPrice,
                        open: quotes.open?.[latestIndex] || currentPrice,
                        previousClose: meta.previousClose || prevPrice,
                        marketCap: meta.marketCap,
                        lastUpdated: new Date(timestamps[latestIndex] * 1000).toISOString()
                    };

                    debugLogger.success(`Fetched data for ${symbol}: ₹${currentPrice}`);
                    return stockData;
                }
            }
        } catch (error) {
            debugLogger.error(`Failed to fetch data for ${symbol}: ${error.message}`);
        }

        // Return mock data as fallback
        debugLogger.warning(`Using mock data for ${symbol}`);
        return this.generateMockStockData(symbol);
    }

    /**
     * Fetch market indices
     */
    async fetchMarketIndices() {
        const results = [];

        for (const index of API_CONFIG.marketIndices) {
            try {
                const url = `${API_CONFIG.quotesUrl}${index.symbol}`;
                let data;
                
                try {
                    data = await this.fetchWithCache(url, `index_${index.symbol}`);
                } catch (apiError) {
                    debugLogger.warning(`Index API failed for ${index.name}, using mock data`);
                    
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
                debugLogger.error(`Error fetching ${index.name}: ${error.message}`);
            }
        }

        // If no real data was fetched, provide default mock data
        if (results.length === 0) {
            debugLogger.warning('No index data available, providing default mock data');
            results.push(
                { name: 'NIFTY 50', value: 24381.10, change: 142.87, change_percent: 0.59 },
                { name: 'SENSEX', value: 80109.85, change: 487.28, change_percent: 0.61 },
                { name: 'BANK NIFTY', value: 51285.32, change: -125.45, change_percent: -0.24 }
            );
        }

        debugLogger.success(`Fetched ${results.length} market indices`);
        return results;
    }

    /**
     * Generate mock stock data for fallback
     */
    generateMockStockData(symbol) {
        const basePrice = 100 + Math.random() * 4900; // Random price between 100-5000
        const change = (Math.random() - 0.5) * 50; // Random change between -25 to +25
        const changePercent = (change / basePrice) * 100;
        
        return {
            symbol,
            name: `${symbol.replace('.NS', '').replace('.BO', '')} Ltd`,
            price: parseFloat(basePrice.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2)),
            volume: Math.floor(Math.random() * 1000000),
            high: parseFloat((basePrice + Math.random() * 10).toFixed(2)),
            low: parseFloat((basePrice - Math.random() * 10).toFixed(2)),
            open: parseFloat((basePrice + (Math.random() - 0.5) * 10).toFixed(2)),
            previousClose: parseFloat((basePrice - change).toFixed(2)),
            marketCap: Math.floor(Math.random() * 1000000000000),
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        debugLogger.info('API cache cleared');
    }
}
