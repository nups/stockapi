# 📈 Stock Watchlist - React Version

A modern, React-based stock watchlist application with AI-powered recommendations and Zerodha integration.

## ✨ Features

- **🔐 Authentication System**: Secure login with Zerodha OAuth or demo mode
- **🤖 AI Recommendations**: Smart stock suggestions with technical and fundamental analysis
- **📊 Real-time Data**: Live stock prices and market data via Zerodha API
- **📋 Watchlist Management**: Create and manage multiple watchlists
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Active internet connection for API calls

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd stock-watchlist-fixed
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and go to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Login.js         # Login page with authentication
│   ├── Dashboard.js     # Main dashboard with tabs
│   ├── StockRecommendations.js  # AI recommendations table
│   ├── WatchlistManager.js      # Watchlist management
│   └── AuthCallback.js  # OAuth callback handler
├── context/
│   └── AuthContext.js   # Authentication state management
├── services/
│   └── authService.js   # API communication layer
├── App.js              # Main app component with routing
├── index.js            # React app entry point
└── index.css           # Global styles and theme
```

## 🔑 Authentication

### Google OAuth Login
- Click "Sign in with Google" to authenticate with your Google account
- Uses Google's secure OAuth 2.0 flow with Google Identity Services
- JWT token automatically parsed and stored securely
- Provides user profile information (name, email, picture)

### Demo Mode
- Click "Try Demo Version" for immediate access
- Uses mock data for testing and demonstration
- No Google account required

## 📊 AI Recommendations

The app displays AI-powered stock recommendations with:

- **📈 Technical Score**: Technical analysis rating (1-10)
- **📊 Fundamental Score**: Fundamental analysis rating (1-10) 
- **🎯 Overall Score**: Combined recommendation score (1-10)
- **⚠️ Risk Level**: Low, Medium, or High risk assessment
- **🚨 Priority**: Action priority (Immediate, High, Medium, Low)
- **💡 Recommendation**: Buy, Sell, or Hold suggestion
- **📝 Risk Notes**: Important risk considerations

### Filtering Options
- Filter by minimum overall score
- Filter by risk level
- Filter by action priority
- Real-time filtering with instant results

## 📋 Watchlist Features

- **Multiple Watchlists**: Create and manage multiple themed watchlists
- **Real-time Prices**: Live stock price updates
- **Performance Tracking**: Daily change percentages and amounts
- **Quick Actions**: Add/remove stocks with one click
- **Market Data**: Volume, market cap, P/E ratios

## 🔧 API Integration

### Backend Endpoint
```
https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net
```

### Key API Routes
- `GET /api/ai-recommendations` - Fetch AI stock recommendations
- `GET /api/auth/verify` - Verify authentication token
- `POST /api/auth/logout` - Logout user session
- `GET /api/watchlists` - Get user watchlists
- `POST /api/watchlists/{id}/stocks` - Add stock to watchlist

### Authentication Headers
```javascript
Authorization: Bearer {session_token}
// OR as query parameter
?session={session_token}
```

## 🎨 Theming & Styling

### CSS Variables
The app uses CSS custom properties for consistent theming:
```css
:root {
  --primary-color: #667eea;
  --success-color: #10b981;
  --error-color: #ef4444;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
}
```

### Responsive Breakpoints
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px  
- **Mobile**: < 768px

## 📱 Progressive Web App

The app includes PWA features:
- **Offline Support**: Basic offline functionality
- **App-like Experience**: Install on mobile home screen
- **Fast Loading**: Optimized bundle size and caching

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

### Environment Variables

Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net
REACT_APP_ZERODHA_APP_NAME=your_app_name
```

## 🔒 Security

- **Token Storage**: Secure localStorage with expiration
- **API Security**: Bearer token authentication
- **XSS Protection**: React's built-in XSS protection
- **HTTPS**: All API calls over HTTPS
- **OAuth2**: Industry-standard OAuth implementation

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on push

### Environment Setup
Ensure these environment variables are set in production:
- `REACT_APP_API_URL`
- `REACT_APP_ZERODHA_APP_NAME`

## 🧪 Testing

### Demo Data
The app includes comprehensive demo data for testing:
- Mock user authentication
- Sample stock recommendations
- Test watchlists with realistic data

### API Testing
Test API endpoints with tools like Postman:
```bash
curl -H "Authorization: Bearer your_token" \
  https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net/api/ai-recommendations
```

## 📝 Migration Notes

### From JavaScript Version
This React version maintains compatibility with the existing API but provides:
- Better state management with React Context
- Component-based architecture
- Improved performance and maintainability
- Enhanced user experience with React Router

### Preserved Features
- All original API integrations
- Zerodha authentication flow
- AI recommendations format
- Existing CSS styling (converted to React-compatible)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the browser console for error messages
- Verify API endpoint accessibility
- Ensure valid Zerodha session token
- Test with demo mode first

## 🔄 Version History

- **v2.0.0** - React migration with authentication system
- **v1.0.0** - Original JavaScript implementation

---

**Made with ❤️ for Indian stock markets** 📈