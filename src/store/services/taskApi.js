// src/store/services/taskApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';
import { formatDateForApi } from '../../utils/dateUtils';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery,
  tagTypes: ['Tasks', 'Task'],
  endpoints: (builder) => ({
    // Get all tasks with optional filters
    getTasks: builder.query({
      query: (params = {}) => ({
        url: '/tasks',
        params,
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'Tasks', id })),
              { type: 'Tasks', id: 'LIST' },
            ]
          : [{ type: 'Tasks', id: 'LIST' }],
    }),
    
    // Get a single task by ID
    getTaskById: builder.query({
      query: (id) => `/tasks/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Tasks', id }],
    }),
    
    // Create a new task
    createTask: builder.mutation({
      query: (task) => {
        // Format due date for API
        const transformedTask = { ...task };
        if (transformedTask.due_date) {
          transformedTask.due_date = formatDateForApi(transformedTask.due_date);
        }
        
        return {
          url: '/tasks',
          method: 'POST',
          body: transformedTask,
        };
      },
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
      // Optimistic update
      async onQueryStarted(task, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: response } = await queryFulfilled;
          
          // Update any existing cached data
          dispatch(
            taskApi.util.updateQueryData('getTasks', getState().tasks.filters, (draft) => {
              draft.data.unshift(response.data);
            })
          );
        } catch {
          // Error is handled by RTK Query
        }
      },
    }),
    
    // Update an existing task
    updateTask: builder.mutation({
      query: ({ id, ...task }) => {
        // Format due date for API
        const transformedTask = { ...task };
        if (transformedTask.due_date) {
          transformedTask.due_date = formatDateForApi(transformedTask.due_date);
        }
        
        return {
          url: `/tasks/${id}`,
          method: 'PUT',
          body: transformedTask,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Tasks', id }],
      // Optimistic update
      async onQueryStarted({ id, ...task }, { dispatch, queryFulfilled, getState }) {
        const patchResult = dispatch(
          taskApi.util.updateQueryData('getTasks', getState().tasks.filters, (draft) => {
            const index = draft.data.findIndex(t => t.id === id);
            if (index !== -1) {
              draft.data[index] = { ...draft.data[index], ...task, id };
            }
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          // Undo the optimistic update on error
          patchResult.undo();
        }
      },
    }),
    
    // Update only task status (for drag and drop)
    updateTaskStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tasks', id }],
      // Optimistic update
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled, getState }) {
        const patchResult = dispatch(
          taskApi.util.updateQueryData('getTasks', getState().tasks.filters, (draft) => {
            const index = draft.data.findIndex(t => t.id === id);
            if (index !== -1) {
              draft.data[index].status = status;
            }
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          // Undo the optimistic update on error
          patchResult.undo();
        }
      },
    }),
    
    // Delete a task
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const patchResult = dispatch(
          taskApi.util.updateQueryData('getTasks', getState().tasks.filters, (draft) => {
            const index = draft.data.findIndex(t => t.id === id);
            if (index !== -1) {
              draft.data.splice(index, 1);
            }
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          // Undo the optimistic update on error
          patchResult.undo();
        }
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} = taskApi;