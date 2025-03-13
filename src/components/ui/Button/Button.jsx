// src/components/ui/Button/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Button variants
 * primary: Main action button
 * secondary: Alternative action
 * danger: Destructive action
 * success: Confirmation action
 * outline: Subtle action
 * ghost: Very subtle action
 */
const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white',
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
  success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white',
  outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-indigo-500',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500'
};

/**
 * Button sizes
 * xs: Extra small
 * sm: Small
 * md: Medium (default)
 * lg: Large
 * xl: Extra large
 */
const sizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
  xl: 'px-6 py-3 text-base'
};

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;
  const widthStyle = fullWidth ? 'w-full' : '';
  
  return (
    <motion.button
      type={type}
      className={`${baseStyles} ${variantStyle} ${sizeStyle} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && (
        <svg 
          className={`animate-spin -ml-1 mr-2 h-4 w-4 ${variant.includes('outline') || variant === 'ghost' ? 'text-gray-600' : 'text-white'}`} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {/* Icon - left position */}
      {icon && iconPosition === 'left' && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {/* Button text */}
      {children}
      
      {/* Icon - right position */}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
};

export default Button;