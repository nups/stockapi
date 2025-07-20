/**
 * Main Stock Watchlist Application
 */
import { ApiService } from './services/api-service.js';
import { WatchlistService } from './services/watchlist-service.js';
import { UIComponents } from './components/ui-components.js';
import { debugLogger } from './utils/debug.js';
import { debounce, isMarketOpen } from './utils/helpers.js';

export class StockWatchlistApp {
    constructor() {
        this.apiService = new ApiService();
        this.watchlistService = new WatchlistService();
        this.ui = new UIComponents();
        
        this.searchTimeout = null;
        this.refreshInterval = null;
        this.isInitialized = false;
        
        // Bind methods to preserve context
        this.handleSearch = debounce(this.handleSearch.bind(this), 300);
        this.refreshData = this.refreshData.bind(this);
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            debugLogger.init();
            debugLogger.info('Initializing Stock Watchlist App');
            
            this.setupEventListeners();
            this.setupThemeToggle();
            this.loadWatchlists();
            await this.loadMarketIndices();
            this.updateMarketStatus();
            this.loadActiveWatchlist();
            
            // Start auto-refresh during market hours
            this.startAutoRefresh();
            
            this.isInitialized = true;
            debugLogger.success('App initialized successfully');
            
        } catch (error) {
            debugLogger.error('Failed to initialize app', error);
            this.ui.showToast('Failed to initialize app. Please refresh the page.', 'error');
        }
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Watchlist management
        document.getElementById('createWatchlistBtn')?.addEventListener('click', () => {
            this.showCreateWatchlistModal();
        });
        
        document.getElementById('createFirstWatchlist')?.addEventListener('click', () => {
            this.showCreateWatchlistModal();
        });
        
        document.getElementById('deleteWatchlistBtn')?.addEventListener('click', () => {
            this.deleteActiveWatchlist();
        });
        
        document.getElementById('watchlistSelector')?.addEventListener('change', (e) => {
            this.selectWatchlist(e.target.value);
        });

        // Modal controls
        document.getElementById('modalClose')?.addEventListener('click', () => {
            this.ui.hideModal('modalOverlay');
        });
        
        document.getElementById('modalCancel')?.addEventListener('click', () => {
            this.ui.hideModal('modalOverlay');
        });
        
        document.getElementById('modalConfirm')?.addEventListener('click', () => {
            this.createWatchlist();
        });
        
        document.getElementById('confirmationClose')?.addEventListener('click', () => {
            this.ui.hideModal('confirmationModal');
        });

        // Stock search
        document.getElementById('stockSearch')?.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Refresh button
        document.getElementById('refreshBtn')?.addEventListener('click', () => {
            this.refreshData();
        });

