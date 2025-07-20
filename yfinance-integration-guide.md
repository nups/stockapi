# yfinance Integration Guide for Watchlist App

## Overview
This guide explains how to replace the mock data in the watchlist application with real yfinance API calls to fetch live Indian stock market data.

## Prerequisites
```bash
pip install yfinance
pip install flask
pip install flask-cors
```

## Backend Integration (Python Flask)

### 1. Create Flask API Server

```python
# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import time
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Cache to prevent excessive API calls
stock_cache = {}
cache_timeout = 300  # 5 minutes

def get_stock_data(symbols):
    """Fetch stock data for multiple symbols efficiently"""
    result = {}
    current_time = time.time()
    
    # Filter symbols that need fresh data
    symbols_to_fetch = []
    for symbol in symbols:
        if symbol in stock_cache:
            cached_time, cached_data = stock_cache[symbol]
            if current_time - cached_time < cache_timeout:
                result[symbol] = cached_data
                continue
        symbols_to_fetch.append(symbol)
    
    # Fetch fresh data in batch
    if symbols_to_fetch:
        try:
            # Use yfinance to download multiple symbols at once
            tickers_data = yf.download(' '.join(symbols_to_fetch), 
                                     period='1d', 
                                     group_by='ticker',
                                     progress=False)
            
            for symbol in symbols_to_fetch:
                try:
                    # Get ticker info for fundamental data
                    ticker = yf.Ticker(symbol)
                    info = ticker.info
                    
                    # Get latest price data
                    if len(symbols_to_fetch) == 1:
                        hist_data = tickers_data
                    else:
                        hist_data = tickers_data[symbol] if symbol in tickers_data.columns.get_level_values(0) else None
                    
                    if hist_data is not None and not hist_data.empty:
                        latest = hist_data.iloc[-1]
                        prev_close = hist_data.iloc[-2]['Close'] if len(hist_data) > 1 else latest['Close']
                        
                        stock_data = {
                            'symbol': symbol,
                            'name': info.get('shortName', symbol.replace('.NS', '').replace('.BO', '')),
                            'sector': info.get('sector', 'Unknown'),
                            'price': round(latest['Close'], 2),
                            'change': round(latest['Close'] - prev_close, 2),
                            'change_percent': round(((latest['Close'] - prev_close) / prev_close) * 100, 2),
                            'market_cap': info.get('marketCap', 0) // 10000000,  # Convert to crores
                            'pe_ratio': round(info.get('trailingPE', 0), 2) if info.get('trailingPE') else 0,
                            'pb_ratio': round(info.get('priceToBook', 0), 2) if info.get('priceToBook') else 0,
                            'roe': round(info.get('returnOnEquity', 0) * 100, 2) if info.get('returnOnEquity') else 0,
                            'dividend_yield': round(info.get('dividendYield', 0) * 100, 2) if info.get('dividendYield') else 0,
                            'volume': int(latest['Volume']),
                            'high': round(latest['High'], 2),
                            'low': round(latest['Low'], 2),
                            'open': round(latest['Open'], 2)
                        }
                        
                        result[symbol] = stock_data
                        stock_cache[symbol] = (current_time, stock_data)
                        
                except Exception as e:
                    print(f"Error processing {symbol}: {e}")
                    continue
                    
        except Exception as e:
            print(f"Error fetching batch data: {e}")
    
    return result

@app.route('/api/stocks', methods=['POST'])
def get_stocks():
    """Get stock data for multiple symbols"""
    data = request.get_json()
    symbols = data.get('symbols', [])
    
    if not symbols:
        return jsonify({'error': 'No symbols provided'}), 400
    
    try:
        stocks_data = get_stock_data(symbols)
        return jsonify(stocks_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_stocks():
    """Search for Indian stock symbols"""
    query = request.args.get('q', '').upper()
    
    # Predefined list of popular Indian stocks
    indian_stocks = [
        {'symbol': 'RELIANCE.NS', 'name': 'Reliance Industries', 'sector': 'Oil & Gas'},
        {'symbol': 'TCS.NS', 'name': 'Tata Consultancy Services', 'sector': 'IT Services'},
        {'symbol': 'HDFCBANK.NS', 'name': 'HDFC Bank', 'sector': 'Banking'},
        {'symbol': 'ICICIBANK.NS', 'name': 'ICICI Bank', 'sector': 'Banking'},
        {'symbol': 'BHARTIARTL.NS', 'name': 'Bharti Airtel', 'sector': 'Telecom'},
        # Add more stocks as needed
    ]
    
    # Filter stocks based on query
    results = []
    for stock in indian_stocks:
        if query in stock['symbol'] or query in stock['name'].upper():
            results.append(stock)
    
    return jsonify(results[:10])  # Return top 10 matches

@app.route('/api/indices', methods=['GET'])
def get_indices():
    """Get major Indian market indices"""
    indices_symbols = ['^NSEI', '^BSESN', '^NSEBANK']
    
    try:
        indices_data = {}
        for symbol in indices_symbols:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period='2d')
            
            if not hist.empty:
                latest = hist.iloc[-1]
                prev = hist.iloc[-2] if len(hist) > 1 else latest
                
                name_map = {
                    '^NSEI': 'NIFTY 50',
                    '^BSESN': 'SENSEX',
                    '^NSEBANK': 'BANK NIFTY'
                }
                
                indices_data[symbol] = {
                    'name': name_map.get(symbol, symbol),
                    'value': round(latest['Close'], 2),
                    'change': round(latest['Close'] - prev['Close'], 2),
                    'change_percent': round(((latest['Close'] - prev['Close']) / prev['Close']) * 100, 2)
                }
        
        return jsonify(list(indices_data.values()))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

## Frontend Integration

### 2. Update JavaScript to Call Real API

```javascript
// Replace the mock data functions in app.js with real API calls

