// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/services/authService';
import config from '../config/apiConfig';

// Create auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load user on initial app load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem(config.AUTH_TOKEN_KEY);
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        const userData = await authService.getUserProfile();
        setUser(userData.data);
      } catch (err) {
        // Clear invalid token
        localStorage.removeItem(config.AUTH_TOKEN_KEY);
        setError('Authentication session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Register a new user
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      
      // Store token
      localStorage.setItem(config.AUTH_TOKEN_KEY, response.data.access_token);
      
      // Set user in state
      setUser(response.data.user);
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Login user
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      
      // Store token
      localStorage.setItem(config.AUTH_TOKEN_KEY, response.data.access_token);
      
      // Set user in state
      setUser(response.data.user);
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout user
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear user data and token regardless of API response
      localStorage.removeItem(config.AUTH_TOKEN_KEY);
      setUser(null);
      navigate('/login');
    }
  }, [navigate]);

  // Clear any auth errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};