# Finding the "Test Users" Section - Step by Step

## 🔍 Where to Find "Test Users" in Google Cloud Console

### Step 1: Navigate to OAuth Consent Screen
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"APIs & Services"** (left sidebar)
3. Click **"OAuth consent screen"** (not "Credentials")

### Step 2: Check Your Current Screen
You should see one of these scenarios:

#### Scenario A: OAuth Consent Screen Not Set Up Yet
**What you see:**
```
Configure consent screen
Choose how to configure and register your app
○ Internal - Users within your organization
● External - Any user with a Google Account
[CREATE]
```

**Action:** 
- Make sure "External" is selected
- Click **"CREATE"**

#### Scenario B: OAuth Consent Screen Partially Configured
**What you see:**
```
OAuth consent screen
App information | Scopes | Test users | Summary
[Edit App]
```

**Action:**
- Click **"EDIT APP"** button
- This will take you through the configuration wizard

#### Scenario C: OAuth Consent Screen Fully Configured
**What you see:**
```
OAuth consent screen
Publishing status: Testing
User type: External
[Edit App] [Publish App]
```

**Action:**
- Click **"EDIT APP"** to modify settings

### Step 3: Navigate Through the Configuration Wizard

Once you click "CREATE" or "EDIT APP", you'll go through these tabs:

#### Tab 1: App Information
Fill in:
- **App name:** `Stock Watchlist App`
- **User support email:** [Your email]
- **Developer contact information:** [Your email]
- **Authorized domains:** Add `localhost`

Click **"SAVE AND CONTINUE"**

#### Tab 2: Scopes (Skip This)
- Don't add any additional scopes
- Click **"SAVE AND CONTINUE"**

#### Tab 3: Test Users (This is where you add users!)
**This is the section you're looking for!**

You should see:
```
Test users
Add the email addresses of users who can test your app before publication.

Email addresses
[+ ADD USERS]

No test users added yet.
```

**Actions:**
1. Click **"+ ADD USERS"**
2. Enter your Gmail address
3. Click **"ADD"**
4. Click **"SAVE AND CONTINUE"**

#### Tab 4: Summary
- Review your settings
- Click **"BACK TO DASHBOARD"**

## 🚨 Troubleshooting: Still Don't See "Test Users"?

### Issue 1: You're in the Wrong Section
- ❌ Don't go to "Credentials" 
- ✅ Go to "OAuth consent screen"

### Issue 2: OAuth Consent Screen Not Configured
- You need to complete the initial setup first
- Go through all tabs: App Information → Scopes → Test Users → Summary

### Issue 3: Using Internal Instead of External
- "Test users" section only appears for External apps
- Internal apps don't have test user restrictions

### Issue 4: Browser/Cache Issues
- Try refreshing the page
- Clear browser cache
- Try incognito/private browsing mode

## 📱 Visual Guide - What to Look For:

### In APIs & Services Menu:
```
APIs & Services
├── Dashboard
├── Library
├── Credentials          ← NOT here
├── OAuth consent screen ← GO HERE
├── Domain verification
└── Usage
```

### In OAuth Consent Screen:
```
OAuth consent screen
┌─────────────────────────────────┐
│ App information | Scopes | Test users | Summary │
└─────────────────────────────────┘
                           ↑
                    This tab has the
                    "+ ADD USERS" button
```

## 🎯 Current Status Check:

Let me help you identify where you are:

1. **Go to**: https://console.cloud.google.com/apis/credentials/consent
2. **What do you see?**
   - [ ] "Configure consent screen" (need to set up)
   - [ ] "OAuth consent screen" with "Edit App" button (configured)
   - [ ] Something else?

3. **If you see "Edit App"**, click it and look for the tabs at the top
4. **Click the "Test users" tab** (third tab)
5. **You should see "+ ADD USERS" button**

## 🆘 If You Still Can't Find It:

1. **Try this direct link**: https://console.cloud.google.com/apis/credentials/consent
2. **Take a screenshot** of what you see
3. **Check that you're in the right Google Cloud project**
4. **Make sure you selected "External" user type initially**

The Test users section is definitely there for External OAuth apps - we just need to find the right path to it!