class StockWatchlistApp {
    constructor() {
        // ... existing code ...
        this.apiBase = 'http://localhost:5000/api';  // Flask server URL
    }

    async fetchStockData(symbols) {
        try {
            const response = await fetch(`${this.apiBase}/stocks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ symbols })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stock data');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching stock data:', error);
            this.showToast('Error fetching stock data', 'error');
            return {};
        }
    }

    async searchStocks(query) {
        try {
            const response = await fetch(`${this.apiBase}/search?q=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error('Search failed');
            }

            const results = await response.json();
            return results;
        } catch (error) {
            console.error('Error searching stocks:', error);
            return [];
        }
    }

    async fetchMarketIndices() {
        try {
            const response = await fetch(`${this.apiBase}/indices`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch indices');
            }

            const indices = await response.json();
            return indices;
        } catch (error) {
            console.error('Error fetching indices:', error);
            return [];
        }
    }

    async updateWatchlistData() {
        if (!this.activeWatchlist || !this.watchlists[this.activeWatchlist]) {
            return;
        }

        const symbols = this.watchlists[this.activeWatchlist].stocks;
        if (symbols.length === 0) {
            this.updateStocksDisplay([]);
            return;
        }

        this.showLoading(true);
        const stocksData = await this.fetchStockData(symbols);
        
        // Convert object to array format
        const stocksArray = symbols.map(symbol => stocksData[symbol]).filter(Boolean);
        
        this.updateStocksDisplay(stocksArray);
        this.showLoading(false);
    }
}
```

## Usage Instructions

### 3. Running the Application

1. **Start the Flask Backend:**
   ```bash
   python app.py
   ```
   This starts the API server on `http://localhost:5000`

2. **Serve the Frontend:**
   ```bash
   # Simple HTTP server
   python -m http.server 8000
   # Or use live-server
   npx live-server --port=8000
   ```
   Open `http://localhost:8000` in your browser

3. **Test the Integration:**
   - Create a new watchlist
   - Search for Indian stocks (e.g., "RELIANCE", "TCS", "HDFC")
   - Add stocks to your watchlist
   - Verify that real market data is displayed

## Rate Limiting Best Practices

### 4. Implement Smart Caching

```python
# In your Flask app, implement intelligent caching
import redis  # Optional: for production

class StockDataManager:
    def __init__(self):
        self.cache = {}
        self.last_batch_fetch = {}
    
    def should_fetch(self, symbols):
        """Determine if we need to fetch fresh data"""
        current_time = time.time()
        
        # Don't fetch more than once per minute for same symbol set
        symbols_key = '|'.join(sorted(symbols))
        if symbols_key in self.last_batch_fetch:
            if current_time - self.last_batch_fetch[symbols_key] < 60:
                return False
        
        return True
    
    def batch_fetch(self, symbols):
        """Fetch data for multiple symbols efficiently"""
        if not self.should_fetch(symbols):
            return self.get_cached_data(symbols)
        
        # Implement yfinance batch fetching
        # ... rest of the implementation
```

## Production Deployment

### 5. Environment Configuration

```python
# config.py
import os

class Config:
    # Use environment variables in production
    API_RATE_LIMIT = int(os.environ.get('API_RATE_LIMIT', 60))  # requests per minute
    CACHE_TIMEOUT = int(os.environ.get('CACHE_TIMEOUT', 300))   # 5 minutes
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379')
    
    # Market hours (IST)
    MARKET_OPEN_HOUR = 9
    MARKET_OPEN_MINUTE = 15
    MARKET_CLOSE_HOUR = 15
    MARKET_CLOSE_MINUTE = 30
```

## Error Handling

### 6. Robust Error Management

```javascript
// In your frontend app.js
async fetchWithRetry(url, options = {}, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            
            if (response.ok) {
                return response;
            }
            
            if (response.status === 429) {  // Rate limited
                await this.delay(attempt * 1000);  // Exponential backoff
                continue;
            }
            
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            await this.delay(attempt * 500);
        }
    }
}

delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

## Summary

This integration guide shows how to:
- Replace mock data with real yfinance API calls
- Implement efficient batching to minimize API requests
- Add proper caching to respect rate limits
- Handle errors gracefully
- Scale to production environments

The watchlist-based approach ensures you only fetch data for stocks users actually want to track, making the application efficient and responsive while staying within API rate limits.