        // Close modals on overlay click
        document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') {
                this.ui.hideModal('modalOverlay');
            }
        });
        
        document.getElementById('confirmationModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'confirmationModal') {
                this.ui.hideModal('confirmationModal');
            }
        });

        // Handle form submission with Enter key
        document.getElementById('watchlistName')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.createWatchlist();
            }
        });

        // Handle search results selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.search-result-item')) {
                this.addStockFromSearch(e.target.closest('.search-result-item'));
            }
            
            if (e.target.closest('.remove-stock')) {
                this.removeStock(e.target.closest('.stock-card'));
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper')) {
                this.clearSearchResults();
            }
        });
    }

    /**
     * Setup theme toggle functionality
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

    /**
     * Load and display all watchlists
     */
    loadWatchlists() {
        const selector = document.getElementById('watchlistSelector');
        if (!selector) return;

        // Clear existing options
        selector.innerHTML = '<option value="">Select a watchlist</option>';
        
        const watchlists = this.watchlistService.getAllWatchlists();
        watchlists.forEach(watchlist => {
            const option = this.ui.createWatchlistOption(watchlist);
            selector.appendChild(option);
        });

        debugLogger.info(`Loaded ${watchlists.length} watchlists`);
    }

    /**
     * Load and display market indices
     */
    async loadMarketIndices() {
        try {
            this.ui.showLoading();
            const indices = await this.apiService.fetchMarketIndices();
            this.displayMarketIndices(indices);
        } catch (error) {
            debugLogger.error('Failed to load market indices', error);
            this.ui.showToast('Failed to load market data', 'error');
        } finally {
            this.ui.hideLoading();
        }
    }

    /**
     * Display market indices
     */
    displayMarketIndices(indices) {
        const container = document.getElementById('indicesGrid');
        if (!container) return;

        container.innerHTML = '';
        
        indices.forEach(index => {
            const card = this.ui.createIndexCard(index);
            this.ui.animateIn(card);
            container.appendChild(card);
        });
    }

    /**
     * Update market status indicator
     */
    updateMarketStatus() {
        const isOpen = isMarketOpen();
        this.ui.updateMarketStatus(isOpen);
        
        // Update market time display
        const marketTime = document.querySelector('.market-time');
        if (marketTime) {
            const now = new Date();
            const istTime = now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
            marketTime.textContent = `Current: ${new Date(istTime).toLocaleTimeString('en-IN')} IST`;
        }
    }

    /**
     * Load active watchlist
     */
    loadActiveWatchlist() {
        const activeWatchlist = this.watchlistService.getActiveWatchlist();
        
        if (activeWatchlist) {
            document.getElementById('watchlistSelector').value = activeWatchlist.id;
            this.displayWatchlist(activeWatchlist);
            this.enableStockSearch();
        } else {
            this.showEmptyState();
            this.disableStockSearch();
        }
    }

    /**
     * Show create watchlist modal
     */
    showCreateWatchlistModal() {
        this.ui.showModal('modalOverlay');
    }

    /**
     * Create new watchlist
     */
    async createWatchlist() {
        const nameInput = document.getElementById('watchlistName');
        const name = nameInput?.value?.trim();

        if (!name) {
            this.ui.showFormError('watchlistName', 'Please enter a watchlist name');
            return;
        }

        try {
            const watchlist = this.watchlistService.createWatchlist(name);
            this.loadWatchlists();
            this.selectWatchlist(watchlist.id);
            this.ui.hideModal('modalOverlay');
            this.ui.showToast(`Created watchlist: ${name}`, 'success');
        } catch (error) {
            this.ui.showFormError('watchlistName', error.message);
            debugLogger.error('Failed to create watchlist', error);
        }
    }

    /**
     * Select and display watchlist
     */
    async selectWatchlist(watchlistId) {
        if (!watchlistId) {
            this.watchlistService.setActiveWatchlist(null);
            this.showEmptyState();
            this.disableStockSearch();
            return;
        }

        try {
            this.watchlistService.setActiveWatchlist(watchlistId);
            const watchlist = this.watchlistService.getActiveWatchlist();
            
            if (watchlist) {
                await this.displayWatchlist(watchlist);
                this.enableStockSearch();
                this.updateDeleteButtonState();
            }
        } catch (error) {
            debugLogger.error('Failed to select watchlist', error);
            this.ui.showToast('Failed to load watchlist', 'error');
        }
    }

    /**
     * Delete active watchlist
     */
    deleteActiveWatchlist() {
        const activeWatchlist = this.watchlistService.getActiveWatchlist();
        if (!activeWatchlist) return;

        this.ui.showConfirmationDialog(
            'Delete Watchlist',
            `Are you sure you want to delete "${activeWatchlist.name}"? This action cannot be undone.`,
            () => {
                try {
                    this.watchlistService.deleteWatchlist(activeWatchlist.id);
                    this.loadWatchlists();
                    this.showEmptyState();
                    this.disableStockSearch();
                    this.ui.showToast(`Deleted watchlist: ${activeWatchlist.name}`, 'success');
                } catch (error) {
                    debugLogger.error('Failed to delete watchlist', error);
                    this.ui.showToast('Failed to delete watchlist', 'error');
                }
            }
        );
    }

    /**
     * Display watchlist stocks
     */
    async displayWatchlist(watchlist) {
        const nameElement = document.getElementById('activeWatchlistName');
        const contentElement = document.getElementById('watchlistContent');
        const emptyStateElement = document.getElementById('emptyState');
        const stocksGrid = document.getElementById('stocksGrid');

        if (nameElement) nameElement.textContent = watchlist.name;
        if (contentElement) contentElement.style.display = 'block';
        if (emptyStateElement) emptyStateElement.style.display = 'none';

        if (!stocksGrid) return;

        if (watchlist.stocks.length === 0) {
            stocksGrid.innerHTML = `
                <div class="empty-watchlist">
                    <h3>No stocks in this watchlist</h3>
                    <p>Search and add stocks to start tracking them.</p>
                </div>
            `;
            return;
        }

        // Show loading state
        stocksGrid.innerHTML = '<div class="loading-stocks">Loading stock data...</div>';

        try {
            const stockPromises = watchlist.stocks.map(stock => 
                this.apiService.fetchStockData(stock.symbol)
            );

            const stocksData = await Promise.all(stockPromises);
            
            stocksGrid.innerHTML = '';
            
            stocksData.forEach(stockData => {
                if (stockData) {
                    const card = this.ui.createStockCard(stockData);
                    this.ui.animateIn(card, 'slideIn');
                    stocksGrid.appendChild(card);
                }
            });

            this.updateLastUpdatedTime();
            
        } catch (error) {
            debugLogger.error('Failed to load stock data', error);
            stocksGrid.innerHTML = `
                <div class="error-state">
                    <h3>Failed to load stock data</h3>
                    <p>Please try refreshing or check your connection.</p>
                    <button class="btn btn--primary" onclick="location.reload()">Refresh Page</button>
                </div>
            `;
        }
    }

    /**
     * Show empty state
     */
    showEmptyState() {
        const contentElement = document.getElementById('watchlistContent');
        const emptyStateElement = document.getElementById('emptyState');

        if (contentElement) contentElement.style.display = 'none';
        if (emptyStateElement) emptyStateElement.style.display = 'block';
        
        this.updateDeleteButtonState();
    }

    /**
     * Handle stock search
     */
    async handleSearch(query) {
        if (!query || query.length < 2) {
            this.clearSearchResults();
            return;
        }

        try {
            const results = await this.apiService.searchStocks(query);
            this.displaySearchResults(results);
        } catch (error) {
            debugLogger.error('Search failed', error);
            this.clearSearchResults();
        }
    }

    /**
     * Display search results
     */
    displaySearchResults(stocks) {
        const container = document.getElementById('searchResults');
        if (!container) return;

        container.innerHTML = '';
        
        if (stocks.length === 0) {
            container.innerHTML = '<div class="no-results">No stocks found</div>';
            return;
        }

        stocks.forEach(stock => {
            const item = this.ui.createSearchResultItem(stock);
            container.appendChild(item);
        });
        
        container.style.display = 'block';
    }

    /**
     * Clear search results
     */
    clearSearchResults() {
        const container = document.getElementById('searchResults');
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    }

    /**
     * Add stock from search results
     */
    async addStockFromSearch(resultElement) {
        const activeWatchlist = this.watchlistService.getActiveWatchlist();
        if (!activeWatchlist) {
            this.ui.showToast('Please select a watchlist first', 'warning');
            return;
        }

        const symbol = resultElement.dataset.symbol;
        if (!symbol) return;

        try {
            this.watchlistService.addStockToWatchlist(activeWatchlist.id, symbol);
            await this.displayWatchlist(activeWatchlist);
            this.clearSearchResults();
            
            const searchInput = document.getElementById('stockSearch');
            if (searchInput) searchInput.value = '';
            
            this.ui.showToast(`Added ${symbol} to watchlist`, 'success');
            
        } catch (error) {
            debugLogger.error('Failed to add stock', error);
            this.ui.showToast(error.message, 'error');
        }
    }

    /**
     * Remove stock from watchlist
     */
    async removeStock(stockCard) {
        const activeWatchlist = this.watchlistService.getActiveWatchlist();
        if (!activeWatchlist) return;

        const symbol = stockCard.dataset.symbol;
        if (!symbol) return;

        try {
            this.watchlistService.removeStockFromWatchlist(activeWatchlist.id, symbol);
            await this.displayWatchlist(activeWatchlist);
            this.ui.showToast(`Removed ${symbol} from watchlist`, 'success');
        } catch (error) {
            debugLogger.error('Failed to remove stock', error);
            this.ui.showToast('Failed to remove stock', 'error');
        }
    }

    /**
     * Refresh all data
     */
    async refreshData() {
        const refreshBtn = document.getElementById('refreshBtn');
        this.ui.setElementLoading(refreshBtn, true);

        try {
            // Clear API cache
            this.apiService.clearCache();
            
            // Reload market indices
            await this.loadMarketIndices();
            
            // Reload active watchlist
            const activeWatchlist = this.watchlistService.getActiveWatchlist();
            if (activeWatchlist) {
                await this.displayWatchlist(activeWatchlist);
            }
            
            this.updateMarketStatus();
            this.ui.showToast('Data refreshed successfully', 'success');
            
        } catch (error) {
            debugLogger.error('Failed to refresh data', error);
            this.ui.showToast('Failed to refresh data', 'error');
        } finally {
            this.ui.setElementLoading(refreshBtn, false);
        }
    }

    /**
     * Enable stock search
     */
    enableStockSearch() {
        const searchInput = document.getElementById('stockSearch');
        const helpText = document.querySelector('.form-help-text');
        
        if (searchInput) {
            searchInput.disabled = false;
            searchInput.placeholder = 'Search by symbol (e.g., RELIANCE.NS) or company name';
        }
        
        if (helpText) {
            helpText.textContent = 'Search and click on a result to add it to your watchlist';
        }

        this.updateDeleteButtonState();
    }

    /**
     * Disable stock search
     */
    disableStockSearch() {
        const searchInput = document.getElementById('stockSearch');
        const helpText = document.querySelector('.form-help-text');
        
        if (searchInput) {
            searchInput.disabled = true;
            searchInput.value = '';
            searchInput.placeholder = 'Create or select a watchlist first';
        }
        
        if (helpText) {
            helpText.textContent = 'Create or select a watchlist first to add stocks';
        }
        
        this.clearSearchResults();
        this.updateDeleteButtonState();
    }

    /**
     * Update delete button state
     */
    updateDeleteButtonState() {
        const deleteBtn = document.getElementById('deleteWatchlistBtn');
        if (deleteBtn) {
            deleteBtn.disabled = !this.watchlistService.getActiveWatchlist();
        }
    }

    /**
     * Update last updated time
     */
    updateLastUpdatedTime() {
        const element = document.getElementById('lastUpdated');
        if (element) {
            element.textContent = new Date().toLocaleTimeString('en-IN');
        }
    }

    /**
     * Start auto-refresh during market hours
     */
    startAutoRefresh() {
        // Clear existing interval
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        // Refresh every 30 seconds during market hours
        this.refreshInterval = setInterval(() => {
            if (isMarketOpen() && this.watchlistService.getActiveWatchlist()) {
                this.refreshData();
            }
        }, 30000);
    }

    /**
     * Cleanup on page unload
     */
    cleanup() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new StockWatchlistApp();
    app.init();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        app.cleanup();
    });
    
    // Make app globally accessible for debugging
    window.stockApp = app;
});
