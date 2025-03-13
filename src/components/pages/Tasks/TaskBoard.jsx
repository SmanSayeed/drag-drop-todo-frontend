// src/pages/Tasks/TaskBoard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaPlus, FaListUl, FaThLarge } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Components
import SearchBar from '../../components/common/SearchBar/SearchBar';
import TaskFilters from '../../components/common/TaskFilters/TaskFilters';
import DragDropBoard from '../../components/common/DragDropContext/DragDropBoard';
import Modal from '../../components/ui/Modal/Modal';
import TaskForm from '../../components/common/TaskForm/TaskForm';
import Button from '../../components/ui/Button/Button';

// Services
import taskService from '../../api/services/taskService';

// Redux actions
import { 
  setTasks, 
  setFilters, 
  updateTaskStatus, 
  setLoading 
} from '../../store/slices/taskSlice';

// Toast notifications
import { useToast } from '../../context/ToastContext';

const TaskBoard = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector(state => state.tasks);
  const toast = useToast();
  const queryClient = useQueryClient();
  
  // Local state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  // Task query with React Query
  const { 
    isLoading, 
    isError, 
    data: tasksData 
  } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters),
    keepPreviousData: true,
    onSuccess: (data) => {
      dispatch(setTasks(data.data));
    },
    onError: () => {
      toast.error('Failed to load tasks. Please try again.');
    },
  });
  
  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (taskData) => taskService.createTask(taskData),
    onSuccess: () => {
      toast.success('Task created successfully!');
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries(['tasks']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    },
  });
  
  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, taskData }) => taskService.updateTask(id, taskData),
    onSuccess: () => {
      toast.success('Task updated successfully!');
      setIsEditModalOpen(false);
      setCurrentTask(null);
      queryClient.invalidateQueries(['tasks']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    },
  });
  
  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (id) => taskService.deleteTask(id),
    onSuccess: () => {
      toast.success('Task deleted successfully!');
      queryClient.invalidateQueries(['tasks']);
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });
  
  // Update task status mutation (for drag and drop)
  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ id, status }) => taskService.updateTask(id, { status }),
    onError: (error, variables) => {
      toast.error('Failed to update task status');
      // Revert the optimistic update on error
      queryClient.invalidateQueries(['tasks']);
    },
  });
  
  // Handle search
  const handleSearch = useCallback((searchTerm) => {
    dispatch(setFilters({ search: searchTerm }));
  }, [dispatch]);
  
  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);
  
  // Handle create task
  const handleCreateTask = (taskData) => {
    createTaskMutation.mutate(taskData);
  };
  
  // Handle edit task
  const handleEditTask = (task) => {
    setCurrentTask(task);
    setIsEditModalOpen(true);
  };
  
  // Handle update task
  const handleUpdateTask = (taskData) => {
    if (!currentTask) return;
    updateTaskMutation.mutate({ id: currentTask.id, taskData });
  };
  
  // Handle delete task
  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };
  
  // Handle task status change (from drag and drop)
  const handleTaskStatusChange = (taskId, newStatus) => {
    // Optimistic update in redux
    dispatch(updateTaskStatus({ taskId, newStatus }));
    
    // Call API to update status
    updateTaskStatusMutation.mutate({ id: taskId, status: newStatus });
  };
  
  // Show loading state
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);
  
  // Tasks data
  const tasks = tasksData?.data?.data || [];
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Task Board</h1>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            icon={<FaPlus />}
            variant="primary"
          >
            Add New Task
          </Button>
        </div>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-6 space-y-4">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search tasks..." 
          className="mb-4"
        />
        
        <TaskFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
      </div>
      
      {/* Task board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DragDropBoard
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onTaskStatusChange={handleTaskStatusChange}
          isLoading={isLoading}
        />
      </motion.div>
      
      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
        size="md"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
      
      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentTask(null);
        }}
        title="Edit Task"
        size="md"
      >
        <TaskForm
          task={currentTask}
          onSubmit={handleUpdateTask}
          onCancel={() => {
            setIsEditModalOpen(false);
            setCurrentTask(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default TaskBoard;