/**
 * Utility functions for the Stock Watchlist App
 */

/**
 * Format price with appropriate currency symbol and decimal places
 * @param {number} price - The price to format
 * @param {string} currency - Currency code (default: INR)
 * @returns {string} Formatted price string
 */
export function formatPrice(price, currency = 'INR') {
    if (typeof price !== 'number' || isNaN(price)) return '₹0.00';
    
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${price.toLocaleString('en-IN', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    })}`;
}

/**
 * Format percentage change with appropriate styling
 * @param {number} change - The percentage change
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(change) {
    if (typeof change !== 'number' || isNaN(change)) return '0.00%';
    
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
}

/**
 * Get CSS class for price change styling
 * @param {number} change - The price or percentage change
 * @returns {string} CSS class name
 */
export function getChangeClass(change) {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
}

/**
 * Format timestamp to readable date/time
 * @param {number|Date} timestamp - Unix timestamp or Date object
 * @returns {string} Formatted date string
 */
export function formatDateTime(timestamp) {
    try {
        const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : new Date(timestamp);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Invalid Date';
    }
}

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID string
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeHtml(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Validate stock symbol format
 * @param {string} symbol - Stock symbol to validate
 * @returns {boolean} True if valid symbol format
 */
export function isValidStockSymbol(symbol) {
    if (!symbol || typeof symbol !== 'string') return false;
    
    // Basic validation for Indian stock symbols
    const symbolPattern = /^[A-Z0-9&.-]+(\.(NS|BO))?$/;
    return symbolPattern.test(symbol.toUpperCase());
}

/**
 * Calculate simple moving average
 * @param {number[]} prices - Array of prices
 * @param {number} period - Period for SMA calculation
 * @returns {number|null} SMA value or null if insufficient data
 */
export function calculateSMA(prices, period) {
    if (!Array.isArray(prices) || prices.length < period) return null;
    
    const relevantPrices = prices.slice(-period);
    const sum = relevantPrices.reduce((acc, price) => acc + price, 0);
    return sum / period;
}

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export function calculatePercentageChange(current, previous) {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

/**
 * Check if market is currently open (Indian market hours)
 * @returns {boolean} True if market is open
 */
export function isMarketOpen() {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    
    const day = istTime.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = istTime.getHours();
    const minute = istTime.getMinutes();
    const timeInMinutes = hour * 60 + minute;
    
    // Market closed on weekends
    if (day === 0 || day === 6) return false;
    
    // Market hours: 9:15 AM to 3:30 PM IST
    const marketOpen = 9 * 60 + 15; // 9:15 AM
    const marketClose = 15 * 60 + 30; // 3:30 PM
    
    return timeInMinutes >= marketOpen && timeInMinutes <= marketClose;
}

/**
 * Storage utilities for localStorage
 */
export const Storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Error reading from localStorage:', error);
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn('Error writing to localStorage:', error);
            return false;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn('Error removing from localStorage:', error);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.warn('Error clearing localStorage:', error);
            return false;
        }
    }
};
