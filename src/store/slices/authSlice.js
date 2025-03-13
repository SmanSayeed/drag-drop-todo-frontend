// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register mutation
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.data.user;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.register.matchRejected,
        (state, { payload }) => {
          state.error = payload?.data?.message || 'Registration failed';
        }
      )
      
      // Login mutation
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.data.user;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchRejected,
        (state, { payload }) => {
          state.error = payload?.data?.message || 'Login failed';
        }
      )
      
      // Get user profile query
      .addMatcher(
        authApi.endpoints.getUserProfile.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.getUserProfile.matchRejected,
        (state) => {
          state.user = null;
          state.isAuthenticated = false;
        }
      )
      
      // Logout mutation
      .addMatcher(
        authApi.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.error = null;
        }
      );
  },
});

export const { clearAuthError, logout } = authSlice.actions;

export default authSlice.reducer;