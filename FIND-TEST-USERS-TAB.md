# Can't Find "Test Users" Tab - Complete OAuth Consent Screen Setup

## 🚨 Issue: "Test users" Tab Not Visible

If you don't see the "Test users" tab, it means your OAuth consent screen is not fully configured yet.

## 🔍 Why "Test Users" Tab is Missing

The tab sequence is:
1. **App information** (must be completed first)
2. **Scopes** (can be skipped)
3. **Test users** (only appears after App information is complete)
4. **Summary**

## 🔧 Step-by-Step Complete Setup

### Step 1: **Go to OAuth Consent Screen**
URL: https://console.cloud.google.com/apis/credentials/consent

### Step 2: **Check Current Status**
You should see one of these:

#### Scenario A: **Not Started Yet**
```
Configure consent screen
Choose how to configure and register your app
○ Internal - Users within your organization  
● External - Any user with a Google Account
[CREATE]
```
**Action**: Select "External" and click **CREATE**

#### Scenario B: **Started but Incomplete**
```
OAuth consent screen
App information | Scopes | Test users | Summary
Status: Draft
[EDIT APP]
```
**Action**: Click **EDIT APP**

#### Scenario C: **Only See "EDIT APP" Button**
```
OAuth consent screen
Publishing status: Testing
[EDIT APP]
```
**Action**: Click **EDIT APP**

### Step 3: **Complete App Information Tab**

Fill in ALL required fields:

```
App name: Stock Watchlist App
User support email: [Select your Gmail from dropdown]
App logo: [Skip - not required]

App domain:
Application home page: http://localhost:3000
Application privacy policy link: [Leave empty - optional]
Application terms of service link: [Leave empty - optional]

Authorized domains:
localhost
[ADD DOMAIN]

Developer contact information:
Email addresses: [Your Gmail address]
```

**IMPORTANT**: Click **"SAVE AND CONTINUE"** at the bottom

### Step 4: **Scopes Tab (Skip)**
- Don't add any additional scopes
- Click **"SAVE AND CONTINUE"**

### Step 5: **Test Users Tab (Now Visible)**
After completing App information, you should now see:

```
Test users
Add the email addresses of users who can test your app before publication.

Email addresses
[+ ADD USERS]

No test users added yet.
```

**Actions**:
1. Click **"+ ADD USERS"**
2. Enter your Gmail address
3. Click **"ADD"**
4. Click **"SAVE AND CONTINUE"**

### Step 6: **Summary Tab**
- Review all settings
- Click **"BACK TO DASHBOARD"**

## 🚨 If You Still Can't Find Test Users Tab

### Try This Direct Link:
https://console.cloud.google.com/apis/credentials/consent/edit

### Alternative Navigation:
1. Google Cloud Console
2. Select your project (top dropdown)
3. ☰ Menu → APIs & Services → OAuth consent screen
4. Click "EDIT APP"
5. Go through tabs: App information → Scopes → **Test users**

### Check Project Selection:
Make sure you're in the correct Google Cloud project:
- Look at project name in top bar
- Should be the same project where you created Client ID `712721544471-0guusgphe7das1dmdtidhh4d5q1jeek0`

## 🎯 Expected Tab Navigation

After setup, you should see these tabs when you click "EDIT APP":

```
App information | Scopes | Test users | Summary
     ↓              ↓         ↓         ↓
  Required      Optional   CRITICAL   Review
```

## 🔧 Quick Troubleshooting

### Issue: Still no tabs visible
- **Check**: Are you in the right Google Cloud project?
- **Try**: Refresh the page
- **Try**: Different browser or incognito mode

### Issue: Only see "CREATE" button
- **Action**: Select "External" user type
- **Action**: Click "CREATE" to start setup

### Issue: Tabs appear but Test users is grayed out
- **Cause**: App information tab not completed
- **Fix**: Go back to App information, fill all required fields

## 💡 Visual Clues

### What You Should See:
```
OAuth consent screen
┌─────────────────────────────────────────┐
│ App information | Scopes | Test users | Summary │
└─────────────────────────────────────────┘
                           ↑
                    This tab should be clickable
                    after App information is complete
```

### Completion Status:
- ✅ **App information**: All required fields filled
- ⚠️ **Scopes**: Can skip (basic scopes auto-included)
- 🎯 **Test users**: Your Gmail must be added here
- ✅ **Summary**: Review and complete

The "Test users" tab will only appear after you complete the "App information" section with all required fields!