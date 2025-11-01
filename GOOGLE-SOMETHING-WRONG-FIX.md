# Fix "Can't continue with google.com - Something went wrong" Error

## 🚨 Current Issue Analysis

From your screenshot, I can see:
- ✅ Google OAuth popup opens
- ❌ Error: "Can't continue with google.com - Something went wrong"
- ❌ Network shows failed `clientmetadata` request for your Client ID
- ❌ Request URL shows: `https://accounts.google.com/gsi/fedcm/issue`

## 🔍 Root Cause Analysis

This specific error usually indicates:
1. **OAuth Consent Screen incomplete**
2. **Missing test users for external app**
3. **API permissions not properly configured**
4. **Client ID configuration issues**

## 🔧 Step-by-Step Fix

### Step 1: **Complete OAuth Consent Screen Setup**

Go to [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent):

1. **Click "EDIT APP"**
2. **App Information Tab:**
   ```
   App name: Stock Watchlist App
   User support email: [Select your Gmail from dropdown]
   App logo: [Skip for now]
   App domain: http://localhost:3000
   Application home page: http://localhost:3000
   Authorized domains: localhost
   Developer contact information: [Your Gmail]
   ```
3. **Click "SAVE AND CONTINUE"**

### Step 2: **Skip Scopes (Leave Default)**
- Don't add any additional scopes
- The basic ones are automatically included
- **Click "SAVE AND CONTINUE"**

### Step 3: **Add Test Users (CRITICAL!)**
This is likely what's missing:
1. **Click "+ ADD USERS"**
2. **Add your Gmail address** (the one you're trying to sign in with)
3. **Click "ADD"**
4. **Click "SAVE AND CONTINUE"**

### Step 4: **Review and Complete**
- Review all settings
- **Click "BACK TO DASHBOARD"**

## 🎯 Expected Result After Fix

Your OAuth consent screen should show:
```
Publishing status: Testing
User type: External
App name: Stock Watchlist App
Test users: 1 user (your email)
```

## 🧪 Alternative Quick Test

### Try This URL Directly:
Replace `YOUR_EMAIL` with your actual Gmail:
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0.apps.googleusercontent.com&redirect_uri=http://localhost:3000&response_type=code&scope=openid%20email%20profile&login_hint=YOUR_EMAIL@gmail.com
```

If this works, your OAuth setup is correct.

## 🔧 Additional Troubleshooting

### Issue: Still "Something went wrong"
**Check these in Google Cloud Console:**

1. **APIs & Services → Library** - Enable:
   - ✅ Google+ API
   - ✅ Google Identity Toolkit API
   - ✅ Google Sign-In API

2. **APIs & Services → Credentials** - Your OAuth 2.0 Client:
   - ✅ Authorized JavaScript origins: `http://localhost:3000`
   - ✅ Authorized redirect URIs: `http://localhost:3000`

### Issue: "Access blocked" instead of "Something went wrong"
- Your email is not in test users list
- Add your email to OAuth consent screen test users

### Issue: Works in one browser but not another
- Clear all browser data (cookies, cache, site data)
- Or use incognito/private browsing mode

## 💡 Temporary Workaround

While fixing Google OAuth, you can test the app functionality:

1. **Click "Try Demo Version"** button
2. This bypasses Google OAuth and lets you test the dashboard
3. Use this to verify the rest of your app works

## 🚨 Critical Steps Summary

1. **Complete OAuth consent screen** with all required fields
2. **Add your email as test user** (this is probably missing!)
3. **Enable required APIs** in Google Cloud Console
4. **Wait 10-15 minutes** for changes to propagate
5. **Clear browser cache** or use incognito mode
6. **Try authentication again**

## 🎯 Expected Working Flow

After fixing:
1. Click "Sign in with Google"
2. Google popup opens cleanly
3. You might see "This app isn't verified" (normal)
4. Click "Advanced" → "Go to Stock Watchlist App (unsafe)"
5. Complete sign-in with your Gmail
6. Redirect back to dashboard successfully

## 📞 Next Steps

1. **Fix OAuth consent screen** (especially add test users)
2. **Wait 15 minutes** for Google's systems to update
3. **Test in incognito mode** to avoid cached errors
4. **If still fails**, try the "Try Demo Version" to test app functionality

The "Something went wrong" error is almost always due to incomplete OAuth consent screen setup, particularly missing test users for external apps!