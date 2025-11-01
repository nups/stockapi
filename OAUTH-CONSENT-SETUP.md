# OAuth Consent Screen Setup - External Users

## 🎯 Goal: Configure External OAuth Consent Screen for Your Stock Watchlist App

### 📍 Step 1: Navigate to OAuth Consent Screen
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"APIs & Services"** in the left sidebar
3. Click **"OAuth consent screen"**

### 📝 Step 2: Choose User Type
- Select **"External"** (this allows any Google user to sign in)
- Click **"CREATE"**

### 🔧 Step 3: App Information (Required Fields)
Fill in these required fields:

**App name:**
```
Stock Watchlist App
```

**User support email:**
```
[Your Gmail address - select from dropdown]
```

**App logo (Optional):**
- Skip for now, you can add later

**App domain (Optional but recommended):**
- **Application home page:** `http://localhost:3000`
- **Application privacy policy link:** `http://localhost:3000/privacy` (optional)
- **Application terms of service link:** `http://localhost:3000/terms` (optional)

**Authorized domains:**
- Add: `localhost` (without http:// or port)

**Developer contact information:**
```
[Your email address]
```

Click **"SAVE AND CONTINUE"**

### 🔒 Step 4: Scopes (Skip for Basic Auth)
- For basic Google Sign-In, you don't need to add additional scopes
- The default scopes (email, profile, openid) are automatically included
- Click **"SAVE AND CONTINUE"** to skip this section

### 👥 Step 5: Test Users (Important for External Apps)
Since you're using "External" type, you need to add test users:

1. Click **"+ ADD USERS"**
2. Add your email addresses (the ones you want to test with):
   ```
   your-email@gmail.com
   another-test-email@gmail.com
   ```
3. Click **"ADD"**
4. Click **"SAVE AND CONTINUE"**

### 📋 Step 6: Summary and Submit
- Review all your settings
- Click **"BACK TO DASHBOARD"**

## 🚨 Important Notes for External Apps:

### Testing Phase Limitations:
- **External apps start in "Testing" mode**
- Only test users you added can sign in
- You can have up to 100 test users
- Testing mode has no expiration

### Publishing (Optional - Not needed for personal use):
- To allow ANY Google user, you need to submit for verification
- This requires Google's review process (can take weeks)
- **Not necessary for personal/development use**

## 🔧 Current Configuration for Your App:

Based on your Client ID `712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0`:

### Required Settings:
```
✅ User Type: External
✅ App Name: Stock Watchlist App
✅ User Support Email: [Your Gmail]
✅ Developer Contact: [Your Gmail]
✅ Authorized Domain: localhost
✅ Test Users: [Your Gmail addresses]
```

### OAuth Settings:
```
✅ Client ID: 712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0
✅ Authorized JavaScript Origins: http://localhost:3000
✅ Authorized Redirect URIs: http://localhost:3000
```

## ⚠️ Common Issues and Solutions:

### Issue: "App Not Verified" Warning
- **Solution**: This is normal for external apps in testing mode
- Users will see a warning screen - click "Advanced" → "Go to [App Name] (unsafe)"
- This warning disappears after Google verification (not needed for personal use)

### Issue: "Access Blocked" Error
- **Solution**: Make sure the signing-in email is in your test users list
- Add the email address in OAuth consent screen → Test users section

### Issue: Still Getting 403 Errors
- **Solution**: 
  1. Verify consent screen is saved
  2. Check test users are added
  3. Wait 10-15 minutes for changes to propagate
  4. Clear browser cache

## 🧪 Testing Your Setup:

### After Configuration:
1. **Wait 10-15 minutes** for all changes to take effect
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. Go to `http://localhost:3000`
4. Click "Sign in with Google"
5. **Expected flow**:
   - Google OAuth popup opens
   - You might see "App not verified" warning (click Advanced → Continue)
   - Login with test user email
   - Should redirect back to your app successfully

## 🆘 Need Help?

If you're still having issues:
1. Check which email you're trying to sign in with
2. Make sure that email is in your test users list
3. Take a screenshot of any error messages
4. Check browser console (F12) for detailed errors

## 📱 Quick Checklist:
- [ ] OAuth consent screen configured as "External"
- [ ] App name set to "Stock Watchlist App"
- [ ] Your email added as test user
- [ ] Authorized domain includes "localhost"
- [ ] All changes saved
- [ ] Waited 10-15 minutes
- [ ] Browser cache cleared