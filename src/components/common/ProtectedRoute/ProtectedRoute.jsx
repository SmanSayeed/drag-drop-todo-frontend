// src/components/common/ProtectedRoute/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading, selectCurrentUser } from '../../../store/slices/authSlice';
import Loading from '../../ui/Loading/Loading';

/**
 * A wrapper around routes that require authentication
 * Redirects to login page if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectAuthLoading);
  
  // Show loading state if checking authentication
  if (isLoading) {
    return <Loading fullScreen text="Authenticating..." />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    // Pass the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;