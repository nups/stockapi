# Handling "App Not Verified" Warning - External OAuth Apps

## 🚨 What You'll See: "This app isn't verified"

When you try to sign in with Google, you might see this warning screen:

```
This app isn't verified

This app hasn't been verified by Google yet. Only proceed if you know and trust the developer.

[Back to safety]  [Advanced]
```

## ✅ This is NORMAL and EXPECTED for external OAuth apps in testing mode!

### 🔧 How to Proceed (Safe for your own app):

1. **Click "Advanced"** (small link at bottom left)
2. **Click "Go to Stock Watchlist App (unsafe)"**
3. **Continue with the login process**

### 🛡️ Why This Happens:

- **External OAuth apps** start in "Testing" mode
- Google shows this warning for unverified apps
- **It's safe to proceed** when it's YOUR OWN app
- The warning protects users from malicious apps

### 🏆 How to Remove This Warning (Optional):

#### Option 1: Keep in Testing Mode (Recommended for personal use)
- ✅ **Pros**: No verification needed, works immediately
- ⚠️ **Cons**: Warning screen for users, limited to 100 test users
- **Best for**: Personal projects, development, small team use

#### Option 2: Submit for Google Verification (For public apps)
- ✅ **Pros**: No warning screen, unlimited users
- ⚠️ **Cons**: Takes weeks/months, requires detailed review
- **Requirements**:
  - Privacy policy hosted online
  - Terms of service
  - Detailed app description
  - Security review by Google
- **Best for**: Public applications with many users

## 🎯 For Your Stock Watchlist App:

### Recommended Approach: Stay in Testing Mode
Since this is a personal stock watchlist app:
1. **Keep the app in testing mode**
2. **Add your email(s) as test users**
3. **Accept the "App not verified" warning**
4. **Enjoy full functionality without Google's lengthy review process**

### Test User Management:
```
✅ Add your primary Gmail
✅ Add any other emails you want to test with
✅ Up to 100 test users allowed
✅ No expiration date for testing mode
```

## 🧪 Expected Login Flow:

### Step-by-Step Experience:
1. **Click "Sign in with Google"** in your app
2. **Google OAuth popup opens**
3. **See "App not verified" warning** (this is normal!)
4. **Click "Advanced"**
5. **Click "Go to Stock Watchlist App (unsafe)"**
6. **Select your Google account**
7. **Grant permissions** (email, profile access)
8. **Redirect back to your app** with successful login

## 🚨 Troubleshooting Login Issues:

### Error: "Access blocked: This app's request is invalid"
**Solution**: Check OAuth consent screen configuration
- Make sure app name is set
- Verify test users are added
- Check authorized domains include "localhost"

### Error: "redirect_uri_mismatch"
**Solution**: Check authorized redirect URIs
- Must include `http://localhost:3000`
- No trailing slashes
- Exact URL match required

### Error: "origin_mismatch"
**Solution**: Check authorized JavaScript origins
- Must include `http://localhost:3000`
- Use `http://` not `https://` for localhost
- No trailing slashes

## 📱 Quick Action Items:

### For External Consent Screen:
- [ ] Set user type to "External"
- [ ] Add app name: "Stock Watchlist App"
- [ ] Add your email as support contact
- [ ] Add authorized domain: "localhost"
- [ ] Add your email as test user
- [ ] Save all changes

### For OAuth Credentials:
- [ ] Add JavaScript origin: `http://localhost:3000`
- [ ] Add redirect URI: `http://localhost:3000`
- [ ] Save credentials

### For Testing:
- [ ] Wait 10-15 minutes after changes
- [ ] Clear browser cache
- [ ] Be prepared to click "Advanced" → "Go to app (unsafe)"
- [ ] Use email that's in your test users list

## 🎉 Success Indicators:
- OAuth popup opens without immediate errors
- You can proceed past the "not verified" warning
- Login completes and redirects to your app
- You see your profile information in the app