# 🚀 Production Deployment Guide

## Environment Variables for Production

Since we removed the `.env` file from Git for security, you need to configure environment variables in your deployment platform.

### 🔧 **Required Environment Variables**

```bash
REACT_APP_GOOGLE_CLIENT_ID=712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0.apps.googleusercontent.com
REACT_APP_API_URL=https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net
REACT_APP_NAME=Stock Watchlist
REACT_APP_VERSION=1.0.0
```

### 📋 **Platform-Specific Setup**

#### **Vercel**
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add each variable with name and value
4. Redeploy

#### **Netlify**
1. Site dashboard → Site settings
2. Environment variables
3. Add each variable
4. Trigger new deploy

#### **Azure Static Web Apps**
1. Azure Portal → Your Static Web App
2. Configuration → Application settings
3. Add each environment variable
4. Save

#### **GitHub Pages (with GitHub Actions)**
1. Repository → Settings → Secrets and variables → Actions
2. Add repository secrets
3. Update workflow to use secrets

#### **Heroku**
```bash
heroku config:set REACT_APP_GOOGLE_CLIENT_ID=your-client-id
heroku config:set REACT_APP_API_URL=your-api-url
```

### 🔐 **Google OAuth Domain Configuration**

**Important**: Update your Google OAuth settings for production:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add your production domains to:
   - **Authorized JavaScript origins**: `https://yourapp.vercel.app`
   - **Authorized redirect URIs**: `https://yourapp.vercel.app/auth/google/callback`

### 🧪 **Testing Environment Variables**

Add this to your React app to verify environment variables are loaded:

```javascript
// Add to your Login component for debugging
console.log('Environment check:', {
  googleClientId: !!process.env.REACT_APP_GOOGLE_CLIENT_ID,
  apiUrl: process.env.REACT_APP_API_URL,
  clientIdLength: process.env.REACT_APP_GOOGLE_CLIENT_ID?.length
});
```

### 🚨 **Security Best Practices**

1. **Never commit `.env` files** ✅ (Already fixed)
2. **Use platform environment variables** for production
3. **Rotate credentials** regularly
4. **Use different credentials** for dev/staging/prod if possible
5. **Monitor for credential exposure** in logs

### 📱 **Quick Setup Commands**

**For Vercel CLI:**
```bash
vercel env add REACT_APP_GOOGLE_CLIENT_ID
# Enter your Google Client ID when prompted
```

**For Netlify CLI:**
```bash
netlify env:set REACT_APP_GOOGLE_CLIENT_ID "your-client-id"
```

## ✅ **Deployment Checklist**

- [ ] Set environment variables in deployment platform
- [ ] Update Google OAuth authorized domains
- [ ] Test OAuth flow in production
- [ ] Verify API connectivity
- [ ] Check browser console for environment variable loading
- [ ] Test complete user flow (login → dashboard → Zerodha integration)
