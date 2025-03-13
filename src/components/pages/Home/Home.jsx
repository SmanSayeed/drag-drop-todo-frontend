// src/pages/Home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTasks, FaClipboardList, FaCheck, FaSignInAlt, FaUserPlus, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button/Button';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Features of the app
  const features = [
    {
      icon: <FaClipboardList className="text-indigo-600 text-3xl" />,
      title: 'Task Management',
      description: 'Create, edit, and delete tasks with ease. Keep track of your to-dos in one place.'
    },
    {
      icon: <FaTasks className="text-indigo-600 text-3xl" />,
      title: 'Drag & Drop Interface',
      description: 'Intuitive drag and drop interface for managing task status and organization.'
    },
    {
      icon: <FaCheck className="text-indigo-600 text-3xl" />,
      title: 'Progress Tracking',
      description: 'Track your progress with visual indicators as you move tasks from To Do to Done.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Nav */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              Task Manager
            </Link>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">
                    Welcome, {user?.name}
                  </span>
                  <Link to="/tasks">
                    <Button variant="primary" size="sm">
                      My Tasks
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="outline" size="sm" icon={<FaSignInAlt />}>
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm" icon={<FaUserPlus />}>
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-12 bg-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
              Organize Your Tasks <span className="text-indigo-600">Effortlessly</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              A simple, intuitive task management application to help you stay organized and productive. 
              Manage your tasks with ease using our powerful drag-and-drop interface.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <Link to="/tasks">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    icon={<FaArrowRight />}
                    iconPosition="right"
                  >
                    Go to My Tasks
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      icon={<FaUserPlus />}
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      icon={<FaSignInAlt />}
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Key Features
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center"
                variants={itemVariants}
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Get Organized?
            </h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Start managing your tasks more efficiently today. Sign up for free and 
              experience the difference a well-organized task system can make.
            </p>
            {!isAuthenticated && (
              <Link to="/register">
                <Button 
                  variant="success" 
                  size="lg" 
                  className="bg-white text-indigo-600 hover:bg-indigo-50"
                >
                  Create Your Free Account
                </Button>
              </Link>
            )}
            {isAuthenticated && (
              <Link to="/tasks">
                <Button 
                  variant="success" 
                  size="lg" 
                  className="bg-white text-indigo-600 hover:bg-indigo-50"
                >
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white">Task Manager</h3>
              <p className="text-sm">Simplify your task management process</p>
            </div>
            <div>
              <p className="text-sm">
                &copy; {new Date().getFullYear()} Task Manager App. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;