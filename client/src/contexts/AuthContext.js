import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      console.log('Token set:', token.substring(0, 20) + '...');
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      console.log('Token removed');
    }
  }, [token]);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      const res = await axios.post('/api/auth/login', { email, password });
      const { token: newToken } = res.data;
      
      console.log('Login successful, token received');
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Set token in axios headers immediately
      axios.defaults.headers.common['x-auth-token'] = newToken;
      
      // Load user data
      const userRes = await axios.get('/api/auth/me');
      setUser(userRes.data);
      console.log('User data loaded:', userRes.data.name);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      const { token: newToken } = res.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Load user data
      const userRes = await axios.get('/api/auth/me');
      setUser(userRes.data);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/api/auth/profile', profileData);
      setUser(res.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const submitInterestQuiz = async (interests, careerGoals) => {
    try {
      await axios.post('/api/auth/interest-quiz', { interests, careerGoals });
      // Reload user data to get updated profile completion
      const userRes = await axios.get('/api/auth/me');
      setUser(userRes.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Quiz submission failed' 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    submitInterestQuiz,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
