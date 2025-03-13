// src/hooks/useApiError.js
import { useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { 
  getErrorMessage, 
  isValidationError, 
  isNetworkError 
} from '../utils/apiErrorUtils';

/**
 * Custom hook for handling API errors from RTK Query
 * @param {Object} options - Configuration options
 * @param {Object} options.error - Error object from RTK Query
 * @param {function} options.setFormErrors - Function to set form errors (optional)
 * @param {boolean} options.showToast - Whether to show error toast (default: true)
 * @param {string} options.defaultMessage - Default error message
 * @param {function} options.onError - Custom error handler (optional)
 * @returns {Object} Error handling utilities
 */
const useApiError = ({
  error,
  setFormErrors,
  showToast = true,
  defaultMessage = 'An error occurred. Please try again.',
  onError = null,
}) => {
  const toast = useToast();

  // Handle API errors
  useEffect(() => {
    if (!error) return;

    // Call custom error handler if provided
    if (onError && typeof onError === 'function') {
      onError(error);
    }

    // Handle form validation errors
    if (setFormErrors && isValidationError(error)) {
      setFormErrors(error.data.errors);
    }

    // Show toast notification for non-validation errors
    if (showToast && (!isValidationError(error) || isNetworkError(error))) {
      const message = getErrorMessage(error, defaultMessage);
      toast.error(message);
    }
  }, [error, setFormErrors, showToast, defaultMessage, onError, toast]);

  // Get error message for a specific field
  const getFieldError = (fieldName) => {
    if (!error?.data?.errors) return null;
    return error.data.errors[fieldName]?.[0] || null;
  };

  // Check if a specific field has an error
  const hasFieldError = (fieldName) => {
    return !!getFieldError(fieldName);
  };

  // Clear the error state (useful in forms)
  const clearError = () => {
    if (setFormErrors) {
      setFormErrors({});
    }
  };

  return {
    isValidationError: isValidationError(error),
    isNetworkError: isNetworkError(error),
    errorMessage: getErrorMessage(error, defaultMessage),
    getFieldError,
    hasFieldError,
    clearError,
  };
};

export default useApiError;