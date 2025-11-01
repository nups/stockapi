import axios from 'axios';

const API_BASE_URL = 'https://stockapi3-c6h7ejh2eedabuf6.centralindia-01.azurewebsites.net';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '1095166844524-0m0q9qofqhsrn7c8ui0g2u8gj5jp9c7j.apps.googleusercontent.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('google_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Also add as query param for backward compatibility
      config.params = { ...config.params, session: token };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('google_auth_token');
      localStorage.removeItem('user_profile');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Google OAuth helper functions
const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts) {
      resolve(window.google.accounts);
    } else {
      // Wait for Google Identity Services to load
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.accounts) {
          clearInterval(checkGoogle);
          resolve(window.google.accounts);
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkGoogle);
        reject(new Error('Google Identity Services failed to load'));
      }, 10000);
    }
  });
};

export const authService = {
  // Google OAuth login
  async loginWithGoogle() {
    try {
      const google = await initializeGoogleAuth();
      
      return new Promise((resolve, reject) => {
        google.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response.credential) {
              // Decode the JWT token to get user info
              const userInfo = this.parseJwt(response.credential);
              
              // Store the token and user info
              localStorage.setItem('google_auth_token', response.credential);
              localStorage.setItem('user_profile', JSON.stringify(userInfo));
              
              resolve({
                success: true,
                user: {
                  user_id: userInfo.sub,
                  user_name: userInfo.name,
                  email: userInfo.email,
                  picture: userInfo.picture,
                  broker: 'google'
                },
                token: response.credential
              });
            } else {
              reject(new Error('Google authentication failed'));
            }
          }
        });
        
        // Render the sign-in button
        google.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%'
          }
        );
      });
    } catch (error) {
      throw new Error(`Google authentication error: ${error.message}`);
    }
  },

  // Parse JWT token to extract user information
  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to parse JWT token:', error);
      return null;
    }
  },

  // Regular login (if you want to add username/password later)
  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials);
      return {
        success: true,
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Verify existing token
  async verifyToken(token) {
    try {
      // For Google tokens, we can verify locally since they're JWTs
      if (token.startsWith('eyJ')) {
        const userInfo = this.parseJwt(token);
        if (userInfo && userInfo.exp > Date.now() / 1000) {
          return {
            user_id: userInfo.sub,
            user_name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            broker: 'google'
          };
        }
      }
      
      // Fallback to API verification
      const response = await api.get('/api/auth/verify', {
        params: { session: token }
      });
      
      return response.data.user;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  },

  // Logout
  async logout() {
    try {
      // Google logout
      if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
      }
      
      // Clear local storage
      localStorage.removeItem('google_auth_token');
      localStorage.removeItem('user_profile');
      
      // Optional: Call backend logout API
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
  },

  // Get user profile
  async getProfile() {
    try {
      const storedProfile = localStorage.getItem('user_profile');
      if (storedProfile) {
        return JSON.parse(storedProfile);
      }
      
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch profile');
    }
  }
};

export default api;