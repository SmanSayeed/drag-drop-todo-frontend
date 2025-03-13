// src/store/slices/taskSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // For local state management
  activeView: 'board', // 'board' or 'list'
  
  // For caching task state
  filteredTasks: [],
  
  // For filters that persist between sessions
  filters: {
    status: '',
    due_date_from: '',
    due_date_to: '',
    search: '',
    sort_by: 'created_at',
    sort_direction: 'desc',
    per_page: 10,
  },
  
  // UI state
  isTaskModalOpen: false,
  currentTaskId: null,
  isNewTask: false,
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Set active view (board or list)
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    
    // Update task filters
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    
    // Reset filters to default
    resetFilters: (state) => {
      state.filters = {
        ...initialState.filters,
      };
    },
    
    // Open task modal (create or edit)
    openTaskModal: (state, action) => {
      state.isTaskModalOpen = true;
      state.currentTaskId = action.payload?.taskId || null;
      state.isNewTask = action.payload?.isNew || false;
    },
    
    // Close task modal
    closeTaskModal: (state) => {
      state.isTaskModalOpen = false;
      state.currentTaskId = null;
      state.isNewTask = false;
    },
    
    // Clear all task state (for logout)
    clearTaskState: () => initialState,
  },
});

export const {
  setActiveView,
  setFilters,
  resetFilters,
  openTaskModal,
  closeTaskModal,
  clearTaskState,
} = taskSlice.actions;

export default taskSlice.reducer;