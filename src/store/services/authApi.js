// src/store/services/authApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';
import config from '../../config/apiConfig';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    // Register a new user
    register: builder.mutation({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response) => {
        // Store token in localStorage
        if (response.success && response.data.access_token) {
          localStorage.setItem(config.AUTH_TOKEN_KEY, response.data.access_token);
        }
        return response;
      },
    }),
    
    // Login a user
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        // Store token in localStorage
        if (response.success && response.data.access_token) {
          localStorage.setItem(config.AUTH_TOKEN_KEY, response.data.access_token);
        }
        return response;
      },
    }),
    
    // Get current user profile
    getUserProfile: builder.query({
      query: () => '/user',
      transformResponse: (response) => response.data,
    }),
    
    // Logout a user
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      // Always clear token even if API call fails
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          localStorage.removeItem(config.AUTH_TOKEN_KEY);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetUserProfileQuery,
  useLogoutMutation,
} = authApi;