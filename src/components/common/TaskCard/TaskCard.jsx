// src/components/common/TaskCard/TaskCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaClock } from 'react-icons/fa';
import { formatDate } from '../../../utils/dateUtils';

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onDragStart, 
  onDragEnd,
  isEditable = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Status badge colors
  const statusColors = {
    'To Do': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Done': 'bg-green-100 text-green-800'
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-4 mb-3 cursor-grab relative"
      draggable={isEditable}
      onDragStart={(e) => onDragStart?.(e, task)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Task Title */}
      <h3 className="font-medium text-gray-900 mb-1 pr-16 truncate">{task.name}</h3>
      
      {/* Task Description */}
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      
      {/* Task Metadata */}
      <div className="flex items-center justify-between">
        {/* Due Date */}
        <div className="flex items-center text-xs text-gray-500">
          <FaClock className="mr-1" />
          <span>{formatDate(task.due_date)}</span>
        </div>
        
        {/* Status Badge */}
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
          {task.status}
        </span>
      </div>
      
      {/* Action Buttons - Only visible on hover and if editable */}
      {isEditable && isHovered && (
        <motion.div 
          className="absolute top-2 right-2 flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(task);
            }}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            aria-label="Edit task"
          >
            <FaEdit size={14} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(task.id);
            }}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600"
            aria-label="Delete task"
          >
            <FaTrash size={14} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskCard;