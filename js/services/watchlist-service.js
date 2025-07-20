/**
 * Watchlist management service
 */
import { Storage } from '../utils/helpers.js';
import { debugLogger } from '../utils/debug.js';

export class WatchlistService {
    constructor() {
        this.watchlists = Storage.get('watchlists', []);
        this.activeWatchlistId = Storage.get('activeWatchlistId', null);
    }

    /**
     * Get all watchlists
     */
    getAllWatchlists() {
        return this.watchlists;
    }

    /**
     * Get watchlist by ID
     */
    getWatchlistById(id) {
        return this.watchlists.find(watchlist => watchlist.id === id);
    }

    /**
     * Get active watchlist
     */
    getActiveWatchlist() {
        if (!this.activeWatchlistId) return null;
        return this.getWatchlistById(this.activeWatchlistId);
    }

    /**
     * Create new watchlist
     */
    createWatchlist(name) {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new Error('Watchlist name is required');
        }

        const trimmedName = name.trim();
        
        // Check for duplicate names
        if (this.watchlists.some(w => w.name.toLowerCase() === trimmedName.toLowerCase())) {
            throw new Error('A watchlist with this name already exists');
        }

        const newWatchlist = {
            id: this.generateId(),
            name: trimmedName,
            stocks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.watchlists.push(newWatchlist);
        this.saveWatchlists();
        
        debugLogger.success(`Created watchlist: ${trimmedName}`);
        return newWatchlist;
    }

    /**
     * Update watchlist
     */
    updateWatchlist(id, updates) {
        const watchlist = this.getWatchlistById(id);
        if (!watchlist) {
            throw new Error('Watchlist not found');
        }

        // Validate name if being updated
        if (updates.name) {
            const trimmedName = updates.name.trim();
            if (!trimmedName) {
                throw new Error('Watchlist name cannot be empty');
            }
            
            // Check for duplicate names (excluding current watchlist)
            if (this.watchlists.some(w => w.id !== id && w.name.toLowerCase() === trimmedName.toLowerCase())) {
                throw new Error('A watchlist with this name already exists');
            }
            updates.name = trimmedName;
        }

        Object.assign(watchlist, updates, { updatedAt: new Date().toISOString() });
        this.saveWatchlists();
        
        debugLogger.info(`Updated watchlist: ${watchlist.name}`);
        return watchlist;
    }

    /**
     * Delete watchlist
     */
    deleteWatchlist(id) {
        const index = this.watchlists.findIndex(w => w.id === id);
        if (index === -1) {
            throw new Error('Watchlist not found');
        }

        const watchlist = this.watchlists[index];
        this.watchlists.splice(index, 1);
        
        // Clear active watchlist if it was deleted
        if (this.activeWatchlistId === id) {
            this.activeWatchlistId = null;
            Storage.remove('activeWatchlistId');
        }
        
        this.saveWatchlists();
        debugLogger.info(`Deleted watchlist: ${watchlist.name}`);
        return true;
    }

    /**
     * Set active watchlist
     */
    setActiveWatchlist(id) {
        if (id && !this.getWatchlistById(id)) {
            throw new Error('Watchlist not found');
        }

        this.activeWatchlistId = id;
        Storage.set('activeWatchlistId', id);
        
        if (id) {
            const watchlist = this.getWatchlistById(id);
            debugLogger.info(`Set active watchlist: ${watchlist.name}`);
        } else {
            debugLogger.info('Cleared active watchlist');
        }
    }

    /**
     * Add stock to watchlist
     */
    addStockToWatchlist(watchlistId, stockSymbol) {
        const watchlist = this.getWatchlistById(watchlistId);
        if (!watchlist) {
            throw new Error('Watchlist not found');
        }

        if (!stockSymbol || typeof stockSymbol !== 'string') {
            throw new Error('Invalid stock symbol');
        }

        const symbol = stockSymbol.trim().toUpperCase();
        
        // Check if stock already exists in watchlist
        if (watchlist.stocks.some(stock => stock.symbol === symbol)) {
            throw new Error('Stock already exists in this watchlist');
        }

        const stockEntry = {
            symbol,
            addedAt: new Date().toISOString()
        };

        watchlist.stocks.push(stockEntry);
        watchlist.updatedAt = new Date().toISOString();
        this.saveWatchlists();
        
        debugLogger.success(`Added ${symbol} to watchlist: ${watchlist.name}`);
        return stockEntry;
    }

