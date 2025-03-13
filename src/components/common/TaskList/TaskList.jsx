// src/components/common/TaskList/TaskList.jsx
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TaskCard from '../TaskCard/TaskCard';
import { FaTasks } from 'react-icons/fa';

const TaskList = ({ 
  tasks = [], 
  onEdit, 
  onDelete, 
  isLoading = false,
  onDragStart, 
  onDragEnd 
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-indigo-500"
        >
          <FaTasks size={32} />
        </motion.div>
      </div>
    );
  }
  
  // Empty state
  if (tasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-50 rounded-lg p-8 text-center"
      >
        <FaTasks size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
        <p className="text-gray-500">Try adjusting your filters or adding a new task.</p>
      </motion.div>
    );
  }
  
  return (
    <div className="py-2">
      <AnimatePresence>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;