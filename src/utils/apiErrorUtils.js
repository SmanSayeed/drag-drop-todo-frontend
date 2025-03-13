// src/utils/apiErrorUtils.js

/**
 * Extract a user-friendly error message from an API error response
 * @param {Object} error - Error object from RTK Query
 * @param {string} defaultMessage - Default message to show if we can't extract a specific error
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error, defaultMessage = 'An error occurred. Please try again.') => {
    // Network error
    if (error?.status === 'FETCH_ERROR') {
      return 'Network error. Please check your connection.';
    }
  
    // Timeout error
    if (error?.status === 'TIMEOUT_ERROR') {
      return 'Request timed out. Please try again.';
    }
  
    // Parse API error
    if (error?.data) {
      // Most common API error format
      if (error.data.message) {
        return error.data.message;
      }
  
      // Laravel validation error format
      if (error.data.errors) {
        // Get first validation error
        const firstError = Object.values(error.data.errors)[0];
        return Array.isArray(firstError) ? firstError[0] : firstError;
      }
    }
  
    // Fallback to status text
    if (error?.status && typeof error.status === 'number') {
      return `Error: ${error.status} ${error.statusText || ''}`.trim();
    }
  
    // Default message
    return defaultMessage;
  };
  
  /**
   * Extract validation errors from API response for form fields
   * @param {Object} error - Error object from RTK Query
   * @returns {Object} Object with field names as keys and error messages as values
   */
  export const getValidationErrors = (error) => {
    if (error?.data?.errors && typeof error.data.errors === 'object') {
      return error.data.errors;
    }
    return {};
  };
  
  /**
   * Check if the error is a validation error
   * @param {Object} error - Error object from RTK Query
   * @returns {boolean} True if it's a validation error
   */
  export const isValidationError = (error) => {
    return error?.status === 422 && !!error?.data?.errors;
  };
  
  /**
   * Check if the error is an authentication error
   * @param {Object} error - Error object from RTK Query
   * @returns {boolean} True if it's an authentication error
   */
  export const isAuthError = (error) => {
    return error?.status === 401;
  };
  
  /**
   * Check if the error is a permission error
   * @param {Object} error - Error object from RTK Query
   * @returns {boolean} True if it's a permission error
   */
  export const isPermissionError = (error) => {
    return error?.status === 403;
  };
  
  /**
   * Check if the error is a network error
   * @param {Object} error - Error object from RTK Query
   * @returns {boolean} True if it's a network error
   */
  export const isNetworkError = (error) => {
    return error?.status === 'FETCH_ERROR';
  };