import React, { useState, useEffect } from 'react';

const WatchlistManager = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newStockSymbol, setNewStockSymbol] = useState('');
  const [showAddStock, setShowAddStock] = useState(false);

  useEffect(() => {
    fetchWatchlists();
  }, []);

  useEffect(() => {
    if (selectedWatchlist) {
      fetchWatchlistStocks(selectedWatchlist.id);
    }
  }, [selectedWatchlist]);

  const fetchWatchlists = async () => {
    try {
      setLoading(true);
      setError('');
      
      // For demo purposes, using mock data
      // Replace with actual API call: const response = await api.get('/api/watchlists');
      const mockWatchlists = [
        { id: 1, name: 'My Favorites', count: 8, created_at: '2024-01-15' },
        { id: 2, name: 'Tech Stocks', count: 12, created_at: '2024-01-20' },
        { id: 3, name: 'Banking Sector', count: 6, created_at: '2024-02-01' }
      ];
      
      setWatchlists(mockWatchlists);
      if (mockWatchlists.length > 0) {
        setSelectedWatchlist(mockWatchlists[0]);
      }
    } catch (err) {
      console.error('Failed to fetch watchlists:', err);
      setError('Failed to load watchlists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchlistStocks = async (watchlistId) => {
    try {
      setLoading(true);
      setError('');
      
      // For demo purposes, using mock data
      // Replace with actual API call: const response = await api.get(`/api/watchlists/${watchlistId}/stocks`);
      const mockStocks = [
        {
          symbol: 'RELIANCE',
          company_name: 'Reliance Industries Ltd',
          current_price: 2850.75,
          change: 45.25,
          change_percent: 1.61,
          volume: 1250000,
          market_cap: '19,25,000 Cr',
          pe_ratio: 15.2,
          last_updated: new Date().toISOString()
        },
        {
          symbol: 'TCS',
          company_name: 'Tata Consultancy Services',
          current_price: 3650.30,
          change: -25.50,
          change_percent: -0.69,
          volume: 850000,
          market_cap: '13,15,000 Cr',
          pe_ratio: 28.5,
          last_updated: new Date().toISOString()
        },
        {
          symbol: 'INFY',
          company_name: 'Infosys Limited',
          current_price: 1450.85,
          change: 12.30,
          change_percent: 0.86,
          volume: 950000,
          market_cap: '6,05,000 Cr',
          pe_ratio: 24.8,
          last_updated: new Date().toISOString()
        }
      ];
      
      setStocks(mockStocks);
    } catch (err) {
      console.error('Failed to fetch watchlist stocks:', err);
      setError('Failed to load stocks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addStockToWatchlist = async () => {
    if (!newStockSymbol.trim() || !selectedWatchlist) return;

    try {
      setLoading(true);
      setError('');
      
      // For demo purposes, just add to local state
      // Replace with actual API call: await api.post(`/api/watchlists/${selectedWatchlist.id}/stocks`, { symbol: newStockSymbol });
      
      const newStock = {
        symbol: newStockSymbol.toUpperCase(),
        company_name: `${newStockSymbol.toUpperCase()} Ltd`,
        current_price: Math.random() * 1000 + 500,
        change: (Math.random() - 0.5) * 100,
        change_percent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 1000000),
        market_cap: '50,000 Cr',
        pe_ratio: Math.random() * 30 + 10,
        last_updated: new Date().toISOString()
      };
      
      setStocks([...stocks, newStock]);
      setNewStockSymbol('');
      setShowAddStock(false);
    } catch (err) {
      console.error('Failed to add stock:', err);
      setError('Failed to add stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeStock = async (symbol) => {
    try {
      setLoading(true);
      setError('');
      
      // For demo purposes, just remove from local state
      // Replace with actual API call: await api.delete(`/api/watchlists/${selectedWatchlist.id}/stocks/${symbol}`);
      
      setStocks(stocks.filter(stock => stock.symbol !== symbol));
    } catch (err) {
      console.error('Failed to remove stock:', err);
      setError('Failed to remove stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="watchlist-manager">
      <div className="watchlist-header">
        <h2>📋 My Watchlists</h2>
        <button className="create-watchlist-btn">
          ➕ Create New
        </button>
      </div>

      <div className="watchlist-layout">
        {/* Watchlist Sidebar */}
        <div className="watchlist-sidebar">
          <div className="watchlist-list">
            {watchlists.map(watchlist => (
              <div
                key={watchlist.id}
                className={`watchlist-item ${selectedWatchlist?.id === watchlist.id ? 'active' : ''}`}
                onClick={() => setSelectedWatchlist(watchlist)}
              >
                <div className="watchlist-info">
                  <h4>{watchlist.name}</h4>
                  <span className="stock-count">{watchlist.count} stocks</span>
                </div>
                <div className="watchlist-actions">
                  <button className="edit-btn" title="Edit">✏️</button>
                  <button className="delete-btn" title="Delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Watchlist Content */}
        <div className="watchlist-content">
          {selectedWatchlist ? (
            <>
              <div className="watchlist-content-header">
                <div className="watchlist-title">
                  <h3>{selectedWatchlist.name}</h3>
                  <span className="stock-count">{stocks.length} stocks</span>
                </div>
                <div className="watchlist-actions">
                  <button 
                    className="add-stock-btn"
                    onClick={() => setShowAddStock(!showAddStock)}
                  >
                    ➕ Add Stock
                  </button>
                  <button className="refresh-btn" onClick={() => fetchWatchlistStocks(selectedWatchlist.id)}>
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {/* Add Stock Form */}
              {showAddStock && (
                <div className="add-stock-form">
                  <input
                    type="text"
                    placeholder="Enter stock symbol (e.g., RELIANCE)"
                    value={newStockSymbol}
                    onChange={(e) => setNewStockSymbol(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addStockToWatchlist()}
                  />
                  <button onClick={addStockToWatchlist} disabled={!newStockSymbol.trim()}>
                    Add
                  </button>
                  <button onClick={() => setShowAddStock(false)}>
                    Cancel
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="error-message">
                  <span>⚠️ {error}</span>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="loading-container">
                  <div className="loading-spinner">🔄</div>
                  <p>Loading stocks...</p>
                </div>
              )}

              {/* Stocks Table */}
              {!loading && !error && (
                <div className="stocks-table-container">
                  {stocks.length === 0 ? (
                    <div className="no-stocks">
                      <p>No stocks in this watchlist. Add some stocks to get started!</p>
                    </div>
                  ) : (
                    <table className="stocks-table">
                      <thead>
                        <tr>
                          <th>Stock</th>
                          <th>Price</th>
                          <th>Change</th>
                          <th>% Change</th>
                          <th>Volume</th>
                          <th>Market Cap</th>
                          <th>P/E Ratio</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stocks.map((stock, index) => (
                          <tr key={stock.symbol || index}>
                            <td className="stock-info">
                              <div className="stock-symbol">
                                <strong>{stock.symbol}</strong>
                                {stock.company_name && (
                                  <small>{stock.company_name}</small>
                                )}
                              </div>
                            </td>
                            <td className="price">
                              ₹{stock.current_price?.toFixed(2) || 'N/A'}
                            </td>
                            <td className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                              {stock.change >= 0 ? '+' : ''}₹{stock.change?.toFixed(2) || 'N/A'}
                            </td>
                            <td className={`change-percent ${stock.change_percent >= 0 ? 'positive' : 'negative'}`}>
                              {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent?.toFixed(2) || 'N/A'}%
                            </td>
                            <td className="volume">
                              {stock.volume?.toLocaleString() || 'N/A'}
                            </td>
                            <td className="market-cap">
                              {stock.market_cap || 'N/A'}
                            </td>
                            <td className="pe-ratio">
                              {stock.pe_ratio?.toFixed(1) || 'N/A'}
                            </td>
                            <td className="actions">
                              <button 
                                className="remove-btn"
                                onClick={() => removeStock(stock.symbol)}
                                title="Remove from watchlist"
                              >
                                🗑️
                              </button>
                              <button 
                                className="details-btn"
                                title="View details"
                              >
                                👁️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="no-watchlist-selected">
              <p>Select a watchlist to view stocks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchlistManager;