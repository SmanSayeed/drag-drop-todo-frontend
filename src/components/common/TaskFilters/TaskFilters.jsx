// src/components/common/TaskFilters/TaskFilters.jsx
import React from 'react';
import { FaFilter, FaSort } from 'react-icons/fa';

const TaskFilters = ({ filters, onFilterChange }) => {
  // Handle status filter change
  const handleStatusChange = (e) => {
    onFilterChange({
      ...filters,
      status: e.target.value
    });
  };

  // Handle due date filter change
  const handleDueDateChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  // Handle sort options change
  const handleSortChange = (field) => {
    const newDirection = 
      filters.sort_by === field && filters.sort_direction === 'asc' 
        ? 'desc' 
        : 'asc';
    
    onFilterChange({
      ...filters,
      sort_by: field,
      sort_direction: newDirection
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaFilter className="inline mr-1" />
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {/* Due Date Range Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaFilter className="inline mr-1" />
            Due Date From
          </label>
          <input
            type="date"
            value={filters.due_date_from || ''}
            onChange={(e) => handleDueDateChange('due_date_from', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaFilter className="inline mr-1" />
            Due Date To
          </label>
          <input
            type="date"
            value={filters.due_date_to || ''}
            onChange={(e) => handleDueDateChange('due_date_to', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Sort Options */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaSort className="inline mr-1" />
            Sort By
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSortChange('name')}
              className={`px-3 py-2 text-sm rounded-md flex-1 ${
                filters.sort_by === 'name'
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              Name
              {filters.sort_by === 'name' && (
                <span className="ml-1">
                  {filters.sort_direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
            <button
              onClick={() => handleSortChange('due_date')}
              className={`px-3 py-2 text-sm rounded-md flex-1 ${
                filters.sort_by === 'due_date'
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              Due Date
              {filters.sort_by === 'due_date' && (
                <span className="ml-1">
                  {filters.sort_direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Filter Clear Button */}
      {(filters.status || filters.due_date_from || filters.due_date_to) && (
        <div className="mt-2 text-right">
          <button
            onClick={() => onFilterChange({
              sort_by: filters.sort_by || 'created_at',
              sort_direction: filters.sort_direction || 'desc'
            })}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;