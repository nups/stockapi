# Fix "Invalid domain: must be a top private domain" Error

## 🚨 Issue: Google Doesn't Accept "localhost" as Authorized Domain

Google's OAuth consent screen doesn't allow `localhost` in the authorized domains field for external apps. This is normal and expected.

## ✅ Solution: Leave Authorized Domains EMPTY

For development with `localhost`, you should:

### **1. Delete "localhost" from Authorized Domain 1**
- Clear the first field completely
- Leave it empty

### **2. Leave Authorized Domain 2 Empty**
- Don't add anything to the second field

### **3. This is Normal for Development**
- Google allows OAuth to work with `localhost` even without it being in authorized domains
- The authorized domains field is primarily for production domains

## 🔧 Alternative: Skip Authorized Domains for Now

Since you're developing locally, you can:

1. **Leave both domain fields empty**
2. **Continue with the rest of the setup**
3. **Add production domains later when you deploy**

## 📋 Complete Setup Without Authorized Domains

### **Your current form should have:**
```
App name: Stock Watchlist App
User support email: noopurshukla2012@gmail.com ✅
Application home page: http://localhost:3000 (if there's a field for this)
Authorized domains: [LEAVE EMPTY]
Developer contact: noopurshukla2012@gmail.com
```

## 🎯 Next Steps

1. **Clear the "localhost" from authorized domains**
2. **Save the form** (it should accept empty domains)
3. **Navigate to "Audience" section** to add test users
4. **Add your email as test user**

## 💡 Why This Works

- Google OAuth works with `localhost` for development
- Authorized domains are for production use
- Your OAuth Client ID configuration (in Credentials) is what matters for `localhost`

## 🔧 For Production Later

When you deploy to production, you'll add your real domain:
```
yourdomain.com
www.yourdomain.com
```

## 🚨 Important: Focus on OAuth Client ID Configuration

The important configuration for `localhost` is in:
**APIs & Services → Credentials → Your OAuth 2.0 Client ID**

Make sure that has:
- ✅ **Authorized JavaScript origins**: `http://localhost:3000`
- ✅ **Authorized redirect URIs**: `http://localhost:3000`

**Just leave the authorized domains empty and continue with the setup!**