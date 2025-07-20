/**
 * Debug logging utility for development and troubleshooting
 */
export class DebugLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 100;
        this.isDebugMode = this.getDebugMode();
        this.debugElement = null;
        this.logLevels = {
            error: { priority: 0, color: '#ff4757', icon: '❌' },
            warning: { priority: 1, color: '#ffa502', icon: '⚠️' },
            info: { priority: 2, color: '#3742fa', icon: 'ℹ️' },
            success: { priority: 3, color: '#2ed573', icon: '✅' },
            debug: { priority: 4, color: '#747d8c', icon: '🔍' }
        };
    }

    /**
     * Initialize debug panel in the DOM
     */
    init() {
        this.debugElement = document.getElementById('debugLogs');
        this.setupDebugToggle();
        this.log('Debug logger initialized', 'info');
    }

    /**
     * Get debug mode from localStorage
     */
    getDebugMode() {
        try {
            return localStorage.getItem('stockapp_debug') === 'true';
        } catch {
            return false;
        }
    }

    /**
     * Set debug mode
     */
    setDebugMode(enabled) {
        this.isDebugMode = enabled;
        try {
            localStorage.setItem('stockapp_debug', enabled.toString());
        } catch (error) {
            console.warn('Could not save debug mode to localStorage:', error);
        }
        
        const debugPanel = document.getElementById('debugPanel');
        if (debugPanel) {
            debugPanel.style.display = enabled ? 'block' : 'none';
        }
    }

    /**
     * Setup debug panel toggle functionality
     */
    setupDebugToggle() {
        const toggleBtn = document.getElementById('toggleDebug');
        const debugPanel = document.getElementById('debugPanel');
        
        if (toggleBtn && debugPanel) {
            // Set initial state
            debugPanel.style.display = this.isDebugMode ? 'block' : 'none';
            toggleBtn.textContent = this.isDebugMode ? 'Hide' : 'Show';
            
            toggleBtn.addEventListener('click', () => {
                this.isDebugMode = !this.isDebugMode;
                this.setDebugMode(this.isDebugMode);
                toggleBtn.textContent = this.isDebugMode ? 'Hide' : 'Show';
            });
        }

        // Show debug panel if there are errors or warnings
        window.addEventListener('error', () => {
            if (!this.isDebugMode) {
                this.setDebugMode(true);
                const toggleBtn = document.getElementById('toggleDebug');
                if (toggleBtn) toggleBtn.textContent = 'Hide';
            }
        });
    }

    /**
     * Log a message with specified level
     */
    log(message, level = 'info', data = null) {
        const timestamp = new Date();
        const logEntry = {
            id: Date.now() + Math.random(),
            timestamp,
            message,
            level,
            data
        };

        // Add to logs array
        this.logs.unshift(logEntry);
        
        // Limit log history
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(0, this.maxLogs);
        }

        // Console logging
        this.logToConsole(logEntry);

        // DOM logging
        if (this.isDebugMode) {
            this.logToDom(logEntry);
        }
    }

    /**
     * Log to browser console
     */
    logToConsole(logEntry) {
        const { message, level, data, timestamp } = logEntry;
        const timeStr = timestamp.toLocaleTimeString();
        const consoleMessage = `[${timeStr}] Stock App: ${message}`;

        switch (level) {
            case 'error':
                console.error(consoleMessage, data || '');
                break;
            case 'warning':
                console.warn(consoleMessage, data || '');
                break;
            case 'success':
            case 'info':
                console.info(consoleMessage, data || '');
                break;
            case 'debug':
                console.debug(consoleMessage, data || '');
                break;
            default:
                console.log(consoleMessage, data || '');
        }
    }

    /**
     * Log to debug panel in DOM
     */
    logToDom(logEntry) {
        if (!this.debugElement) return;

        const { message, level, data, timestamp } = logEntry;
        const levelConfig = this.logLevels[level] || this.logLevels.info;
        
        const logDiv = document.createElement('div');
        logDiv.className = `debug-log debug-log--${level}`;
        
        const timeStr = timestamp.toLocaleTimeString();
        
        logDiv.innerHTML = `
            <div class="debug-log-header">
                <span class="debug-log-icon">${levelConfig.icon}</span>
                <span class="debug-log-time">${timeStr}</span>
                <span class="debug-log-level" style="color: ${levelConfig.color}">${level.toUpperCase()}</span>
            </div>
            <div class="debug-log-message">${this.escapeHtml(message)}</div>
            ${data ? `<div class="debug-log-data">${this.formatData(data)}</div>` : ''}
        `;

        // Insert at the beginning
        this.debugElement.insertBefore(logDiv, this.debugElement.firstChild);

        // Limit DOM logs to prevent memory issues
        const domLogs = this.debugElement.children;
        if (domLogs.length > 50) {
            for (let i = domLogs.length - 1; i >= 50; i--) {
                this.debugElement.removeChild(domLogs[i]);
            }
        }
    }

    /**
     * Format data for display
     */
    formatData(data) {
        if (typeof data === 'object') {
            try {
                return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            } catch {
                return '<pre>Object (circular reference)</pre>';
            }
        }
        return this.escapeHtml(String(data));
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Clear all logs
     */
    clear() {
        this.logs = [];
        if (this.debugElement) {
            this.debugElement.innerHTML = '';
        }
        console.clear();
        this.log('Debug logs cleared', 'info');
    }

    /**
     * Get logs filtered by level
     */
    getLogsByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }

    /**
     * Get recent logs
     */
    getRecentLogs(count = 10) {
        return this.logs.slice(0, count);
    }

    /**
     * Export logs as text
     */
    exportLogs() {
        const logsText = this.logs.map(log => {
            const timeStr = log.timestamp.toISOString();
            const dataStr = log.data ? ` | Data: ${JSON.stringify(log.data)}` : '';
            return `[${timeStr}] ${log.level.toUpperCase()}: ${log.message}${dataStr}`;
        }).join('\n');

        return logsText;
    }

    /**
     * Convenience methods for different log levels
     */
    error(message, data = null) {
        this.log(message, 'error', data);
    }

    warning(message, data = null) {
        this.log(message, 'warning', data);
    }

    info(message, data = null) {
        this.log(message, 'info', data);
    }

    success(message, data = null) {
        this.log(message, 'success', data);
    }

    debug(message, data = null) {
        this.log(message, 'debug', data);
    }
}

// Create and export singleton instance
export const debugLogger = new DebugLogger();
