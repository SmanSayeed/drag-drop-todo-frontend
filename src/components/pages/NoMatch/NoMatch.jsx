// src/pages/NoMatch/NoMatch.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Button from '../../ui/Button/Button';

const NoMatch = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div 
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaExclamationTriangle className="mx-auto text-yellow-500 text-6xl mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" icon={<FaHome />}>
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NoMatch;