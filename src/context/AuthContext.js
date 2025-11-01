import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

// Auth Context
const AuthContext = createContext();

// Auth States
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Auth Actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Auth Reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload.error
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
}

// Auth Provider Component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on app load
  useEffect(() => {
    console.log('🚀 AuthProvider mounted, checking auth status...');
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('⏰ Auth check timeout, setting loading to false');
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }, 10000); // 10 second timeout
    
    checkAuthStatus().finally(() => {
      clearTimeout(timeoutId);
      console.log('✅ Auth check completed');
    });
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const checkAuthStatus = async () => {
    console.log('🔍 Checking authentication status...');
    
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const storedToken = localStorage.getItem('google_auth_token');
      const storedProfile = localStorage.getItem('user_profile');
      
      console.log('📄 Stored token exists:', !!storedToken);
      console.log('👤 Stored profile exists:', !!storedProfile);
      
      if (storedToken && storedProfile) {
        try {
          const userProfile = JSON.parse(storedProfile);
          console.log('👤 Parsed user profile:', userProfile);
          
          // Check if it's a Google JWT token
          if (storedToken.startsWith('eyJ')) {
            console.log('🔐 Processing Google JWT token...');
            const tokenData = authService.parseJwt(storedToken);
            
            if (tokenData) {
              const currentTime = Date.now() / 1000;
              const isExpired = tokenData.exp <= currentTime;
              
              console.log('⏰ Token expires at:', new Date(tokenData.exp * 1000));
              console.log('⏰ Current time:', new Date(currentTime * 1000));
              console.log('⏰ Token expired:', isExpired);
              
              if (!isExpired) {
                console.log('✅ Token valid, logging in user');
                dispatch({
                  type: AUTH_ACTIONS.LOGIN_SUCCESS,
                  payload: { 
                    user: {
                      user_id: tokenData.sub,
                      user_name: tokenData.name || userProfile.user_name,
                      email: tokenData.email || userProfile.email,
                      picture: tokenData.picture || userProfile.picture,
                      broker: 'google'
                    }
                  }
                });
                return;
              } else {
                console.log('❌ Token expired, clearing storage');
              }
            } else {
              console.log('❌ Failed to parse JWT token');
            }
          } else {
            console.log('📝 Non-JWT token, using stored profile');
            // For non-JWT tokens, just use the stored profile
            if (userProfile && userProfile.email) {
              dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { user: userProfile }
              });
              return;
            }
          }
        } catch (parseError) {
          console.error('❌ Profile parsing failed:', parseError);
        }
        
        // Token invalid, expired, or parsing failed - clear storage
        console.log('🧹 Clearing invalid token and profile');
        localStorage.removeItem('google_auth_token');
        localStorage.removeItem('user_profile');
      }
      
      // No valid session found
      console.log('🚪 No valid session, user not authenticated');
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      localStorage.removeItem('google_auth_token');
      localStorage.removeItem('user_profile');
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      // Handle Google OAuth credentials (already processed)
      if (credentials.token && credentials.user) {
        // Store the token and user info
        localStorage.setItem('google_auth_token', credentials.token);
        localStorage.setItem('user_profile', JSON.stringify(credentials.user));
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: credentials.user }
        });
        
        return { success: true };
      }
      
      // Handle regular login credentials (username/password) - call backend
      const response = await authService.login(credentials);
      
      if (response.success) {
        // Store token
        localStorage.setItem('google_auth_token', response.token);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: response.user }
        });
        
        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: { error: response.error || 'Login failed' }
        });
        
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: errorMessage }
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const loginWithGoogle = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      // Initialize Google OAuth
      const response = await authService.loginWithGoogle();
      
      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: response.user }
        });
        
        return { success: true };
      } else {
        throw new Error('Google authentication failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Google login failed';
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: errorMessage }
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Try to call backend logout (may fail due to CORS)
      try {
        await authService.logout();
      } catch (error) {
        console.log('Backend logout failed (CORS?), continuing with local logout:', error.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and update state
      localStorage.removeItem('google_auth_token');
      localStorage.removeItem('user_profile');
      
      // Google logout
      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.disableAutoSelect();
        } catch (googleError) {
          console.log('Google logout failed:', googleError.message);
        }
      }
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    loginWithGoogle,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}