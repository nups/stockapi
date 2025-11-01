# Fix "Origin Not Allowed" Error - Step by Step

## 🚨 Error: "The given origin is not allowed for the given client ID"

This error means your OAuth Client ID `712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0` doesn't have `http://localhost:3000` in its authorized origins.

## 🎯 EXACT Steps to Fix This:

### Step 1: Go to Credentials (Not OAuth Consent Screen)
1. **URL**: https://console.cloud.google.com/apis/credentials
2. Or navigate: APIs & Services → **Credentials**

### Step 2: Find Your OAuth 2.0 Client ID
Look for:
```
OAuth 2.0 Client IDs
Name: [Some name]
Client ID: 712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0.apps.googleusercontent.com
```

### Step 3: Click the Edit Icon (Pencil)
- Click the **✏️ pencil icon** next to your Client ID
- This opens the "Edit OAuth client ID" page

### Step 4: Add Authorized JavaScript Origins
In the **"Authorized JavaScript origins"** section:

**Current state (probably empty or has wrong URLs):**
```
Authorized JavaScript origins
[Empty or has other URLs]
```

**What you need to add:**
1. Click **"+ ADD URI"**
2. Enter exactly: `http://localhost:3000`
3. **Important**: Use `http://` NOT `https://`
4. **Important**: No trailing slash `/`

**Final should look like:**
```
Authorized JavaScript origins
URIs
1. http://localhost:3000
```

### Step 5: Add Authorized Redirect URIs (Recommended)
In the **"Authorized redirect URIs"** section:
1. Click **"+ ADD URI"**
2. Enter: `http://localhost:3000`
3. Click **"+ ADD URI"** again (optional)
4. Enter: `http://localhost:3000/auth/callback`

### Step 6: Save Changes
1. Scroll down and click the **"SAVE"** button
2. Wait for "OAuth client updated successfully" message

## ⚠️ Common Mistakes to Avoid:

### ❌ Wrong URLs:
- `https://localhost:3000` (should be `http://`)
- `http://localhost:3000/` (no trailing slash)
- `localhost:3000` (missing protocol)
- `http://127.0.0.1:3000` (use localhost, not IP)

### ✅ Correct URL:
- `http://localhost:3000`

## 🕒 After Making Changes:

### Immediate Steps:
1. **Wait 5-10 minutes** for Google's servers to update
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Close and reopen your browser**
4. **Go back to** http://localhost:3000
5. **Try "Sign in with Google" again**

## 🧪 Testing the Fix:

### What Should Happen Now:
1. Click "Sign in with Google"
2. **No more "origin not allowed" error**
3. Google OAuth popup should open properly
4. You might see "App not verified" warning (that's different and normal)
5. Complete the login process

### If You Still Get Errors:
- Double-check the exact URL: `http://localhost:3000`
- Make sure you clicked "SAVE" in the credentials page
- Wait longer (sometimes takes 15 minutes)
- Try incognito/private browsing mode

## 📋 Checklist:

- [ ] Went to APIs & Services → Credentials (not OAuth consent screen)
- [ ] Found Client ID: 712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0
- [ ] Clicked the edit (pencil) icon
- [ ] Added `http://localhost:3000` to Authorized JavaScript origins
- [ ] Used `http://` not `https://`
- [ ] No trailing slash
- [ ] Clicked SAVE button
- [ ] Waited 5-10 minutes
- [ ] Cleared browser cache

## 🎯 Your Exact Configuration Should Be:

```
OAuth 2.0 Client ID: 712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0

Authorized JavaScript origins:
- http://localhost:3000

Authorized redirect URIs:
- http://localhost:3000
- http://localhost:3000/auth/callback (optional)
```

This will fix the "origin not allowed" error and let your app authenticate properly!