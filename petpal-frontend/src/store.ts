// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';
import authReducer from './features/auth/authSlice';
import { petApi } from './features/pet/petApi'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
    [petApi.reducerPath]: petApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;