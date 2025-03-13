// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUserProfileQuery } from './store/services/authApi';
import { selectAuthError, logout } from './store/slices/authSlice';
import config from './config/apiConfig';

// Context providers
import { ToastProvider } from './context/ToastContext';

// Components
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';

// Pages
import Home from './components/pages/Home/Home';
import Login from './components/pages/Login/Login';
import Register from './components/pages/Register/Register';
import Tasks from './components/pages/Tasks/Tasks';
import NoMatch from './components/pages/NoMatch/NoMatch';

// App wrapper with Redux providers
const AppWrapper = () => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

// App content with routing
const AppContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authError = useSelector(selectAuthError);
  
  // Fetch user profile if we have a token
  const token = localStorage.getItem(config.AUTH_TOKEN_KEY);
  const { error: profileError } = useGetUserProfileQuery(undefined, {
    skip: !token || !navigator.onLine,
  });
  
  // Handle authentication errors (expired token)
  useEffect(() => {
    if (profileError && profileError.status === 401 && token) {
      // Clear token and redirect to login
      dispatch(logout());
      navigate('/login');
    }
  }, [profileError, dispatch, navigate, token]);
  
  // Handle other auth errors
  useEffect(() => {
    if (authError) {
      console.error('Auth error:', authError);
    }
  }, [authError]);
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route 
        path="/tasks" 
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 route */}
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
};

export default AppWrapper;