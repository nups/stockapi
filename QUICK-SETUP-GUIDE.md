# Quick Visual Guide - Google Cloud Console Navigation

## 🎯 Your Goal: Add `http://localhost:3000` to Authorized JavaScript Origins

### 📍 Step-by-Step Navigation:

1. **Go to**: https://console.cloud.google.com/
2. **Click**: "APIs & Services" (left sidebar)
3. **Click**: "Credentials" 
4. **Find**: Your Client ID `712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0`
5. **Click**: The edit/pencil icon ✏️ next to your Client ID

### 📝 What to Add:

**In the "Authorized JavaScript origins" section:**
```
http://localhost:3000
```

**In the "Authorized redirect URIs" section (optional but recommended):**
```
http://localhost:3000
http://localhost:3000/auth/callback
```

### ⚠️ Common Mistakes to Avoid:
- ❌ Don't use `https://localhost:3000` (use `http://`)
- ❌ Don't add trailing slashes: `http://localhost:3000/`
- ❌ Don't forget to click "SAVE" button
- ❌ Don't skip the OAuth consent screen setup

### 🔍 Your Current Client ID:
```
712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0.apps.googleusercontent.com
```

### ✅ Success Indicators:
- You see "Client ID updated" message
- `http://localhost:3000` appears in the origins list
- No more 403 errors when testing authentication

### 🕒 After Making Changes:
1. Wait 5-10 minutes for Google's servers to update
2. Clear browser cache (Ctrl+Shift+Delete)
3. Test the app again at http://localhost:3000

---

**Need immediate help?** 
- Take a screenshot of your Google Cloud Console credentials page
- Check browser console (F12) for specific error messages
- Try testing in an incognito/private browser window