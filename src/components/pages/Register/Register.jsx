// src/pages/Register/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuthError } from '../../store/slices/authSlice';
import { useRegisterMutation } from '../../store/services/authApi';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  
  // Get auth state from Redux
  const { isAuthenticated, error } = useSelector(state => state.auth);
  
  // RTK Query register mutation
  const [register, { isLoading }] = useRegisterMutation();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  // Show auth error
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, toast, dispatch]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await register(formData).unwrap();
      toast.success('Registration successful! Redirecting to tasks...');
      // Navigation will happen automatically in the useEffect
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show field-specific validation errors if available
      const validationErrors = error.data?.errors;
      if (validationErrors) {
        setFormErrors(validationErrors);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full bg-white rounded-lg shadow-md p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create a new account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="name"
            name="name"
            type="text"
            label="Full Name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            error={formErrors.name}
            icon={<FaUser className="text-gray-400" />}
            required
          />
          
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            icon={<FaEnvelope className="text-gray-400" />}
            required
          />
          
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            icon={<FaLock className="text-gray-400" />}
            required
          />
          
          <Input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.password_confirmation}
            onChange={handleChange}
            error={formErrors.password_confirmation}
            icon={<FaLock className="text-gray-400" />}
            required
          />
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            icon={<FaUserPlus />}
          >
            Register
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-indigo-500">
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;