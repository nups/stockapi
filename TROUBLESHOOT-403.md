# 🚨 Google OAuth 403 Error - Troubleshooting Guide

**Your Client ID**: `712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0.apps.googleusercontent.com`

## 🔍 **403 Error Analysis**

The 403 error you're seeing indicates that Google is rejecting the authentication request. This typically happens due to configuration issues in Google Cloud Console.

## ✅ **Step-by-Step Fix**

### 1. **Check Authorized JavaScript Origins**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID: `712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0`
4. Click the **edit** button (pencil icon)
5. Under **Authorized JavaScript origins**, ensure you have:
   ```
   http://localhost:3000
   http://127.0.0.1:3000
   ```
6. Click **Save**

### 2. **Verify OAuth Consent Screen**

1. Go to **APIs & Services** → **OAuth consent screen**
2. Ensure the consent screen is **configured** and **published**
3. If it's in "Testing" mode, add your email to test users
4. Required fields:
   - App name: `Stock Watchlist`
   - User support email: Your email
   - Developer contact information: Your email

### 3. **Enable Required APIs**

1. Go to **APIs & Services** → **Library**
2. Search and enable these APIs:
   - **Google+ API** (if available)
   - **Google Identity Toolkit API**
   - **Google OAuth2 API**

### 4. **Check Domain Verification**

1. In **OAuth consent screen** → **App domain**
2. For development, you can leave this empty
3. For production, add your domain

## 🔧 **Quick Fixes**

### **Option 1: Recreate OAuth Client**
If issues persist, create a new OAuth client:

1. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Choose **Web application**
3. Add these origins:
   ```
   http://localhost:3000
   http://127.0.0.1:3000
   ```
4. Copy the new Client ID to your `.env` file

### **Option 2: Check Test Users**
If your app is in "Testing" mode:

1. Go to **OAuth consent screen** → **Test users**
2. Add your Google account email
3. Save changes

## 🚀 **Test Your Setup**

After making changes:

1. **Wait 5-10 minutes** for Google's changes to propagate
2. **Clear browser cache** and cookies
3. **Restart your development server**:
   ```bash
   # Stop server (Ctrl+C)
   npm start
   ```
4. Test the login again

## 🔍 **Debug Information**

### **Current Configuration Check:**
- ✅ Client ID is properly formatted
- ✅ Environment variable is set
- ❓ JavaScript origins need verification
- ❓ Consent screen needs verification

### **Common Error Messages:**
- `403: disallowed_useragent` → Wrong JavaScript origins
- `403: access_denied` → Consent screen not published
- `403: invalid_client` → Client ID configuration issue

## 🛠️ **Alternative Testing Method**

While fixing the OAuth issue, you can test the app functionality:

1. **Use Demo Mode**: Click "Try Demo Version" on the login page
2. This bypasses Google OAuth and uses mock data
3. You can test all features without authentication

## 📞 **Need Immediate Help?**

**Quick Test URL**: Try visiting this URL in your browser to check the OAuth configuration:
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0.apps.googleusercontent.com&redirect_uri=http://localhost:3000&response_type=code&scope=email%20profile
```

If this URL works, the issue is in our implementation. If it gives a 403, the issue is in Google Cloud Console configuration.

---

**💡 Pro Tip**: The most common cause of 403 errors is missing `http://localhost:3000` in the Authorized JavaScript origins. Double-check this first!