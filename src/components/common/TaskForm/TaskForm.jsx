// src/components/common/TaskForm/TaskForm.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  // Initial form state
  const initialState = {
    name: '',
    description: '',
    status: 'To Do',
    due_date: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // If we have a task, populate the form with its data
  useEffect(() => {
    if (task) {
      // Format the date to YYYY-MM-DD
      const formattedDate = task.due_date ? 
        new Date(task.due_date).toISOString().split('T')[0] : '';
      
      setFormData({
        name: task.name || '',
        description: task.description || '',
        status: task.status || 'To Do',
        due_date: formattedDate || ''
      });
    }
  }, [task]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the error for this field when it's updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    // Name is required and max 255 characters
    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required';
    } else if (formData.name.length > 255) {
      newErrors.name = 'Task name must be less than 255 characters';
    }
    
    // Due date must be in the future if provided
    if (formData.due_date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dueDate = new Date(formData.due_date);
      dueDate.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.due_date = 'Due date must be today or in the future';
      }
    }
    
    // Status must be one of the allowed values
    const allowedStatuses = ['To Do', 'In Progress', 'Done'];
    if (!allowedStatuses.includes(formData.status)) {
      newErrors.status = 'Invalid status';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Format the date for the API (DD-MM-YYYY)
      const apiFormData = { ...formData };
      if (apiFormData.due_date) {
        const [year, month, day] = apiFormData.due_date.split('-');
        apiFormData.due_date = `${day}-${month}-${year}`;
      }
      
      await onSubmit(apiFormData);
      
      // Clear the form if it's a new task
      if (!task) {
        setFormData(initialState);
      }
    } catch (error) {
      // If we get validation errors from the API, display them
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {task ? 'Edit Task' : 'Add New Task'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close form"
          >
            <FaTimes className="text-gray-500" />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Task Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter task name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        {/* Task Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter task description"
          ></textarea>
        </div>
        
        {/* Task Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status*
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.status ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
          )}
        </div>
        
        {/* Due Date */}
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.due_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.due_date && (
            <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;