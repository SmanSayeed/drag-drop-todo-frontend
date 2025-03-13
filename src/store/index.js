// src/store/index.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

// Import reducers and API services
import taskReducer from './slices/taskSlice';
import { taskApi } from './services/taskApi';
import { authApi } from './services/authApi';

// Configure redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['tasks'], // Only persist tasks reducer
  blacklist: [taskApi.reducerPath, authApi.reducerPath] // Don't persist RTK Query cache
};

// Combine reducers
const rootReducer = combineReducers({
  tasks: taskReducer,
  [taskApi.reducerPath]: taskApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore redux-persist actions
        ignoredPaths: ['tasks.filters.due_date_from', 'tasks.filters.due_date_to'] // Ignore date objects
      },
    }).concat(taskApi.middleware, authApi.middleware, thunk),
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Create persistor
export const persistor = persistStore(store);

export default store;