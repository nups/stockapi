# ✅ EXACT FIX for "Error 400: redirect_uri_mismatch"

## 🎯 Problem Identified
Your Google OAuth is failing with: **Error 400: redirect_uri_mismatch**

This means the redirect URI in your OAuth 2.0 Client ID settings doesn't match what your React app is sending.

## 📋 EXACT STEPS TO FIX

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com/
2. Navigate to: **APIs & Services → Credentials**
3. Find your OAuth 2.0 Client ID: `712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0`
4. **Click the edit (pencil) icon**

### Step 2: Fix Authorized JavaScript Origins
In the **Authorized JavaScript origins** section, make sure you have EXACTLY:
```
http://localhost:3000
```

**❌ DO NOT ADD:**
- `https://localhost:3000` (no https for localhost)
- `http://localhost:3000/` (no trailing slash)
- Any other variations

### Step 3: Fix Authorized Redirect URIs
In the **Authorized redirect URIs** section, you need to add EXACTLY:

```
http://localhost:3000
http://localhost:3000/auth/google/callback
http://localhost:3000/auth/callback
```

**Why 3 URIs?**
- First one: Default redirect for Google Identity Services
- Second & Third: Common callback patterns that React might use

### Step 4: Save and Wait
1. **Click "SAVE"** at the bottom
2. **Wait 5-10 minutes** for Google to propagate changes
3. **Clear browser cache** or use incognito mode

## 🧪 Test After Changes

### Option 1: Restart Your React App
```bash
# Stop current server (Ctrl+C if running)
npm start
```

### Option 2: Test in Incognito Mode
- Open new incognito/private browser window
- Go to `http://localhost:3000`
- Try Google login

## 🔍 If Still Not Working

### Check the Network Tab
1. Open browser Developer Tools (F12)
2. Go to **Network** tab
3. Try Google login
4. Look for the failing request - it will show the exact redirect_uri being sent

### Manual Verification URL
Try this URL directly in browser (replace YOUR_EMAIL with noopurshukla2012@gmail.com):

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0.apps.googleusercontent.com&redirect_uri=http://localhost:3000&response_type=code&scope=openid%20email%20profile&login_hint=noopurshukla2012@gmail.com
```

If this URL works, then the issue is in your React app's redirect URI configuration.

## 📱 Common Redirect URI Mistakes

❌ **Wrong**: `https://localhost:3000`
✅ **Correct**: `http://localhost:3000`

❌ **Wrong**: `http://localhost:3000/`
✅ **Correct**: `http://localhost:3000`

❌ **Wrong**: Missing the base domain
✅ **Correct**: Must include `http://localhost:3000` as the first entry

## 🚀 Quick Priority Fix

**RIGHT NOW**: Go add all three redirect URIs:
1. `http://localhost:3000`
2. `http://localhost:3000/auth/google/callback`
3. `http://localhost:3000/auth/callback`

This covers all possible redirect patterns your React app might use.

## 💡 Why This Happens

Google is very strict about redirect URIs for security. Even a tiny difference (like https vs http, or a trailing slash) will cause this error.

Your React app is probably trying to redirect to `http://localhost:3000` but your OAuth client settings might not have this exact URI.

---

**Next Step**: Add those 3 redirect URIs to your OAuth 2.0 Client ID settings and save. Wait 5-10 minutes, then test in incognito mode.

Let me know if you need help finding the exact location in Google Cloud Console!