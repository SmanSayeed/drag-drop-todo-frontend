// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaInfoCircle, 
  FaExclamationTriangle, 
  FaTimesCircle, 
  FaTimes 
} from 'react-icons/fa';

// Create context
const ToastContext = createContext();

// Toast types with their icons and styles
const TOAST_TYPES = {
  success: {
    icon: FaCheckCircle,
    className: 'bg-green-100 border-green-400 text-green-700'
  },
  info: {
    icon: FaInfoCircle,
    className: 'bg-blue-100 border-blue-400 text-blue-700'
  },
  warning: {
    icon: FaExclamationTriangle,
    className: 'bg-yellow-100 border-yellow-400 text-yellow-700'
  },
  error: {
    icon: FaTimesCircle,
    className: 'bg-red-100 border-red-400 text-red-700'
  }
};

// Default duration for toasts
const DEFAULT_DURATION = 5000;

// Toast component
const Toast = ({ id, type, message, onClose }) => {
  const { icon: Icon, className } = TOAST_TYPES[type] || TOAST_TYPES.info;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center w-full max-w-sm p-4 mb-3 rounded-lg shadow-lg border-l-4 ${className}`}
    >
      <div className="flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="ml-3 mr-6 text-sm font-normal flex-grow">{message}</div>
      <button
        onClick={() => onClose(id)}
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-gray-200 inline-flex h-8 w-8 items-center justify-center"
      >
        <FaTimes className="w-3 h-3" />
      </button>
    </motion.div>
  );
};

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  // Generate a unique ID for each toast
  const generateUniqueId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }, []);
  
  // Add a new toast
  const addToast = useCallback((type, message, duration = DEFAULT_DURATION) => {
    const id = generateUniqueId();
    
    setToasts(prevToasts => [
      ...prevToasts,
      { id, type, message }
    ]);
    
    // Auto-remove toast after duration
    if (duration !== null) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, [generateUniqueId]);
  
  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);
  
  // Shorthand methods for different toast types
  const toast = {
    success: (message, duration) => addToast('success', message, duration),
    info: (message, duration) => addToast('info', message, duration),
    warning: (message, duration) => addToast('warning', message, duration),
    error: (message, duration) => addToast('error', message, duration),
    remove: removeToast
  };
  
  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 w-full max-w-sm">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};