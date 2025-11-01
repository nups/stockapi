# 🔐 Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Stock Watchlist application.

## 📋 Prerequisites

- Google account
- Access to Google Cloud Console
- Basic understanding of OAuth 2.0

## 🚀 Step-by-Step Setup

### 1. **Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `stock-watchlist-app`
4. Click "Create"

### 2. **Enable Required APIs**

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" and enable it
3. Search for "Google Identity" and enable it

### 3. **Configure OAuth Consent Screen**

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (unless you have a Google Workspace account)
3. Fill in the required information:
   - **App name**: `Stock Watchlist`
   - **User support email**: Your email
   - **App logo**: Optional
   - **App domain**: `http://localhost:3000` (for development)
   - **Developer contact information**: Your email
4. Click "Save and Continue"
5. Add scopes (click "Add or Remove Scopes"):
   - `email`
   - `profile`
   - `openid`
6. Continue through the remaining steps

### 4. **Create OAuth 2.0 Credentials**

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Configure:
   - **Name**: `Stock Watchlist Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `http://127.0.0.1:3000`
   - **Authorized redirect URIs**:
     - `http://localhost:3000`
     - `http://localhost:3000/auth/callback`
5. Click "Create"
6. **Copy the Client ID** (you'll need this!)

### 5. **Configure Your Application**

1. Open your `.env` file in the project root
2. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID:
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
   ```
3. Save the file

### 6. **Restart Development Server**

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

## 🔍 Troubleshooting

### Common Issues:

#### **403 Forbidden Error**
- **Cause**: Invalid or missing Client ID
- **Solution**: Verify Client ID is correctly copied and saved in `.env`

#### **Origin Not Allowed**
- **Cause**: Your domain not in authorized origins
- **Solution**: Add `http://localhost:3000` to authorized JavaScript origins

#### **Consent Screen Not Configured**
- **Cause**: OAuth consent screen not set up
- **Solution**: Complete consent screen configuration in Google Cloud Console

#### **API Not Enabled**
- **Cause**: Required APIs not enabled
- **Solution**: Enable Google+ API and Google Identity API

### **Debug Steps:**

1. **Check Console Errors**:
   - Open browser developer tools (F12)
   - Look for error messages in Console tab

2. **Verify Environment Variables**:
   ```bash
   echo $REACT_APP_GOOGLE_CLIENT_ID
   ```

3. **Test Client ID Format**:
   - Should end with `.apps.googleusercontent.com`
   - Should not contain quotes or extra spaces

## 🔒 Security Best Practices

### **For Development:**
- Use `localhost` domains only
- Keep Client ID in environment variables
- Never commit `.env` file to version control

### **For Production:**
- Use HTTPS domains only
- Store Client ID securely
- Configure proper CORS settings
- Use environment-specific Client IDs

## 📚 Additional Resources

- [Google Identity Documentation](https://developers.google.com/identity)
- [OAuth 2.0 Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)
- [Google Cloud Console](https://console.cloud.google.com/)

## 🆘 Support

If you're still having issues:

1. **Check the browser console** for specific error messages
2. **Verify all steps** in this guide were completed
3. **Try the demo mode** as a fallback option
4. **Create a new Google Cloud project** if problems persist

## 🎯 Quick Test

After setup, you should see:
- ✅ "Sign in with Google" button (not disabled)
- ✅ No error messages on page load
- ✅ Google sign-in popup when clicking the button

---

**Need Help?** The application includes a demo mode that works without Google OAuth setup. Just click "Try Demo Version" to test the application functionality.