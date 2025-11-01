# Fix Google OAuth CORS Error - Configuration Issue

## 🚨 Problem: CORS Error with Google Login

If you're getting CORS errors specifically during Google authentication, it's almost certainly a Google Cloud Console configuration issue, not your backend CORS policy.

## 🔧 Google Cloud Console Configuration Fixes

### 1. **Authorized JavaScript Origins** (Most Common Issue)

Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials):

1. Find your OAuth 2.0 Client ID: `712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0`
2. Click the **edit (pencil) icon**
3. In **"Authorized JavaScript origins"** section, make sure you have:

```
http://localhost:3000
https://localhost:3000
http://127.0.0.1:3000
https://127.0.0.1:3000
```

### 2. **Authorized Redirect URIs**

In the same screen, add these to **"Authorized redirect URIs"**:

```
http://localhost:3000
http://localhost:3000/auth/callback
http://localhost:3000/login
https://localhost:3000
https://localhost:3000/auth/callback
https://localhost:3000/login
```

### 3. **OAuth Consent Screen Configuration**

Go to [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent):

1. **User Type**: Should be "External" (which you already set)
2. **App Information**: 
   - App name: `Stock Watchlist App`
   - User support email: Your Gmail
3. **Authorized Domains**: Add `localhost` (without protocol)
4. **Test Users**: Add your Gmail address

### 4. **Required APIs Enabled**

Go to [API Library](https://console.cloud.google.com/apis/library) and enable:

- ✅ **Google+ API** (or Google People API)
- ✅ **Google Identity Toolkit API** 
- ✅ **Google Sign-In API**

## 🧪 Test Google Configuration

### Quick Test in Browser Console:

```javascript
// Test if your Client ID is accessible
console.log('Client ID:', '712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0.apps.googleusercontent.com');

// Test Google script loading
console.log('Google loaded:', typeof window.google !== 'undefined');
console.log('Google accounts:', window.google?.accounts);
```

### Manual Test URL:

Try this URL in your browser (replace with your actual Client ID):

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0.apps.googleusercontent.com&redirect_uri=http://localhost:3000&response_type=code&scope=openid%20email%20profile
```

If this gives a CORS or "origin not allowed" error, your Google Console configuration is wrong.

## 🔍 Common Google OAuth CORS Issues

### Issue 1: "The given origin is not allowed"
**Solution**: Add `http://localhost:3000` to Authorized JavaScript origins

### Issue 2: "redirect_uri_mismatch"
**Solution**: Add `http://localhost:3000` to Authorized redirect URIs

### Issue 3: "This app isn't verified"
**Solution**: This is normal for external apps - click "Advanced" → "Go to app (unsafe)"

### Issue 4: "Access blocked: This app's request is invalid"
**Solution**: Complete OAuth consent screen setup, add test users

### Issue 5: "CORS error from accounts.google.com"
**Solution**: Usually means authorized origins are missing or incorrect

## 🛠️ Step-by-Step Fix Process

### Step 1: Check Current Config
1. Go to Google Cloud Console
2. APIs & Services → Credentials
3. Find your Client ID: `712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0`
4. Click edit and screenshot the current settings

### Step 2: Update Authorized Origins
Add these exactly:
```
http://localhost:3000
https://localhost:3000
```
**Important**: 
- Use `http://` for localhost (not `https://`)
- No trailing slashes
- No port variations unless needed

### Step 3: Update Redirect URIs
Add these:
```
http://localhost:3000
http://localhost:3000/auth/callback
```

### Step 4: Save and Wait
- Click **SAVE** 
- Wait **10-15 minutes** for changes to propagate
- Clear browser cache
- Try authentication again

## 🚨 Quick Debug Steps

### 1. Check Browser Console for Exact Error
Look for messages like:
- "origin not allowed"
- "redirect_uri_mismatch" 
- "client_id missing"
- "CORS error"

### 2. Verify Your URLs
Current setup should be:
- **Frontend**: `http://localhost:3000`
- **Backend**: `https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net`
- **Google Origins**: `http://localhost:3000`

### 3. Test with Demo Mode
If Google OAuth still fails, try the "Demo Version" button to test the rest of the app.

## 🎯 Expected Working Flow

1. Click "Sign in with Google"
2. Google popup opens (no CORS error)
3. You might see "App not verified" warning (normal)
4. Click "Advanced" → "Go to Stock Watchlist App (unsafe)"
5. Complete Google sign-in
6. Redirect back to your app
7. Dashboard loads successfully

## 💡 Pro Tip: Use Incognito Mode

Test in incognito/private browsing to avoid cached authentication states and get cleaner error messages.

The issue is almost certainly in your Google Cloud Console configuration, not your Node.js backend CORS policy!