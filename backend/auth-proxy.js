const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-domain.com'], // Add your domains
  credentials: true
}));

app.use(express.json());

// Google OAuth token exchange endpoint
app.post('/api/auth/google/token', async (req, res) => {
  try {
    const { code, redirect_uri } = req.body;
    
    console.log('🔄 Exchanging authorization code for access token...');
    
    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET, // Secure on server
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirect_uri
    });
    
    const tokenData = tokenResponse.data;
    console.log('✅ Token exchange successful');
    
    // Get user info using access token
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    
    const userInfo = userResponse.data;
    console.log('👤 Retrieved user info:', userInfo);
    
    // Return both token and user info
    res.json({
      success: true,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      user: {
        user_id: userInfo.id,
        user_name: userInfo.name, // ✅ Real Google user name!
        email: userInfo.email,
        picture: userInfo.picture,
        broker: 'google'
      }
    });
    
  } catch (error) {
    console.error('❌ OAuth token exchange failed:', error.response?.data || error.message);
    res.status(400).json({
      success: false,
      error: error.response?.data?.error_description || error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'Google OAuth Proxy' });
});

app.listen(PORT, () => {
  console.log(`🚀 OAuth proxy server running on port ${PORT}`);
  console.log(`📋 Make sure to set these environment variables:`);
  console.log(`   GOOGLE_CLIENT_ID=your-client-id`);
  console.log(`   GOOGLE_CLIENT_SECRET=your-client-secret`);
});