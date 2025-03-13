// src/components/common/SearchBar/SearchBar.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import useDebounce from '../../../hooks/useDebounce';

const SearchBar = ({ onSearch, placeholder = 'Search tasks...', delay = 500, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  // When the debounced search term changes, call the onSearch callback
  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  // Clear the search input
  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center relative">
        <FaSearch className="absolute left-3 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder={placeholder}
          aria-label="Search"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>
      {debouncedSearchTerm !== searchTerm && (
        <div className="absolute right-3 -top-2 h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
      )}
    </div>
  );
};

export default SearchBar;