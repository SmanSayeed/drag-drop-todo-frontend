// src/config/apiConfig.js

const config = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
    AUTH_TOKEN_KEY: 'task_manager_token',
  };
  
export default config;