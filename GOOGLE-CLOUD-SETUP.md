# Google Cloud Console Setup - Step by Step Guide

## Option 1: Configure Authorized JavaScript Origins (Recommended)

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Make sure you're in the correct project (or create a new one if needed)

### Step 2: Navigate to Credentials
1. In the left sidebar, click on **"APIs & Services"**
2. Click on **"Credentials"**
3. You should see your OAuth 2.0 Client ID: `712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0`

### Step 3: Edit Your OAuth 2.0 Client ID
1. Find your Client ID in the list: `712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0`
2. Click on the **pencil/edit icon** next to it
3. This will open the "Edit OAuth client ID" page

### Step 4: Add Authorized JavaScript Origins
In the **"Authorized JavaScript origins"** section:
1. Click **"+ ADD URI"**
2. Enter: `http://localhost:3000`
3. Click **"+ ADD URI"** again (optional, for production later)
4. Enter: `https://yourdomain.com` (replace with your actual domain when deploying)

### Step 5: Add Authorized Redirect URIs (if needed)
In the **"Authorized redirect URIs"** section:
1. Click **"+ ADD URI"**
2. Enter: `http://localhost:3000/auth/callback`
3. Click **"+ ADD URI"** again
4. Enter: `http://localhost:3000`

### Step 6: Save Changes
1. Click the **"SAVE"** button at the bottom
2. Wait for the "Client ID updated" confirmation message

### Step 7: Enable Required APIs
1. Go back to **"APIs & Services"** → **"Library"**
2. Search for and enable these APIs:
   - **Google+ API** (or Google People API)
   - **Google Identity Toolkit API**
   - **Google Sign-In API**

### Step 8: Configure OAuth Consent Screen (if not done)
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** for user type (unless you have a Google Workspace)
3. Fill in required fields:
   - **App name**: Stock Watchlist App
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **"SAVE AND CONTINUE"**
5. Skip "Scopes" for now (click "SAVE AND CONTINUE")
6. Add test users if using "External" type:
   - Click **"+ ADD USERS"**
   - Add your email address
7. Click **"SAVE AND CONTINUE"**

## Current Error Analysis
Your error URL shows:
```
https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?client_id=712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0.apps.googleusercontent.com&...
```

This 403 error typically means:
- ❌ `http://localhost:3000` is NOT in your Authorized JavaScript origins
- ❌ OAuth consent screen might not be properly configured
- ❌ Required APIs might not be enabled

## After Setup - Test Steps
1. Save all changes in Google Cloud Console
2. Wait 5-10 minutes for changes to propagate
3. Clear your browser cache (Ctrl+Shift+Delete)
4. Go back to http://localhost:3000
5. Try "Sign in with Google" again

## Verification Checklist
- [ ] Client ID `712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0` exists
- [ ] Authorized JavaScript origins includes `http://localhost:3000`
- [ ] OAuth consent screen is configured
- [ ] Test user email is added (for external apps)
- [ ] Required APIs are enabled
- [ ] Changes saved and waited 5-10 minutes

## Need Help?
If you're still getting 403 after following these steps:
1. Check browser console for specific error messages
2. Verify the exact URLs in your Authorized JavaScript origins
3. Make sure there are no typos in the configuration
4. Try using an incognito/private browser window