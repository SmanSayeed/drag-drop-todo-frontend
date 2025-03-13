// src/components/ui/Loading/Loading.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

/**
 * Loading spinner component with customizable size and text
 * @param {Object} props - Component props
 * @param {string} props.size - Size of spinner ('sm', 'md', 'lg')
 * @param {string} props.text - Optional text to display
 * @param {boolean} props.fullScreen - Whether to display in full screen
 * @param {string} props.className - Additional CSS classes
 */
const Loading = ({ 
  size = 'md', 
  text, 
  fullScreen = false,
  className = '',
}) => {
  // Determine spinner size
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  
  // Spinner component with animation
  const Spinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <FaSpinner className={`text-indigo-600 ${sizeClasses[size] || sizeClasses.md}`} />
    </motion.div>
  );
  
  // Full screen loading
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
        <Spinner />
        {text && (
          <p className="mt-4 text-gray-600 font-medium">{text}</p>
        )}
      </div>
    );
  }
  
  // Inline loading
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Spinner />
      {text && (
        <p className="mt-2 text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );
};

export default Loading;