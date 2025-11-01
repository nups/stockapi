# Fix CORS Issue on Azure Flask Backend

## 🚨 Problem: CORS Error from Backend Server

Your React app (`http://localhost:3000`) is trying to call your Azure-hosted Flask API (`https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net`), but the server is blocking the request due to CORS policy.

## 🔧 Solution: Update Flask Backend with CORS Configuration

### 1. **Install Flask-CORS** (if not already installed)

```bash
pip install flask-cors
```

### 2. **Update Your Flask App with CORS Support**

Add this to your Flask `app.py` or main server file:

```python
from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import time
from datetime import datetime, timedelta

app = Flask(__name__)

# Configure CORS to allow requests from your React app
CORS(app, origins=[
    "http://localhost:3000",          # Local development
    "https://localhost:3000",         # Local HTTPS
    "http://127.0.0.1:3000",         # Alternative localhost
    "https://127.0.0.1:3000",        # Alternative localhost HTTPS
    # Add your production domain when you deploy
    # "https://yourdomain.com"
], 
credentials=True,
allow_headers=["Content-Type", "Authorization"],
methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Your existing routes...
@app.route('/api/auth/verify', methods=['GET'])
def verify_token():
    # Your token verification logic
    pass

@app.route('/api/auth/login', methods=['POST'])
def login():
    # Your login logic
    pass

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    # Your logout logic
    pass

# ... rest of your routes
```

### 3. **Alternative: Simple CORS Configuration**

If you want to allow all origins during development:

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Allow all origins during development (NOT for production)
CORS(app)

# Your routes...
```

### 4. **For Production: Specific CORS Configuration**

```python
from flask_cors import CORS

# Production-ready CORS configuration
CORS(app, origins=[
    "https://yourdomain.com",
    "https://www.yourdomain.com"
], 
credentials=True,
supports_credentials=True)
```

## 🚀 Deploy Updated Backend to Azure

### Option 1: Update via Git (if you have repo connected)
```bash
git add .
git commit -m "Add CORS configuration for localhost"
git push origin main
```

### Option 2: Update via Azure Portal
1. Go to Azure Portal
2. Navigate to your App Service
3. Use "Advanced Tools" (Kudu) to update files
4. Or use VS Code Azure extension

### Option 3: Redeploy from Local
Use Azure CLI or VS Code to redeploy your updated Flask app.

## 🧪 Test CORS Fix

### 1. **Check CORS Headers**
Open browser dev tools → Network tab → Make a request → Check response headers:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

### 2. **Test API Endpoints**
From browser console or Postman:
```javascript
fetch('https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net/api/auth/verify', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## 📋 Complete Flask App Example

```python
from flask import Flask, jsonify, request
from flask_cors import CORS
import jwt
import time

app = Flask(__name__)

# CORS Configuration
CORS(app, origins=[
    "http://localhost:3000",
    "https://localhost:3000",
], credentials=True)

# Your existing routes
@app.route('/api/auth/verify', methods=['GET'])
def verify_token():
    try:
        token = request.args.get('session')
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        # Your token verification logic here
        # For Google JWT tokens, you might skip verification
        # since they're verified client-side
        
        return jsonify({
            'user': {
                'user_id': 'verified_user',
                'email': 'user@example.com'
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 401

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        # Your login logic
        return jsonify({
            'success': True,
            'user': data.get('user'),
            'token': data.get('token')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    return jsonify({'success': True})

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': time.time()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

## ⚡ Quick Fix for Immediate Testing

### Add this single line to your Flask app:
```python
from flask_cors import CORS
CORS(app)  # This allows all origins - for development only
```

## 🎯 Expected Result After Fix

1. ✅ No more CORS errors in browser console
2. ✅ React app can successfully call Azure API
3. ✅ Google authentication works end-to-end
4. ✅ User can access dashboard after login

Update your Flask backend with the CORS configuration and redeploy to Azure. The authentication should work smoothly after this fix!