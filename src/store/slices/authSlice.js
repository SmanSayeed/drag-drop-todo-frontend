// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';
import config from '../../config/apiConfig';

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null,
  loading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    
    logout: (state) => {
      // Remove token from localStorage
      localStorage.removeItem(config.AUTH_TOKEN_KEY);
      
      // Reset state
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
    
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register mutation
      .addMatcher(
        authApi.endpoints.register.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.data.user;
          state.isAuthenticated = true;
          state.error = null;
          state.loading = false;
        }
      )
      .addMatcher(
        authApi.endpoints.register.matchRejected,
        (state, { payload }) => {
          state.error = payload?.data?.message || 'Registration failed';
          state.loading = false;
          state.isAuthenticated = false;
        }
      )
      
      // Login mutation
      .addMatcher(
        authApi.endpoints.login.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.data.user;
          state.isAuthenticated = true;
          state.error = null;
          state.loading = false;
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchRejected,
        (state, { payload }) => {
          state.error = payload?.data?.message || 'Login failed';
          state.loading = false;
          state.isAuthenticated = false;
        }
      )
      
      // Get user profile query
      .addMatcher(
        authApi.endpoints.getUserProfile.matchPending,
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        authApi.endpoints.getUserProfile.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
          state.isAuthenticated = true;
          state.error = null;
          state.loading = false;
        }
      )
      .addMatcher(
        authApi.endpoints.getUserProfile.matchRejected,
        (state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.loading = false;
        }
      )
      
      // Logout mutation
      .addMatcher(
        authApi.endpoints.logout.matchPending,
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        authApi.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.error = null;
          state.loading = false;
        }
      )
      .addMatcher(
        authApi.endpoints.logout.matchRejected,
        (state) => {
          // Even if logout fails, we want to clear state
          state.user = null;
          state.isAuthenticated = false;
          state.loading = false;
        }
      );
  },
});

export const { clearAuthError, logout, setAuthLoading } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;