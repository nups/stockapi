# Authorized Domains Configuration for OAuth Consent Screen

## 🎯 What to Add in "Authorized domains"

For your Stock Watchlist app, add these domains:

### **For Development (Current Setup):**
```
localhost
```

### **Important Notes:**
- ✅ Use `localhost` (without http:// or https://)
- ✅ Do NOT include port numbers (no :3000)
- ✅ Do NOT include protocols (no http:// or https://)
- ✅ Just the domain name only

## 🚨 Common Mistakes to Avoid:

### ❌ Wrong formats:
- `http://localhost:3000` (don't include protocol or port)
- `https://localhost:3000` (don't include protocol or port)
- `localhost:3000` (don't include port)
- `127.0.0.1` (use localhost instead)

### ✅ Correct format:
- `localhost`

## 🔧 Complete Setup for Your App:

Based on your current configuration, here's what you should have:

### **App Information:**
```
App name: Stock Watchlist App (change from "Stock api")
User support email: noopurshukla2012@gmail.com ✅ (already set)
```

### **App domains:**
```
Application home page: http://localhost:3000
Application privacy policy link: [Leave empty - optional]
Application terms of service link: [Leave empty - optional]
```

### **Authorized domains:**
```
localhost
```

### **Developer contact information:**
```
Email addresses: noopurshukla2012@gmail.com ✅ (should match user support email)
```

## 🚀 For Future Production Deployment:

When you deploy your app to production, you'll need to add your production domain:

### **Example for production:**
```
localhost                    ← Keep for development
yourdomain.com              ← Add when you have a production domain
www.yourdomain.com          ← Add if you use www subdomain
```

## 📋 Current Setup Summary

For now, just add:
- **Authorized domains**: `localhost`

This will allow your Google OAuth to work with your React app running on `http://localhost:3000`.

## 🎯 Next Steps After Adding Domain:

1. **Add authorized domain**: `localhost`
2. **Save changes**
3. **Navigate to "Audience" section** to add test users
4. **Add your email** `noopurshukla2012@gmail.com` as test user
5. **Save and wait 10-15 minutes** for changes to propagate
6. **Test your Google authentication**

Just type `localhost` in the authorized domains field - that's all you need for now!