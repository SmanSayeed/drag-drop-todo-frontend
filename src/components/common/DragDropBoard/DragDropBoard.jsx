// src/components/common/DragDropContext/DragDropBoard.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TaskCard from '../TaskCard/TaskCard';
import useDragAndDrop from '../../../hooks/useDragAndDrop';

const DragDropBoard = ({ tasks, onEdit, onDelete, onTaskStatusChange, isLoading }) => {
  // Group tasks by status
  const [groupedTasks, setGroupedTasks] = useState({
    'To Do': [],
    'In Progress': [],
    'Done': []
  });
  
  // Set up drag and drop functionality
  const { 
    tasks: dndTasks, 
    setTasks: setDndTasks,
    handleDragStart, 
    handleDragEnd, 
    handleDragOver, 
    handleDragLeave, 
    handleDrop 
  } = useDragAndDrop(groupedTasks, onTaskStatusChange);
  
  // When tasks change, update the grouped tasks
  useEffect(() => {
    if (tasks && Array.isArray(tasks)) {
      const grouped = tasks.reduce((acc, task) => {
        const status = task.status || 'To Do';
        
        if (!acc[status]) {
          acc[status] = [];
        }
        
        acc[status].push(task);
        return acc;
      }, {
        'To Do': [],
        'In Progress': [],
        'Done': []
      });
      
      setGroupedTasks(grouped);
      setDndTasks(grouped);
    }
  }, [tasks, setDndTasks]);
  
  // Define the status columns and their styles
  const columns = [
    { 
      id: 'To Do', 
      title: 'To Do', 
      color: 'bg-blue-50 border-blue-200',
      icon: '📋'
    },
    { 
      id: 'In Progress', 
      title: 'In Progress', 
      color: 'bg-yellow-50 border-yellow-200',
      icon: '⚙️'
    },
    { 
      id: 'Done', 
      title: 'Done', 
      color: 'bg-green-50 border-green-200',
      icon: '✅'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map(column => (
        <div 
          key={column.id}
          className={`${column.color} rounded-lg shadow p-4 border-t-4`}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="mr-2">{column.icon}</span> 
              {column.title}
            </h3>
            <span className="bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {dndTasks[column.id]?.length || 0}
            </span>
          </div>
          
          {/* Tasks Container */}
          <div
            className={`min-h-[200px] transition duration-300 ${
              isLoading ? 'opacity-50' : 'opacity-100'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Display tasks in this column */}
            {dndTasks[column.id]?.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg"
              >
                <p className="text-gray-500 text-center text-sm">
                  Drop tasks here
                </p>
              </motion.div>
            ) : (
              dndTasks[column.id]?.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DragDropBoard;