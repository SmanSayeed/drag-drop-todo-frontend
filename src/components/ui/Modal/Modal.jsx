// src/components/ui/Modal/Modal.jsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer = null,
}) => {
  // Modal sizes
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent scrolling while modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // Restore scrolling when modal closes
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, closeOnEscape]);
  
  // Return null if the modal is not open
  if (!isOpen) return null;
  
  // Render the modal using a portal
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
          />
          
          {/* Modal Content */}
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <motion.div
              className={`${sizes[size] || sizes.md} w-full bg-white rounded-lg text-left shadow-xl transform transition-all`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >
              {/* Modal Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  {title && (
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                  )}
                  {showCloseButton && (
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-500 rounded-full p-1 inline-flex items-center justify-center"
                      onClick={onClose}
                      aria-label="Close modal"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}
              
              {/* Modal Body */}
              <div className="p-6">{children}</div>
              
              {/* Modal Footer */}
              {footer && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;