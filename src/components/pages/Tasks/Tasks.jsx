// src/pages/Tasks/Tasks.jsx
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaThLarge, FaList } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { clearTaskState } from '../../store/slices/taskSlice';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button/Button';
import TaskList from './TaskList';
import TaskBoard from './TaskBoard';

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  
  // Determine active view (list or board)
  const [activeView, setActiveView] = useState('board');
  
  // Reset task state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearTaskState());
    };
  }, [dispatch]);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              Task Manager
            </Link>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center">
                  <span className="text-gray-700 mr-2">
                    Hi, {user.name}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        {/* View toggle buttons */}
        <div className="flex justify-end mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                activeView === 'list'
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setActiveView('list')}
            >
              <FaList className="inline-block mr-2" />
              List View
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                activeView === 'board'
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setActiveView('board')}
            >
              <FaThLarge className="inline-block mr-2" />
              Board View
            </button>
          </div>
        </div>
        
        {/* Task view (list or board) */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'list' ? <TaskList /> : <TaskBoard />}
        </motion.div>
        
        {/* Outlet for nested routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default Tasks;