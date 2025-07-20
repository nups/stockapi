/**
 * UI components and DOM manipulation utilities
 */
import { formatPrice, formatPercentage, getChangeClass, formatDateTime } from '../utils/helpers.js';
import { debugLogger } from '../utils/debug.js';

export class UIComponents {
    constructor() {
        this.toastTimeout = null;
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        toast.className = `toast toast--${type} toast--show`;
        
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            toast.classList.remove('toast--show');
        }, duration);

        debugLogger.info(`Toast: ${message} (${type})`);
    }

    /**
     * Show loading overlay
     */
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    /**
     * Create stock card element
     */
    createStockCard(stockData) {
        const card = document.createElement('div');
        card.className = 'stock-card';
        card.dataset.symbol = stockData.symbol;
        
        const changeClass = getChangeClass(stockData.changePercent);
        
        card.innerHTML = `
            <div class="stock-card__header">
                <div class="stock-info">
                    <h3 class="stock-symbol">${stockData.symbol}</h3>
                    <p class="stock-name">${stockData.name}</p>
                </div>
                <button class="btn btn--outline btn--sm remove-stock" title="Remove from watchlist">×</button>
            </div>
            <div class="stock-card__body">
                <div class="stock-price">
                    <span class="current-price">${formatPrice(stockData.price)}</span>
                    <div class="price-change ${changeClass}">
                        <span class="change-amount">${formatPrice(stockData.change)}</span>
                        <span class="change-percent">(${formatPercentage(stockData.changePercent)})</span>
                    </div>
                </div>
                <div class="stock-details">
                    <div class="detail-item">
                        <span class="label">Open:</span>
                        <span class="value">${formatPrice(stockData.open)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">High:</span>
                        <span class="value">${formatPrice(stockData.high)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Low:</span>
                        <span class="value">${formatPrice(stockData.low)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Volume:</span>
                        <span class="value">${this.formatVolume(stockData.volume)}</span>
                    </div>
                </div>
            </div>
            <div class="stock-card__footer">
                <small class="last-updated">Updated: ${formatDateTime(stockData.lastUpdated)}</small>
            </div>
        `;

        return card;
    }

    /**
     * Create market index card
     */
    createIndexCard(indexData) {
        const card = document.createElement('div');
        card.className = 'index-card';
        
        const changeClass = getChangeClass(indexData.change_percent);
        
        card.innerHTML = `
            <div class="index-name">${indexData.name}</div>
            <div class="index-value">${indexData.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <div class="index-change ${changeClass}">
                <span class="change-amount">${indexData.change >= 0 ? '+' : ''}${indexData.change.toFixed(2)}</span>
                <span class="change-percent">(${formatPercentage(indexData.change_percent)})</span>
            </div>
        `;

        return card;
    }

    /**
     * Create search result item
     */
    createSearchResultItem(stock) {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.dataset.symbol = stock.symbol;
        
        item.innerHTML = `
            <div class="result-symbol">${stock.symbol}</div>
            <div class="result-name">${stock.name}</div>
            ${stock.exchange ? `<div class="result-exchange">${stock.exchange}</div>` : ''}
        `;

        return item;
    }

    /**
     * Create watchlist option element
     */
    createWatchlistOption(watchlist) {
        const option = document.createElement('option');
        option.value = watchlist.id;
        option.textContent = watchlist.name;
        return option;
    }

    /**
     * Update stock card with new data
     */
    updateStockCard(card, stockData) {
        const changeClass = getChangeClass(stockData.changePercent);
        
        // Update price
        const currentPrice = card.querySelector('.current-price');
        if (currentPrice) currentPrice.textContent = formatPrice(stockData.price);
        
        // Update change
        const priceChange = card.querySelector('.price-change');
        if (priceChange) {
            priceChange.className = `price-change ${changeClass}`;
            
            const changeAmount = priceChange.querySelector('.change-amount');
            const changePercent = priceChange.querySelector('.change-percent');
            
            if (changeAmount) changeAmount.textContent = formatPrice(stockData.change);
            if (changePercent) changePercent.textContent = `(${formatPercentage(stockData.changePercent)})`;
        }
        
        // Update details
        const details = {
            'Open:': formatPrice(stockData.open),
            'High:': formatPrice(stockData.high),
            'Low:': formatPrice(stockData.low),
            'Volume:': this.formatVolume(stockData.volume)
        };
        
        card.querySelectorAll('.detail-item').forEach(item => {
            const label = item.querySelector('.label').textContent;
            const value = item.querySelector('.value');
            if (value && details[label]) {
                value.textContent = details[label];
            }
        });
        
        // Update timestamp
        const lastUpdated = card.querySelector('.last-updated');
        if (lastUpdated) {
            lastUpdated.textContent = `Updated: ${formatDateTime(stockData.lastUpdated)}`;
        }
    }

    /**
     * Show modal
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            
            // Focus first input if available
            const firstInput = modal.querySelector('input[type="text"], input[type="email"], textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    /**
     * Hide modal
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            
            // Clear form inputs
            const inputs = modal.querySelectorAll('input[type="text"], input[type="email"], textarea');
            inputs.forEach(input => {
                input.value = '';
                input.classList.remove('error');
            });
            
            // Hide error messages
            const errors = modal.querySelectorAll('.form-error');
            errors.forEach(error => error.style.display = 'none');
        }
    }

    /**
     * Show form error
     */
    showFormError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(inputId + 'Error');
        
        if (input) {
            input.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    /**
     * Clear form errors
     */
    clearFormErrors(formElement) {
        const inputs = formElement.querySelectorAll('input, textarea, select');
        inputs.forEach(input => input.classList.remove('error'));
        
        const errors = formElement.querySelectorAll('.form-error');
        errors.forEach(error => error.style.display = 'none');
    }

    /**
     * Format volume number
     */
    formatVolume(volume) {
        if (!volume || isNaN(volume)) return '0';
        
        if (volume >= 10000000) {
            return (volume / 10000000).toFixed(1) + 'Cr';
        } else if (volume >= 100000) {
            return (volume / 100000).toFixed(1) + 'L';
        } else if (volume >= 1000) {
            return (volume / 1000).toFixed(1) + 'K';
        }
        
        return volume.toLocaleString('en-IN');
    }

    /**
     * Create empty state element
     */
    createEmptyState(title, message, buttonText = null, buttonAction = null) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        
        let buttonHtml = '';
        if (buttonText && buttonAction) {
            buttonHtml = `<button class="btn btn--primary empty-state-btn">${buttonText}</button>`;
        }
        
        emptyState.innerHTML = `
            <div class="empty-state-content">
                <h3>${title}</h3>
                <p>${message}</p>
                ${buttonHtml}
            </div>
        `;
        
        if (buttonAction) {
            const button = emptyState.querySelector('.empty-state-btn');
            if (button) {
                button.addEventListener('click', buttonAction);
            }
        }
        
        return emptyState;
    }

    /**
     * Animate element entrance
     */
    animateIn(element, animationType = 'fadeIn') {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transform = animationType === 'slideIn' ? 'translateY(20px)' : 'scale(0.9)';
        
        // Force reflow
        element.offsetHeight;
        
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        element.style.opacity = '1';
        element.style.transform = 'none';
    }

    /**
     * Set element loading state
     */
    setElementLoading(element, isLoading) {
        if (!element) return;
        
        if (isLoading) {
            element.classList.add('loading');
            element.disabled = true;
        } else {
            element.classList.remove('loading');
            element.disabled = false;
        }
    }

    /**
     * Update market status indicator
     */
    updateMarketStatus(isOpen) {
        const statusElement = document.querySelector('.market-status .status');
        if (!statusElement) return;
        
        if (isOpen) {
            statusElement.className = 'status status--success';
            statusElement.textContent = 'Market Open';
        } else {
            statusElement.className = 'status status--error';
            statusElement.textContent = 'Market Closed';
        }
    }

    /**
     * Create confirmation dialog
     */
    showConfirmationDialog(title, message, onConfirm, onCancel = null) {
        const modal = document.getElementById('confirmationModal');
        const titleElement = document.getElementById('confirmationTitle');
        const messageElement = document.getElementById('confirmationMessage');
        const confirmBtn = document.getElementById('confirmationConfirm');
        const cancelBtn = document.getElementById('confirmationCancel');
        
        if (!modal || !titleElement || !messageElement || !confirmBtn || !cancelBtn) {
            return;
        }
        
        titleElement.textContent = title;
        messageElement.textContent = message;
        
        // Remove existing event listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        const newCancelBtn = cancelBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        
        // Add new event listeners
        newConfirmBtn.addEventListener('click', () => {
            this.hideModal('confirmationModal');
            if (onConfirm) onConfirm();
        });
        
        newCancelBtn.addEventListener('click', () => {
            this.hideModal('confirmationModal');
            if (onCancel) onCancel();
        });
        
        this.showModal('confirmationModal');
    }
}
