// src/store/services/baseQuery.js
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config/apiConfig';

/**
 * Base query configuration for RTK Query
 * Configures headers, authentication, and base URL for all API requests
 */
const baseFetchQuery = fetchBaseQuery({
  baseUrl: config.API_BASE_URL,
  prepareHeaders: (headers) => {
    // Get token from localStorage
    const token = localStorage.getItem(config.AUTH_TOKEN_KEY);
    
    // Add authorization header if token exists
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Set default headers
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    
    return headers;
  },
  // Add custom timeout
  timeout: config.API_TIMEOUT,
});

/**
 * Enhanced base query with global error handling
 * Handles common API errors like 401 Unauthorized, 403 Forbidden, 404 Not Found, etc.
 */
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  // Execute the basic query
  const result = await baseFetchQuery(args, api, extraOptions);
  
  // Handle network errors
  if (result.error) {
    const { status, data } = result.error;
    
    // Handle specific HTTP status codes
    switch (status) {
      case 401: // Unauthorized
        // If we get a 401, the token is likely expired
        // Clear auth token
        if (localStorage.getItem(config.AUTH_TOKEN_KEY)) {
          localStorage.removeItem(config.AUTH_TOKEN_KEY);
          
          // You could dispatch a logout action here if needed
          // api.dispatch(logout());
          
          // You could also redirect to login page using window.location
          // This is a simplistic approach that would work in most cases
          // In a more sophisticated app, you might want to use a custom event or context
          if (!window.location.pathname.includes('/login')) {
            // Add a small delay to allow the current operation to finish
            setTimeout(() => {
              window.location.href = '/login';
            }, 100);
          }
        }
        break;
      
      case 403: // Forbidden
        // Handle forbidden errors
        console.error('Access forbidden:', data?.message || 'You do not have permission to access this resource');
        break;
      
      case 404: // Not Found
        // Handle not found errors
        console.error('Resource not found:', args.url);
        break;
      
      case 500: // Server Error
      case 502: // Bad Gateway
      case 503: // Service Unavailable
      case 504: // Gateway Timeout
        // Handle server errors
        console.error('Server error:', data?.message || 'There was a problem with the server');
        break;
      
      default:
        // Handle other errors
        if (!navigator.onLine) {
          // Handle offline state
          console.error('Network error: You are offline');
        } else {
          console.error('API Error:', data?.message || 'An unknown error occurred');
        }
        break;
    }
  }
  
  return result;
};

export default baseQueryWithErrorHandling;