    /**
     * Remove stock from watchlist
     */
    removeStockFromWatchlist(watchlistId, stockSymbol) {
        const watchlist = this.getWatchlistById(watchlistId);
        if (!watchlist) {
            throw new Error('Watchlist not found');
        }

        const symbol = stockSymbol.trim().toUpperCase();
        const index = watchlist.stocks.findIndex(stock => stock.symbol === symbol);
        
        if (index === -1) {
            throw new Error('Stock not found in watchlist');
        }

        watchlist.stocks.splice(index, 1);
        watchlist.updatedAt = new Date().toISOString();
        this.saveWatchlists();
        
        debugLogger.info(`Removed ${symbol} from watchlist: ${watchlist.name}`);
        return true;
    }

    /**
     * Get stocks in watchlist
     */
    getWatchlistStocks(watchlistId) {
        const watchlist = this.getWatchlistById(watchlistId);
        if (!watchlist) {
            throw new Error('Watchlist not found');
        }
        return watchlist.stocks;
    }

    /**
     * Save watchlists to localStorage
     */
    saveWatchlists() {
        try {
            Storage.set('watchlists', this.watchlists);
            return true;
        } catch (error) {
            debugLogger.error('Failed to save watchlists to localStorage', error);
            throw new Error('Failed to save watchlists');
        }
    }

    /**
     * Import watchlists from JSON
     */
    importWatchlists(jsonData) {
        try {
            const importedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            if (!Array.isArray(importedData)) {
                throw new Error('Invalid data format');
            }

            // Validate structure
            for (const watchlist of importedData) {
                if (!watchlist.id || !watchlist.name || !Array.isArray(watchlist.stocks)) {
                    throw new Error('Invalid watchlist structure');
                }
            }

            this.watchlists = importedData;
            this.saveWatchlists();
            
            debugLogger.success(`Imported ${importedData.length} watchlists`);
            return true;
        } catch (error) {
            debugLogger.error('Failed to import watchlists', error);
            throw new Error('Failed to import watchlists: ' + error.message);
        }
    }

    /**
     * Export watchlists to JSON
     */
    exportWatchlists() {
        try {
            const exportData = {
                watchlists: this.watchlists,
                exportedAt: new Date().toISOString(),
                version: '1.0'
            };
            
            debugLogger.info('Exported watchlists data');
            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            debugLogger.error('Failed to export watchlists', error);
            throw new Error('Failed to export watchlists');
        }
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Get watchlist statistics
     */
    getWatchlistStats(watchlistId) {
        const watchlist = this.getWatchlistById(watchlistId);
        if (!watchlist) {
            throw new Error('Watchlist not found');
        }

        return {
            stockCount: watchlist.stocks.length,
            createdAt: watchlist.createdAt,
            updatedAt: watchlist.updatedAt,
            oldestStock: watchlist.stocks.length > 0 ? 
                watchlist.stocks.reduce((oldest, stock) => 
                    new Date(stock.addedAt) < new Date(oldest.addedAt) ? stock : oldest
                ) : null,
            newestStock: watchlist.stocks.length > 0 ? 
                watchlist.stocks.reduce((newest, stock) => 
                    new Date(stock.addedAt) > new Date(newest.addedAt) ? stock : newest
                ) : null
        };
    }

    /**
     * Search stocks within all watchlists
     */
    searchStocksInWatchlists(query) {
        if (!query || typeof query !== 'string') return [];
        
        const results = [];
        const searchTerm = query.toLowerCase();
        
        for (const watchlist of this.watchlists) {
            for (const stock of watchlist.stocks) {
                if (stock.symbol.toLowerCase().includes(searchTerm)) {
                    results.push({
                        ...stock,
                        watchlistId: watchlist.id,
                        watchlistName: watchlist.name
                    });
                }
            }
        }
        
        return results;
    }
}
