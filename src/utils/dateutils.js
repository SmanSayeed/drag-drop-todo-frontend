// src/utils/dateUtils.js

/**
 * Formats a date string to a human-friendly format
 * @param {string|Date} dateString - The date to format
 * @param {string} format - The format to use (default: 'medium')
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, format = 'medium') => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    
    // Invalid date
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const now = new Date();
    const isToday = 
      date.getDate() === now.getDate() && 
      date.getMonth() === now.getMonth() && 
      date.getFullYear() === now.getFullYear();
    
    const isTomorrow = 
      date.getDate() === now.getDate() + 1 && 
      date.getMonth() === now.getMonth() && 
      date.getFullYear() === now.getFullYear();
    
    const isYesterday = 
      date.getDate() === now.getDate() - 1 && 
      date.getMonth() === now.getMonth() && 
      date.getFullYear() === now.getFullYear();
    
    // Check if date is within the past week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const isWithinPastWeek = date >= oneWeekAgo && date < now;
    
    // Check if date is within the next week
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const isWithinNextWeek = date > now && date <= oneWeekFromNow;
    
    // Date formatting based on format parameter
    switch (format) {
      case 'short':
        return new Intl.DateTimeFormat('en-US', { 
          month: 'numeric', 
          day: 'numeric', 
          year: '2-digit' 
        }).format(date);
        
      case 'long':
        return new Intl.DateTimeFormat('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        }).format(date);
        
      case 'relative':
        if (isToday) return 'Today';
        if (isTomorrow) return 'Tomorrow';
        if (isYesterday) return 'Yesterday';
        if (isWithinPastWeek) {
          return `${Math.ceil((now - date) / (1000 * 60 * 60 * 24))} days ago`;
        }
        if (isWithinNextWeek) {
          return `In ${Math.ceil((date - now) / (1000 * 60 * 60 * 24))} days`;
        }
        // Fall back to medium format for dates outside the range
        return new Intl.DateTimeFormat('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }).format(date);
        
      case 'medium':
      default:
        return new Intl.DateTimeFormat('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }).format(date);
    }
  };
  
  /**
   * Formats a date to YYYY-MM-DD format for input[type=date]
   * @param {string|Date} dateString - The date to format
   * @returns {string} - Formatted date string
   */
  export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Invalid date
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
  };
  
  /**
   * Formats a date from API format (DD-MM-YYYY) to a JavaScript Date object
   * @param {string} apiDateString - The date string from API (DD-MM-YYYY)
   * @returns {Date|null} - JavaScript Date object or null if invalid
   */
  export const parseApiDate = (apiDateString) => {
    if (!apiDateString) return null;
    
    // Check if the date is already in the correct format
    if (apiDateString.includes('T') || apiDateString.includes('-')) {
      return new Date(apiDateString);
    }
    
    // Parse from DD-MM-YYYY format
    const [day, month, year] = apiDateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  
  /**
   * Formats a date to API format (DD-MM-YYYY)
   * @param {string|Date} dateString - The date to format
   * @returns {string} - Formatted date string for API
   */
  export const formatDateForApi = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    
    // Invalid date
    if (isNaN(date.getTime())) return null;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  };
  
  /**
   * Checks if a date is in the past
   * @param {string|Date} dateString - The date to check
   * @returns {boolean} - True if the date is in the past
   */
  export const isDatePast = (dateString) => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const now = new Date();
    
    // Set time to midnight for comparison
    date.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    return date < now;
  };
  
  /**
   * Checks if a date is today
   * @param {string|Date} dateString - The date to check
   * @returns {boolean} - True if the date is today
   */
  export const isDateToday = (dateString) => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const now = new Date();
    
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };
  
  /**
   * Get the number of days between two dates
   * @param {string|Date} startDate - The start date
   * @param {string|Date} endDate - The end date
   * @returns {number} - Number of days between dates
   */
  export const getDaysBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Reset times to midnight for accurate day calculation
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    // Calculate the difference in days
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
    
    return differenceInDays;
  };